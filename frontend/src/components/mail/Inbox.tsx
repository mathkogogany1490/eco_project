"use client";

import { useEffect } from "react";
import { fetchInbox } from "@/store/slices/mailSlice";
import MailItem from "./MailItem";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function Inbox() {
    const dispatch = useAppDispatch();
    const { inbox, loading, error } = useAppSelector((state) => state.mail);

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        console.log("🔑 token:", token);

        if (!token) {
            console.warn("❌ 토큰 없음 → 로그인 필요");
            return;
        }

        dispatch(fetchInbox());
    }, [dispatch]);

    console.log("📥 inbox state:", inbox);

    if (loading) return <p>로딩중...</p>;

    if (error) return <p>❌ 에러: {String(error)}</p>;

    if (!inbox || inbox.length === 0) {
        return <p>📭 받은 메일이 없습니다.</p>;
    }

    return (
        <div>
            <h2>📥 받은 메일</h2>
            {inbox.map((mail: any) => (
                <MailItem key={mail.id} mail={mail} />
            ))}
        </div>
    );
}