'use client'
import { useState } from 'react'
import LoginModal from '@/components/auth/LoginModal'

export default function LoginPage() {
    const [open, setOpen] = useState(true)

    return (
        <LoginModal open={open} onClose={() => setOpen(false)} />
    )
}
