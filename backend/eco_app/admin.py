from django.contrib import admin
from django.utils.html import format_html
from .models import User, Contract, WastePrice, Weighing, Place
from .models import Mail

@admin.register(Mail)
class MailAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "subject",
        "sender",
        "receiver",
        "is_read",
        "created_at",
    )

    list_filter = (
        "is_read",
        "created_at",
    )

    search_fields = (
        "subject",
        "content",
        "sender__email",
        "receiver__email",
    )

    ordering = ("-created_at",)

    readonly_fields = (
        "created_at",
    )


# ==================================================
# USER
# ==================================================
@admin.register(User)
class UserAdmin(admin.ModelAdmin):

    list_display = ("id", "username", "role")
    search_fields = ("username",)
    list_filter = ("role",)
    ordering = ("id",)


# ==================================================
# WASTE PRICE INLINE
# ==================================================
class WastePriceInline(admin.TabularInline):
    model = WastePrice
    extra = 1


# ==================================================
# CONTRACT
# ==================================================
@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):

    list_display = ("id", "name", "type", "company", "created_at")
    search_fields = ("name", "company")
    list_filter = ("type", "created_at")
    ordering = ("-created_at",)

    inlines = [WastePriceInline]


# ==================================================
# WEIGHING
# ==================================================
@admin.register(Weighing)
class WeighingAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "contract",
        "vehicle_no",
        "gross_weight",
        "tare_weight",
        "net_weight",
        "source",
        "status",
        "created_at",
    )

    list_filter = ("source", "status", "created_at")
    search_fields = ("vehicle_no",)
    ordering = ("-created_at",)

    readonly_fields = ("net_weight", "created_at", "confirmed_at")

    def save_model(self, request, obj, form, change):
        # 자동 net_weight 계산
        obj.net_weight = obj.gross_weight - obj.tare_weight

        # CONFIRMED 시 confirmed_at 자동 입력
        if obj.status == "CONFIRMED" and not obj.confirmed_at:
            from django.utils import timezone
            obj.confirmed_at = timezone.now()

        super().save_model(request, obj, form, change)


# ==================================================
# PLACE
# ==================================================
@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "company_name",
        "latitude",
        "longitude",
        "block_state",
        "phone_number",
    )

    search_fields = ("company_name", "address")
    list_filter = ("block_state",)
    ordering = ("id",)

    readonly_fields = ()

    fieldsets = (
        ("기본 정보", {
            "fields": ("company_name", "phone_number", "address")
        }),
        ("위치 정보", {
            "fields": ("latitude", "longitude")
        }),
        ("상태 정보", {
            "fields": ("block_state", "start_date", "size", "count")
        }),
        ("이미지", {
            "fields": ("image_url",)
        }),
    )