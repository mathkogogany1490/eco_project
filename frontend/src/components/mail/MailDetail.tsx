"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchMailDetail, readMail } from "@/store/slices/mailSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function MailDetail({ id }: { id: string }) {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { detail: mail, loading, error } = useAppSelector(
        (state) => state.mail
    );

    // 📩 상세 조회
    useEffect(() => {
        dispatch(fetchMailDetail(id));
    }, [dispatch, id]);

    // 📖 읽음 처리
    useEffect(() => {
        if (mail && !mail.is_read) {
            dispatch(readMail(id));
        }
    }, [dispatch, id, mail]);

    if (loading) return <p style={{ padding: 20 }}>로딩중...</p>;
    if (error) return <p style={{ padding: 20 }}>❌ 에러: {error}</p>;
    if (!mail) return <p style={{ padding: 20 }}>메일이 없습니다.</p>;

    return (
        <div style={{ padding: 20 }}>

            {/* 🔙 뒤로가기 */}
            <button
                onClick={() => router.back()}
                style={{
                    marginBottom: 10,
                    padding: "6px 12px",
                    cursor: "pointer",
                }}
            >
                ← 뒤로가기
            </button>

            {/* 📌 제목 */}
            <h2 style={{ marginBottom: 10 }}>{mail.subject}</h2>

            {/* 👤 보낸 사람 */}
            <p style={{ color: "#666" }}>
                보낸 사람: {mail.sender || mail.external_sender || "알 수 없음"}
            </p>

            {/* 🕒 날짜 */}
            <p style={{ fontSize: 12, color: "#aaa" }}>
                {mail.created_at
                    ? new Date(mail.created_at).toLocaleString()
                    : ""}
            </p>

            <hr style={{ margin: "20px 0" }} />

            {/* 📄 내용 (HTML 지원) */}
            <div
                style={{
                    marginTop: 10,
                    lineHeight: 1.6,
                }}
                dangerouslySetInnerHTML={{
                    __html: mail.content || "",
                }}
            />
        </div>
    );
}