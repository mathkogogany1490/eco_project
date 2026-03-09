import uuid
import os
from django.conf import settings
from django.contrib.auth import authenticate
from django.utils import timezone

from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from rest_framework.parsers import MultiPartParser, FormParser

from rest_framework_simplejwt.tokens import AccessToken

from .models import User, Place, Contract, WastePrice, Weighing
from .serializers import (
    LoginSerializer,
    PlaceSerializer,
    ContractSerializer,
    WastePriceSerializer,
    WeighingSerializer,
    AutoWeighingSerializer,
)
from .permissions import IsAdminRole, VerifySystemKey

# ==================================================
# 📝 REGISTER
# ==================================================
class RegisterView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        username = request.data.get("username")
        password = request.data.get("password")
        email = request.data.get("email")

        if User.objects.filter(username=username).exists():
            return Response(
                {"detail": "username already exists"},
                status=400
            )

        user = User.objects.create_user(
            username=username,
            password=password,
            email=email,
            role="USER"
        )

        return Response({
            "message": "user created"
        })


# ==================================================
# 🔐 AUTH (일반 로그인)
# ==================================================
class AuthView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):
        print(request.data)

        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(
            username=serializer.validated_data["username"],
            password=serializer.validated_data["password"],
        )

        if not user:
            return Response(
                {"detail": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        token = AccessToken.for_user(user)
        token["role"] = user.role

        return Response({
            "access_token": str(token),
            "token_type": "bearer",
            "role": user.role,
        })


# ==================================================
# 📝 REGISTER
# ==================================================
class RegisterView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        username = request.data.get("username")
        password = request.data.get("password")
        email = request.data.get("email")

        if User.objects.filter(username=username).exists():
            return Response(
                {"detail": "username already exists"},
                status=400
            )

        user = User.objects.create_user(
            username=username,
            password=password,
            email=email,
            role="USER"
        )

        return Response({
            "message": "user created"
        })

# ==================================================
# 🔳 QR TOKEN 생성
# ==================================================
class QRGenerateView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        token = str(uuid.uuid4())

        return Response({
            "token": token
        })


# ==================================================
# 🔳 QR LOGIN
# ==================================================
class QRLoginView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        qr_token = request.data.get("qr_token")

        if not qr_token:
            return Response(
                {"detail": "QR token required"},
                status=400
            )

        try:
            uuid.UUID(qr_token)
        except Exception:
            return Response(
                {"detail": "Invalid QR token"},
                status=status.HTTP_403_FORBIDDEN,
            )

        user = User.objects.filter(qr_token=qr_token).first()

        if not user:
            return Response(
                {"detail": "QR token expired or invalid"},
                status=status.HTTP_403_FORBIDDEN,
            )

        user.qr_token = None
        user.save()

        token = AccessToken.for_user(user)
        token["role"] = user.role

        return Response({
            "access_token": str(token),
            "token_type": "bearer",
            "role": user.role,
        })


# ==================================================
# 📄 CONTRACT
# ==================================================
class ContractViewSet(viewsets.ModelViewSet):

    queryset = Contract.objects.all()
    serializer_class = ContractSerializer
    permission_classes = [AllowAny]

    @action(detail=True, methods=["get"])
    def wastes(self, request, pk=None):

        contract = self.get_object()

        wastes = WastePrice.objects.filter(contract=contract)

        serializer = WastePriceSerializer(wastes, many=True)

        return Response(serializer.data)


# ==================================================
# 📍 PLACE
# ==================================================
class PlaceViewSet(viewsets.ModelViewSet):

    queryset = Place.objects.all()
    serializer_class = PlaceSerializer
    permission_classes = [AllowAny]

    # ------------------------------------------------
    # 📸 사진 업로드 (기존 place 수정)
    # ------------------------------------------------
    @action(
        detail=True,
        methods=["post"],
        parser_classes=[MultiPartParser, FormParser],
        permission_classes=[IsAuthenticated],
    )
    def upload_photo(self, request, pk=None):

        place = self.get_object()

        photo = request.FILES.get("photo")

        if not photo:
            return Response(
                {"detail": "photo required"},
                status=400
            )

        # 기존 파일 삭제 (선택)
        if place.image and os.path.isfile(place.image.path):
            os.remove(place.image.path)

        place.image = photo
        place.save()

        return Response(
            PlaceSerializer(place, context={"request": request}).data
        )


# ==================================================
# 💰 WASTE PRICE
# ==================================================
class WastePriceViewSet(viewsets.ModelViewSet):

    queryset = WastePrice.objects.all()
    serializer_class = WastePriceSerializer
    permission_classes = [AllowAny]


# ==================================================
# ⚖️ WEIGHING
# ==================================================
class WeighingViewSet(viewsets.ModelViewSet):

    queryset = Weighing.objects.all()
    serializer_class = WeighingSerializer
    permission_classes = [AllowAny]

    # 자동 계량 (SYSTEM KEY)
    @action(detail=False, methods=["post"], permission_classes=[VerifySystemKey])
    def auto(self, request):

        serializer = AutoWeighingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        net = (
            serializer.validated_data["gross_weight"]
            - serializer.validated_data["tare_weight"]
        )

        weighing = Weighing.objects.create(
            contract_id=serializer.validated_data["contract_id"],
            vehicle_no=serializer.validated_data["vehicle_no"],
            gross_weight=serializer.validated_data["gross_weight"],
            tare_weight=serializer.validated_data["tare_weight"],
            net_weight=net,
            source="AUTO",
            status="PENDING",
        )

        return Response(
            WeighingSerializer(weighing).data
        )

    # 수동 계량 (ADMIN)
    @action(detail=False, methods=["post"], permission_classes=[IsAdminRole])
    def manual(self, request):

        serializer = WeighingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        net = (
            serializer.validated_data["gross_weight"]
            - serializer.validated_data["tare_weight"]
        )

        weighing = Weighing.objects.create(
            **serializer.validated_data,
            net_weight=net,
            source="MANUAL",
            status="CONFIRMED",
            confirmed_at=timezone.now(),
        )

        return Response(
            WeighingSerializer(weighing).data
        )


# ==================================================
# 🏥 HEALTH CHECK
# ==================================================
@api_view(["GET"])
def health_check(request):

    return Response({
        "status": "ok",
        "app": getattr(settings, "APP_NAME", "Eco-Scale API"),
        "env": getattr(settings, "APP_ENV", "development"),
    })