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
    sent_mail_view,
    inbox,
    sent_mail,
    mail_detail,
    mark_as_read,
    delete_mail,
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

    # 🔥 QR 생성 API
    path("auth/qr-generate/", QRGenerateView.as_view(), name="qr-generate"),

    # 🏥 Health Check
    path("health/", health_check, name="health"),

    # ==================================================
    # ✉️ MAIL API
    # ==================================================
    path("send-mail/", sent_mail_view),
    path("inbox/", inbox),
    path("sent-mail/", sent_mail),

    path("mail/<int:id>/", mail_detail),          # GET
    path("mail/<int:id>/read/", mark_as_read),    # POST
    path("mail/<int:id>/delete/", delete_mail),   # 🔥 수정

    # 📦 API Router
    path("", include(router.urls)),
]