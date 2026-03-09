from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import User, Place, Contract, WastePrice, Weighing


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

        if obj.image:
            return request.build_absolute_uri(obj.image.url)

        return None


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