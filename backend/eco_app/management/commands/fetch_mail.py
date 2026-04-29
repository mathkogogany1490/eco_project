from django.core.management.base import BaseCommand
from django.conf import settings

import imaplib
import email
from email.header import decode_header
from email.utils import parseaddr

from eco_app.models import Mail
from django.contrib.auth import get_user_model

User = get_user_model()
def decode_email_header(header):
    if not header:
        return ""

    decoded = decode_header(header)
    result = ""

    for part, encoding in decoded:
        if isinstance(part, bytes):
            try:
                result += part.decode(encoding or "utf-8", errors="ignore")
            except LookupError:
                # 🔥 unknown-8bit 같은 경우 처리
                result += part.decode("utf-8", errors="ignore")
        else:
            result += part

    return result


# 🔧 메일 본문 추출
def get_body(msg):
    try:
        if msg.is_multipart():
            for part in msg.walk():
                if part.get_content_type() == "text/plain":
                    return part.get_payload(decode=True).decode(errors="ignore")

            for part in msg.walk():
                if part.get_content_type() == "text/html":
                    return part.get_payload(decode=True).decode(errors="ignore")
        else:
            return msg.get_payload(decode=True).decode(errors="ignore")
    except:
        return ""

    return ""


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        self.stdout.write("🚀 Seeding mail...")

        imap = imaplib.IMAP4_SSL("imap.gmail.com")

        imap.login(
            settings.EMAIL_HOST_USER,
            settings.EMAIL_HOST_PASSWORD
        )

        imap.select("inbox")

        status, messages = imap.search(None, "ALL")

        # 🔥 유저 가져오기
        try:
            user = User.objects.get(username="kogo3039")
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR("❌ 유저 없음"))
            return

        mail_ids = messages[0].split()[-20:]

        for num in mail_ids:
            res, msg_data = imap.fetch(num, "(RFC822)")

            for response in msg_data:
                if isinstance(response, tuple):
                    msg = email.message_from_bytes(response[1])

                    # ✅ 제목
                    subject = decode_email_header(msg.get("Subject"))

                    # ✅ 발신자 (핵심 수정)
                    from_raw = msg.get("From")
                    from_str = decode_email_header(from_raw)
                    name, from_email = parseaddr(from_str)

                    # ✅ 본문
                    content = get_body(msg) or ""

                    # 🔥 중복 방지
                    exists = Mail.objects.filter(
                        subject=subject,
                        content=content[:100],
                        receiver=user
                    ).exists()

                    if not exists:
                        Mail.objects.create(
                            subject=subject,
                            content=content[:500],
                            receiver=user,
                            external_sender=from_email,
                        )

        self.stdout.write(self.style.SUCCESS("✅ 메일 수집 완료"))