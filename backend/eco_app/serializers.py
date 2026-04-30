# serializers.py
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import User, Place, Contract, WastePrice, Weighing
from .models import Mail
from django.contrib.auth import get_user_model


User = get_user_model()

class MailSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()
    receiver = serializers.SerializerMethodField()

    class Meta:
        model = Mail
        fields = [
            "id",
            "subject",
            "content",
            "sender",
            "receiver",
            "external_sender",  # 🔥 추가
            "is_read",
            "created_at",
        ]

    def get_sender(self, obj):
        # 🔥 내부 + 외부 fallback
        if obj.sender:
            return obj.sender.email
        return obj.external_sender

    def get_receiver(self, obj):
        return obj.receiver.email if obj.receiver else None


class SendMailSerializer(serializers.Serializer):
    email = serializers.EmailField()
    subject = serializers.CharField(max_length=255)
    content = serializers.CharField()

    def validate_subject(self, value):
        if not value.strip():
            raise serializers.ValidationError("제목은 비워둘 수 없습니다.")
        return value

    def validate_content(self, value):
        if not value.strip():
            raise serializers.ValidationError("내용은 비워둘 수 없습니다.")
        return value

# ==================================================
# USER
# ==================================================

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = "__all__"
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        validated_data["password"] = make_password(
            validated_data["password"]
        )
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if "password" in validated_data:
            validated_data["password"] = make_password(
                validated_data["password"]
            )
        return super().update(instance, validated_data)


# ==================================================
# LOGIN
# ==================================================

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class TokenResponseSerializer(serializers.Serializer):
    access_token = serializers.CharField()
    token_type = serializers.CharField(default="bearer")
    role = serializers.CharField()


# ==================================================
# PLACE
# ==================================================

class PlaceSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Place
        fields = [
            "id",
            "company_name",
            "latitude",
            "longitude",
            "phone_number",
            "address",
            "block_state",
            "image_url",
            "start_date",
            "end_date",
            "size",
            "count",
        ]

    def get_image_url(self, obj):
        request = self.context.get("request")

        if not obj.image:
            return None

        if request:
            return request.build_absolute_uri(obj.image.url)

        return obj.image.url


# ==================================================
# WASTE PRICE
# ==================================================

class WastePriceSerializer(serializers.ModelSerializer):

    transport_fee = serializers.IntegerField(min_value=0)
    process_fee = serializers.IntegerField(min_value=0)

    class Meta:
        model = WastePrice
        fields = "__all__"


# ==================================================
# CONTRACT
# ==================================================

class ContractSerializer(serializers.ModelSerializer):

    waste_prices = WastePriceSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Contract
        fields = "__all__"


# ==================================================
# WEIGHING
# ==================================================

class WeighingSerializer(serializers.ModelSerializer):

    vehicle_no = serializers.CharField(
        min_length=2,
        max_length=20
    )

    gross_weight = serializers.IntegerField(min_value=0)
    tare_weight = serializers.IntegerField(min_value=0)

    class Meta:
        model = Weighing
        fields = "__all__"

    def validate(self, data):

        gross = data.get("gross_weight")
        tare = data.get("tare_weight")

        if gross is not None and tare is not None:
            if gross < tare:
                raise serializers.ValidationError(
                    "gross_weight must be greater than or equal to tare_weight"
                )

        return data


# ==================================================
# AUTO WEIGHING
# ==================================================

class AutoWeighingSerializer(WeighingSerializer):

    sensor_id = serializers.CharField()
