from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.conf import settings


User = settings.AUTH_USER_MODEL


class Mail(models.Model):
    # 🔥 내부 사용자 (보낸 사람)
    sender = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,   # 🔥 추가 (외부메일 대응)
        related_name="sent_mails"
    )

    # 🔥 받는 사람
    receiver = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,   # 🔥 추가
        related_name="received_mails"
    )

    # 🔥 외부 발신자 (IMAP용 핵심)
    external_sender = models.EmailField(
        null=True,
        blank=True
    )

    subject = models.CharField(max_length=255)
    content = models.TextField()

    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["receiver"]),
            models.Index(fields=["sender"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        sender = (
            self.sender.email
            if self.sender
            else self.external_sender
            if self.external_sender
            else "Unknown"
        )
        return f"[{sender}] {self.subject}"


# =========================
# User
# =========================
class User(AbstractUser):

    ROLE_CHOICES = (
        ("ADMIN", "ADMIN"),
        ("SYSTEM", "SYSTEM"),
        ("MOBILE", "MOBILE"),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    qr_token = models.CharField(max_length=100, null=True, blank=True)

# =========================
# Place
# =========================
class Place(models.Model):

    company_name = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()

    phone_number = models.CharField(max_length=50, null=True, blank=True)
    address = models.TextField(null=True, blank=True)

    block_state = models.CharField(max_length=50, null=True, blank=True)

    image = models.ImageField(upload_to="places/", null=True, blank=True)

    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    size = models.CharField(max_length=50, null=True, blank=True)
    count = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.company_name}"
    def __str__(self):
        return f"{self.company_name}"


# =========================
# Contract
# =========================
class Contract(models.Model):

    name = models.CharField(max_length=255)
    type = models.CharField(max_length=100)
    company = models.CharField(max_length=255)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name


# =========================
# WastePrice
# =========================
class WastePrice(models.Model):

    contract = models.ForeignKey(
        Contract,
        on_delete=models.CASCADE,
        related_name="waste_prices"
    )

    waste_type = models.CharField(max_length=100)
    transport_fee = models.IntegerField()
    process_fee = models.IntegerField()

    def __str__(self):
        return f"{self.waste_type}"


# =========================
# Weighing
# =========================
class Weighing(models.Model):

    SOURCE_CHOICES = [
        ("AUTO", "Auto"),
        ("MANUAL", "Manual"),
    ]

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("CONFIRMED", "Confirmed"),
    ]

    contract = models.ForeignKey(
        Contract,
        on_delete=models.CASCADE,
        related_name="weighings"
    )

    vehicle_no = models.CharField(max_length=50)

    gross_weight = models.IntegerField()
    tare_weight = models.IntegerField()
    net_weight = models.IntegerField()

    source = models.CharField(
        max_length=20,
        choices=SOURCE_CHOICES,
        default="AUTO"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING",
        db_index=True
    )

    created_at = models.DateTimeField(default=timezone.now)
    confirmed_at = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        # CONFIRMED 되면 confirmed_at 자동 입력
        if self.status == "CONFIRMED" and not self.confirmed_at:
            self.confirmed_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.vehicle_no} - {self.net_weight}kg"