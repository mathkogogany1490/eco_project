from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model

from eco_app.models import Contract, WastePrice, Weighing, Place

User = get_user_model()


class Command(BaseCommand):
    help = "Seed database with initial data and create users"

    def handle(self, *args, **kwargs):

        self.stdout.write("🚀 Seeding database...")

        # ==================================================
        # SUPERUSER
        # ==================================================
        if not User.objects.filter(username="kogo3039").exists():
            User.objects.create_superuser(
                username="kogo3039",
                email="kogo3039@gmail.com",
                password="math1106",
            )
            self.stdout.write(self.style.SUCCESS("✅ Superuser created"))
        else:
            self.stdout.write(self.style.SUCCESS("✔ Superuser exists"))

        # ==================================================
        # ADMIN USER
        # ==================================================
        if not User.objects.filter(username="admin").exists():
            User.objects.create_user(
                username="admin",
                email="admin@test.com",
                password="admin123",
                role="ADMIN",
            )
            self.stdout.write(self.style.SUCCESS("✅ Admin user created"))

        # ==================================================
        # SYSTEM USER
        # ==================================================
        if not User.objects.filter(username="system").exists():
            User.objects.create_user(
                username="system",
                email="system@test.com",
                password="system123",
                role="SYSTEM",
            )
            self.stdout.write(self.style.SUCCESS("✅ System user created"))

        # ==================================================
        # CONTRACT + WASTE + WEIGHING
        # ==================================================
        if not Contract.objects.exists():

            contract = Contract.objects.create(
                name="서울시 도로공사",
                type="관급",
                company="서울시청",
            )

            WastePrice.objects.create(
                contract=contract,
                waste_type="콘크리트",
                transport_fee=12000,
                process_fee=8000,
            )

            WastePrice.objects.create(
                contract=contract,
                waste_type="혼합폐기물",
                transport_fee=15000,
                process_fee=10000,
            )

            Weighing.objects.create(
                contract=contract,
                vehicle_no="서울12가3456",
                gross_weight=25000,
                tare_weight=10000,
                net_weight=15000,
                source="AUTO",
                status="PENDING",
                created_at=timezone.now(),
            )

        # ==================================================
        # PLACES
        # ==================================================
        if not Place.objects.exists():

            Place.objects.create(
                company_name="서울시청 건설부",
                latitude=37.5665,
                longitude=126.9780,
                phone_number="02-120",
                block_state="반입",
                start_date="2024-01-01",
                address="서울특별시 중구 세종대로 110",
                size="대형",
                count=3,
            )

            Place.objects.create(
                company_name="강남 재건축 현장",
                latitude=37.4979,
                longitude=127.0276,
                phone_number="02-555-1234",
                block_state="반입",
                start_date="2024-03-15",
                address="서울특별시 강남구 테헤란로",
                size="중형",
                count=2,
            )

        self.stdout.write(self.style.SUCCESS("🎉 Seed completed successfully"))