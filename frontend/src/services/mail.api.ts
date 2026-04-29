// services/mail.api.ts

import api from "./api";
import { Mail, SendMailRequest, ApiMessage } from "@/types/mailType";

/**
 * 📌 공통 에러 핸들러
 */
const handleError = (error: any) => {
    console.error("📛 Mail API Error:", error?.response || error);
    throw error?.response?.data || "API Error";
};

/**
 * 📥 받은 메일
 */
export const getInbox = async (): Promise<Mail[]> => {
    try {
        const res = await api.get<Mail[]>("/inbox/");
        console.log("📥 inbox:", res.data); // 🔥 디버깅용
        return res.data;
    } catch (error) {
        handleError(error);
        return []; // 🔥 안전 반환
    }
};

/**
 * 📤 보낸 메일
 */
export const getSentMail = async (): Promise<Mail[]> => {
    try {
        const res = await api.get<Mail[]>("/sent-mail/");
        return res.data;
    } catch (error) {
        handleError(error);
        return [];
    }
};

/**
 * 📄 메일 상세
 */
export const getMailDetail = async (
    id: string | number
): Promise<Mail> => {
    try {
        const res = await api.get<Mail>(`/mail/${id}/`);
        return res.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

/**
 * ✉️ 메일 보내기
 */
export const sendMail = async (
    data: SendMailRequest
): Promise<ApiMessage> => {
    try {
        const res = await api.post<ApiMessage>("/send-mail/", data);
        return res.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

/**
 * ✔ 읽음 처리
 */
export const markAsRead = async (
    id: string | number
): Promise<ApiMessage> => {
    try {
        const res = await api.post<ApiMessage>(`/mail/${id}/read/`);
        return res.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

/**
 * 🗑 메일 삭제
 */
export const deleteMail = async (
    id: string | number
): Promise<ApiMessage> => {
    try {
        const res = await api.delete<ApiMessage>(`/mail/${id}/`);
        return res.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};