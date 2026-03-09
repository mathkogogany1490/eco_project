import uuid

from django.conf import settings
from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied, NotAuthenticated


# ==================================================
# 1️⃣ ADMIN 전용 권한
# ==================================================
class IsAdminRole(BasePermission):
    """
    role == ADMIN 인 사용자만 허용
    """

    message = "Admin only"

    def has_permission(self, request, view):

        # 로그인 안 된 경우 → 401
        if not request.user or not request.user.is_authenticated:
            raise NotAuthenticated("Authentication required")

        # role 검사
        if getattr(request.user, "role", None) != "ADMIN":
            raise PermissionDenied(self.message)

        return True


# ==================================================
# 2️⃣ QR TOKEN 검증 (X-QR-TOKEN)
# ==================================================
class ValidQRToken(BasePermission):
    """
    X-QR-TOKEN 헤더 UUID 형식 검증
    (추후 DB 검증 확장 가능)
    """

    message = "Invalid QR token"

    def has_permission(self, request, view):

        qr_token = request.headers.get("X-QR-TOKEN")

        if not qr_token:
            raise PermissionDenied("QR token required")

        try:
            uuid.UUID(qr_token)
        except (ValueError, TypeError):
            raise PermissionDenied("Invalid QR token format")

        return True


# ==================================================
# 3️⃣ SYSTEM API KEY 검증 (X-API-KEY)
# ==================================================
class VerifySystemKey(BasePermission):
    """
    자동 계량 서버 전용 API KEY 검증
    """

    message = "Invalid system key"

    def has_permission(self, request, view):

        api_key = request.headers.get("X-API-KEY")

        if not api_key:
            raise PermissionDenied("API key required")

        system_key = getattr(settings, "SYSTEM_API_KEY", None)

        if not system_key:
            raise PermissionDenied("Server configuration error")

        if api_key != system_key:
            raise PermissionDenied(self.message)

        return True