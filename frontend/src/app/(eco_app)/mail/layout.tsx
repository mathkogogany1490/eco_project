"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MailLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const menu = [
        { name: "받은메일", path: "/mail/inbox", icon: "📥" },
        { name: "보낸메일", path: "/mail/sent", icon: "📤" },
        { name: "메일쓰기", path: "/mail/compose", icon: "✉️" },
    ];

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            {/* 사이드바 */}
            <div
                style={{
                    width: 240,
                    borderRight: "1px solid #ddd",
                    padding: 20,
                    background: "#fafafa",
                }}
            >
                <h3 style={{ marginBottom: 20 }}>📧 메일</h3>

                {menu.map((item) => {
                    const active = pathname.startsWith(item.path);

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            style={{
                                display: "block",
                                padding: "10px 12px",
                                borderRadius: 6,
                                marginBottom: 8,
                                background: active ? "#e3f2fd" : "transparent",
                                fontWeight: active ? "bold" : "normal",
                                textDecoration: "none",
                                color: "inherit",
                            }}
                        >
                            {item.icon} {item.name}
                        </Link>
                    );
                })}
            </div>

            {/* 본문 */}
            <div style={{ flex: 1, overflow: "auto" }}>
                {children}
            </div>
        </div>
    );
}