// store/slices/mailSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
    getInbox,
    getSentMail,
    getMailDetail,
    sendMail,
    markAsRead,
    deleteMail,
} from "@/services/mail.api";
import { Mail, SendMailRequest } from "@/types/mailType";

/**
 * 📌 상태 타입
 */
interface MailState {
    inbox: Mail[];
    sent: Mail[];
    detail: Mail | null;

    loading: boolean;
    error: string | null;
}

/**
 * 📌 초기 상태
 */
const initialState: MailState = {
    inbox: [],
    sent: [],
    detail: null,
    loading: false,
    error: null,
};

/**
 * 📥 받은 메일
 */
export const fetchInbox = createAsyncThunk<Mail[]>(
    "mail/fetchInbox",
    async (_, { rejectWithValue }) => {
        try {
            return await getInbox();
        } catch (err: any) {
            return rejectWithValue(err);
        }
    }
);

/**
 * 📤 보낸 메일
 */
export const fetchSent = createAsyncThunk<Mail[]>(
    "mail/fetchSent",
    async (_, { rejectWithValue }) => {
        try {
            return await getSentMail();
        } catch (err: any) {
            return rejectWithValue(err);
        }
    }
);

/**
 * 📄 메일 상세
 */
export const fetchMailDetail = createAsyncThunk<Mail, string | number>(
    "mail/fetchMailDetail",
    async (id, { rejectWithValue }) => {
        try {
            return await getMailDetail(id);
        } catch (err: any) {
            return rejectWithValue(err);
        }
    }
);

/**
 * ✉️ 메일 보내기
 */
export const createMail = createAsyncThunk<void, SendMailRequest>(
    "mail/createMail",
    async (data, { rejectWithValue }) => {
        try {
            await sendMail(data);
        } catch (err: any) {
            return rejectWithValue(err);
        }
    }
);

/**
 * ✔ 읽음 처리
 */
export const readMail = createAsyncThunk<number | string, number | string>(
    "mail/readMail",
    async (id, { rejectWithValue }) => {
        try {
            await markAsRead(id);
            return id;
        } catch (err: any) {
            return rejectWithValue(err);
        }
    }
);

/**
 * 🗑 삭제
 */
export const removeMail = createAsyncThunk<number | string, number | string>(
    "mail/removeMail",
    async (id, { rejectWithValue }) => {
        try {
            await deleteMail(id);
            return id;
        } catch (err: any) {
            return rejectWithValue(err);
        }
    }
);

/**
 * 🔥 Slice
 */
const mailSlice = createSlice({
    name: "mail",
    initialState,
    reducers: {
        clearMailDetail: (state) => {
            state.detail = null;
        },
    },
    extraReducers: (builder) => {
        builder

            // 📥 Inbox
            .addCase(fetchInbox.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInbox.fulfilled, (state, action: PayloadAction<Mail[]>) => {
                state.loading = false;

                console.log("📥 inbox payload:", action.payload); // 🔥 핵심 디버깅

                state.inbox = action.payload;
            })
            .addCase(fetchInbox.rejected, (state, action) => {
                state.loading = false;

                state.error =
                    (action.payload as any)?.detail ||
                    action.error.message ||
                    "에러 발생";

                console.error("❌ inbox error:", state.error); // 🔥 디버깅
            })

            // 📤 Sent
            .addCase(fetchSent.fulfilled, (state, action: PayloadAction<Mail[]>) => {
                state.loading = false;
                state.sent = action.payload;
            })

            // 📄 Detail
            .addCase(fetchMailDetail.fulfilled, (state, action: PayloadAction<Mail>) => {
                state.loading = false;
                state.detail = action.payload;
            })

            // ✔ 읽음 처리
            .addCase(readMail.fulfilled, (state, action) => {
                const id = action.payload;

                state.inbox = state.inbox.map((mail) =>
                    mail.id === id ? { ...mail, is_read: true } : mail
                );
            })

            // 🗑 삭제
            .addCase(removeMail.fulfilled, (state, action) => {
                const id = action.payload;

                state.inbox = state.inbox.filter((m) => m.id !== id);
                state.sent = state.sent.filter((m) => m.id !== id);
            });
    },
});

export const { clearMailDetail } = mailSlice.actions;

export default mailSlice.reducer;