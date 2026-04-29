"use client";

import { useEffect } from "react";
import { fetchSent } from "@/store/slices/mailSlice";
import MailItem from "./MailItem";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Mail } from "@/types/mailType";

export default function Sent() {
    const dispatch = useAppDispatch();
    const { sent, loading, error } = useAppSelector((state) => state.mail);

    useEffect(() => {
        dispatch(fetchSent());
    }, [dispatch]);

    console.log("📤 sent state:", sent); // 🔥 디버깅

    if (loading) return <p>로딩중...</p>;

    if (error) return <p>❌ 에러: {error}</p>;

    if (!sent || sent.length === 0) {
        return <p>📭 보낸 메일이 없습니다.</p>;
    }

    return (
        <div>
            <h2>📤 보낸 메일</h2>
            {sent.map((mail: Mail) => (
                <MailItem key={mail.id} mail={mail} />
            ))}
        </div>
    );
}