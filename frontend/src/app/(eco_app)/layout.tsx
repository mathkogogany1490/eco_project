'use client'

import Sidebar from '@/components/layout/Sidebar'
import AuthGuard from '@/components/auth/AuthGuard'
import AuthInitializer from '@/components/auth/AuthInitializer'

export default function EcoLayout({
                                      children,
                                  }: {
    children: React.ReactNode
}) {

    return (
        <>
            {/* 🔥 localStorage → Redux 복구 */}
            <AuthInitializer />

            <div className="flex h-screen overflow-hidden">

                {/* Sidebar */}
                <Sidebar />

                {/* Main */}
                <main className="flex-1 bg-slate-100 p-6 overflow-y-auto">
                    <AuthGuard>
                        {children}
                    </AuthGuard>
                </main>

            </div>
        </>
    )
}