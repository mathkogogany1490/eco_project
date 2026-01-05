// ==============================
// src/app/layout.tsx
// ==============================
import './globals.css'
import Providers from './providers'
import Sidebar from '@/components/Sidebar'
import AuthGuard from '@/components/auth/AuthGuard'

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="ko">
        <body className="h-screen overflow-hidden">
        <Providers>
            <div className="flex h-full">
                {/* 🔹 사이드바는 항상 유지 */}
                <Sidebar />

                {/* 🔹 메인 콘텐츠만 인증 보호 */}
                <main className="flex-1 bg-slate-100 p-6 overflow-y-auto">
                    <AuthGuard>
                        {children}
                    </AuthGuard>
                </main>
            </div>
        </Providers>
        </body>
        </html>
    )
}
