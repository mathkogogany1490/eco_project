"use client";

import { useEffect } from "react";
import { fetchMailDetail, readMail } from "@/store/slices/mailSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function MailDetail({ id }: { id: string }) {
    const dispatch = useAppDispatch();
    const { detail: mail, loading, error } = useAppSelector(
        (state) => state.mail
    );

    useEffect(() => {
        dispatch(fetchMailDetail(id));
    }, [dispatch, id]);

    // 🔥 detail 로드 후 읽음 처리
    useEffect(() => {
        if (mail) {
            dispatch(readMail(id));
        }
    }, [dispatch, id, mail]);

    if (loading) return <p>로딩중...</p>;

    if (error) return <p>❌ 에러: {error}</p>;

    if (!mail) return <p>메일이 없습니다.</p>;

    return (
        <div style={{ padding: 20 }}>
            <h2>{mail.subject}</h2>

            <p style={{ color: "#666" }}>
                보낸 사람: {mail.sender}
            </p>

            <hr />

            <div
                style={{
                    marginTop: 20,
                    whiteSpace: "pre-wrap", // 🔥 줄바꿈 유지
                }}
            >
                {mail.content}
            </div>
        </div>
    );
}