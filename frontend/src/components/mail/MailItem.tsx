"use client";

import { useRouter } from "next/navigation";
import { Mail } from "@/types/mailType";

export default function MailItem({ mail }: { mail: Mail }) {
    const router = useRouter();

    return (
        <div
            onClick={() => router.push(`/mail/${mail.id}`)}
            style={{
                padding: "12px",
                borderBottom: "1px solid #eee",
                cursor: "pointer",
                fontWeight: mail.is_read ? "normal" : "bold",
                transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f9f9f9")
            }
            onMouseLeave={(e) =>
                (e.currentTarget.style.background = "white")
            }
        >
            {/* 제목 */}
            <div>{mail.subject}</div>

            {/* 보낸 사람 */}
            <div style={{ fontSize: 12, color: "#666" }}>
                {mail.sender || mail.external_sender || "알 수 없음"}
            </div>

            {/* 날짜 */}
            <div style={{ fontSize: 11, color: "#aaa" }}>
                {mail.created_at
                    ? new Date(mail.created_at).toLocaleString()
                    : ""}
            </div>
        </div>
    );
}