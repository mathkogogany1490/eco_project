import MailDetail from "@/components/mail/MailDetail";

interface PageProps {
    params: {
        id: string;
    };
}

export default function Page({ params }: PageProps) {
    return <MailDetail id={params.id} />;
}