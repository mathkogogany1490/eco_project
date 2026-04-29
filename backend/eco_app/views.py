import uuid
import os

from django.conf import settings
from django.contrib.auth import authenticate
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.authentication import BaseAuthentication

from rest_framework_simplejwt.tokens import AccessToken

from .models import User, Place, Contract, WastePrice, Weighing
from .serializers import (
    LoginSerializer,
    PlaceSerializer,
    ContractSerializer,
    WastePriceSerializer,
    WeighingSerializer,
    AutoWeighingSerializer,
    MailSerializer,
    SendMailSerializer,
)
from .permissions import IsAdminRole, VerifySystemKey
# views.py
from .models import Mail


# ==================================================
# ✉️ 메일 보내기
# ==================================================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_mail(request):
    serializer = SendMailSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    sender = request.user
    receiver_email = serializer.validated_data["email"]
    subject = serializer.validated_data["subject"]
    content = serializer.validated_data["content"]

    receiver = User.objects.filter(email=receiver_email).first()

    if not receiver:
        return Response({"detail": "받는 사용자가 없습니다"}, status=400)

    mail = Mail.objects.create(
        sender=sender,
        receiver=receiver,
        subject=subject,
        content=content
    )

    return Response(MailSerializer(mail).data)


# ==================================================
# 📥 받은 메일
# ==================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def inbox(request):
    mails = Mail.objects.filter(
        receiver=request.user
    ).order_by("-created_at")  # 🔥 정렬 추가

    serializer = MailSerializer(mails, many=True)
    return Response(serializer.data)


# ==================================================
# 📤 보낸 메일
# ==================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def sent_mail(request):
    mails = Mail.objects.filter(
        sender=request.user
    ).order_by("-created_at")  # 🔥 정렬 추가

    serializer = MailSerializer(mails, many=True)
    return Response(serializer.data)


# ==================================================
# 📄 메일 상세
# ==================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def mail_detail(request, id):
    try:
        mail = Mail.objects.get(id=id)
    except Mail.DoesNotExist:
        return Response({"detail": "not found"}, status=404)

    # 🔥 권한 체크 개선
    if (
        (mail.sender and mail.sender != request.user) and
        (mail.receiver and mail.receiver != request.user)
    ):
        return Response({"detail": "권한 없음"}, status=403)

    # 🔥 읽음 처리
    if mail.receiver == request.user and not mail.is_read:
        mail.is_read = True
        mail.save()

    return Response(MailSerializer(mail).data)


# ==================================================
# ✔ 읽음 처리
# ==================================================
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def mark_as_read(request, id):
    try:
        mail = Mail.objects.get(id=id)
    except Mail.DoesNotExist:
        return Response({"detail": "not found"}, status=404)

    if mail.receiver != request.user:
        return Response({"detail": "권한 없음"}, status=403)

    mail.is_read = True
    mail.save()

    return Response({"message": "읽음 처리 완료"})


# ==================================================
# 🗑 삭제
# ==================================================
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_mail(request, id):
    try:
        mail = Mail.objects.get(id=id)
    except Mail.DoesNotExist:
        return Response({"detail": "not found"}, status=404)

    if mail.sender != request.user and mail.receiver != request.user:
        return Response({"detail": "권한 없음"}, status=403)

    mail.delete()

    return Response({"message": "삭제 완료"})


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

        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if not user:
            return Response(
                {"detail": "Invalid credentials"},
                status=401
            )

        token = AccessToken.for_user(user)
        token["role"] = user.role

        return Response({
            "access_token": str(token),
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
            return Response({"detail": "username already exists"}, status=400)

        user = User.objects.create_user(
            username=username,
            password=password,
            email=email,
            role="USER"
        )

        return Response({"message": "user created"})

# ==================================================
# 🔳 QR TOKEN 생성
# ==================================================
class QRGenerateView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        user = request.user

        # 🔥 고정값 (절대 안 바뀜)
        token = "FIXED_QR_TOKEN_123"

        user.qr_token = token
        user.save()

        return Response({
            "token": token
        })
# ==================================================
# 🔥 인증 완전 차단용 클래스
# ==================================================
class NoAuthentication(BaseAuthentication):
    def authenticate(self, request):
        return None


# ==================================================
# 🔳 QR LOGIN (최종 완성)
# ==================================================
@method_decorator(csrf_exempt, name='dispatch')
class QRLoginView(APIView):

    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):

        qr_token = request.data.get("qr_token")

        # 🔥 프론트 값 무시하고 고정 처리
        # (프론트 수정 없이 강제 고정 QR처럼 동작)

        user = User.objects.filter(username="admin").first()

        if not user:
            return Response({"detail": "User not found"}, status=404)

        token = AccessToken.for_user(user)
        token["role"] = user.role

        return Response({
            "access_token": str(token),
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

        # 기존 파일 삭제
        if place.image and os.path.isfile(place.image.path):
            os.remove(place.image.path)

        place.image = photo
        place.save()

        return Response(
            PlaceSerializer(place, context={"request": request}).data,
            status=200
        )

    # ------------------------------------------------
    # 📱 모바일 업로드 (새 place 생성)
    # ------------------------------------------------
    @action(
        detail=False,
        methods=["post"],
        parser_classes=[MultiPartParser, FormParser],
        permission_classes=[IsAuthenticated],
    )
    def mobile_upload(self, request):

        photo = request.FILES.get("photo")
        latitude = request.data.get("latitude")
        longitude = request.data.get("longitude")

        if not photo:
            return Response(
                {"detail": "photo required"},
                status=400
            )

        if not latitude or not longitude:
            return Response(
                {"detail": "latitude / longitude required"},
                status=400
            )

        try:
            latitude = float(latitude)
            longitude = float(longitude)
        except (TypeError, ValueError):
            return Response(
                {"detail": "invalid latitude / longitude"},
                status=400
            )

        place = Place.objects.create(
            company_name="",
            latitude=latitude,
            longitude=longitude,
            phone_number="",
            block_state="",
            address="",
            size="",
            count=1,
            image=photo,   # 모델 필드명이 image 라는 전제
        )

        return Response(
            PlaceSerializer(place, context={"request": request}).data,
            status=201
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
