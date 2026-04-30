"use client";

import { useParams } from "next/navigation";
import MailDetail from "@/components/mail/MailDetail";

export default function Page() {
    const params = useParams();

    const id = params?.id as string;

    if (!id) return <div>잘못된 접근</div>;

    return <MailDetail id={id} />;
}