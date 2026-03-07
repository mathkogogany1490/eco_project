from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    AuthView,
    RegisterView,
    QRGenerateView,
    QRLoginView,
    ContractViewSet,
    PlaceViewSet,
    WastePriceViewSet,
    WeighingViewSet,
    health_check,
)

# ==================================================
# Router 설정
# ==================================================
router = DefaultRouter()
router.register(r"contracts", ContractViewSet, basename="contract")
router.register(r"places", PlaceViewSet, basename="place")
router.register(r"wastes", WastePriceViewSet, basename="waste")
router.register(r"weighings", WeighingViewSet, basename="weighing")


# ==================================================
# URL Patterns
# ==================================================
urlpatterns = [

    # 🔐 Auth
    path("auth/login/", AuthView.as_view(), name="login"),
    path("auth/register/", RegisterView.as_view()),
    path("auth/qr-login/", QRLoginView.as_view(), name="qr-login"),

    # 🔥 QR 생성 API 추가
    path("auth/qr-generate/", QRGenerateView.as_view(), name="qr-generate"),

    # 🏥 Health Check
    path("health/", health_check, name="health"),

    # 📦 API Router
    path("", include(router.urls)),
]