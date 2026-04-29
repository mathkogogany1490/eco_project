// types/mailType.ts

export interface Mail {
    id: number;
    subject: string;
    content: string;

    // 🔥 내부 사용자 메일 (기존)
    sender?: string;
    receiver?: string;

    // 🔥 외부 메일 (IMAP)
    external_sender?: string;

    is_read: boolean;
    created_at: string;
}

export interface SendMailRequest {
    email: string;
    subject: string;
    content: string;
}

export interface ApiMessage {
    message: string;
}