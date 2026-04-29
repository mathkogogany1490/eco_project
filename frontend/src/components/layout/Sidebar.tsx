'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout, restoreAuth } from '@/store/slices/authSlice'

import LoginModal from '@/components/auth/LoginModal'
import RegisterModal from '@/components/auth/RegisterModal'
import QrGenerateModal from '@/components/QrGenerateModal'
import ContractSidebarList from '@/components/contracts/ContractSidebarList'

const menus = [
    { name: '계량관리', path: '/weighings', icon: '⚖️' },
    { name: '매출관리', path: '/sales', icon: '💰' },
    { name: '메일', path: '/mail', icon: '📧' },
    { name: '설정', path: '/settings', icon: '⚙️' },
];

export default function Sidebar() {

    const pathname = usePathname()
    const router = useRouter()
    const dispatch = useAppDispatch()

    const role = useAppSelector((state) => state.auth.role)

    const [loginOpen, setLoginOpen] = useState(false)
    const [registerOpen, setRegisterOpen] = useState(false)
    const [qrOpen, setQrOpen] = useState(false)

    const [authReady, setAuthReady] = useState(false)

    // 🔥 localStorage → Redux 복구
    useEffect(() => {
        dispatch(restoreAuth())
        setAuthReady(true)
    }, [dispatch])

    const handleLogout = () => {
        dispatch(logout())
        router.push('/')
    }

    if (!authReady) return null

    return (
        <>
            <aside className="w-60 min-h-screen bg-slate-900 text-slate-200 flex flex-col shadow-xl">

                {/* 로고 */}
                <div className="px-6 py-5 border-b border-slate-700">
                    <h1 className="text-xl font-bold text-white">
                        EZ-Balance
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                        Management System
                    </p>
                </div>

                {/* 메뉴 */}
                <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">

                    {role && (
                        <>
                            <Link
                                href="/dashboard"
                                className={`block rounded-lg px-4 py-2.5 text-sm transition
                                ${
                                    pathname === '/dashboard'
                                        ? 'bg-indigo-600 text-white font-semibold shadow'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                대시보드
                            </Link>

                            <button
                                onClick={() => setQrOpen(true)}
                                className="block w-full text-left rounded-lg px-4 py-2.5 text-sm transition
                                text-slate-300 hover:bg-slate-800 hover:text-white"
                            >
                                QR 위치등록
                            </button>

                            <ContractSidebarList />

                            {menus.map((menu) => {

                                const isActive =
                                    pathname === menu.path ||
                                    pathname.startsWith(menu.path + '/')

                                return (
                                    <Link
                                        key={menu.path}
                                        href={menu.path}
                                        className={`block rounded-lg px-4 py-2.5 text-sm transition
                                        ${
                                            isActive
                                                ? 'bg-indigo-600 text-white font-semibold shadow'
                                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                        }`}
                                    >
                                        {menu.name}
                                    </Link>
                                )
                            })}
                        </>
                    )}

                </nav>

                {/* 하단 */}
                <div className="px-4 py-4 border-t border-slate-700">

                    {!role ? (
                        <>
                            <button
                                onClick={() => setLoginOpen(true)}
                                className="w-full rounded-lg px-3 py-2 text-sm
                                border border-slate-600 hover:bg-slate-800 transition"
                            >
                                로그인
                            </button>

                            <button
                                onClick={() => setRegisterOpen(true)}
                                className="w-full mt-2 rounded-lg px-3 py-2 text-sm
                                border border-slate-600 hover:bg-indigo-600 transition"
                            >
                                회원가입
                            </button>

                            <LoginModal
                                open={loginOpen}
                                onClose={() => setLoginOpen(false)}
                            />

                            <RegisterModal
                                open={registerOpen}
                                onClose={() => setRegisterOpen(false)}
                            />
                        </>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="w-full rounded-lg px-3 py-2 text-sm
                            border border-slate-600 hover:bg-red-600 transition"
                        >
                            로그아웃
                        </button>
                    )}

                </div>
            </aside>

            <QrGenerateModal
                open={qrOpen}
                onClose={() => setQrOpen(false)}
            />
        </>
    )
}