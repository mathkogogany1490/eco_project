"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { createMail } from "@/store/slices/mailSlice";

export default function Compose() {
    const dispatch = useAppDispatch();

    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");

    const send = async () => {
        try {
            await dispatch(createMail({ email, subject, content })).unwrap();
            alert("메일 전송 완료");
            setEmail("");
            setSubject("");
            setContent("");
        } catch {
            alert("전송 실패");
        }
    };

    return (
        <div className="p-8 max-w-3xl">
            <h2 className="text-xl font-semibold mb-6">📧 메일 작성</h2>

            {/* 받는 사람 */}
            <div className="mb-4">
                <label className="block text-sm mb-1 text-gray-600">받는 사람</label>
                <input
                    className="w-full border rounded-md px-3 py-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                />
            </div>

            {/* 제목 */}
            <div className="mb-4">
                <label className="block text-sm mb-1 text-gray-600">제목</label>
                <textarea
                    className="w-full border rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    rows={2}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="제목을 입력하세요"
                />
            </div>

            {/* 내용 */}
            <div className="mb-6">
                <label className="block text-sm mb-1 text-gray-600">내용</label>
                <textarea
                    className="w-full border rounded-md px-3 py-3 resize-none min-h-[200px] focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="내용을 입력하세요"
                />
            </div>

            {/* 버튼 */}
            <button
                onClick={send}
                className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition"
            >
                보내기
            </button>
        </div>
    );
}