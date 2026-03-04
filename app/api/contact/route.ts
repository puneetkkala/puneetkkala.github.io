import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, subject, message } = body

        if (!name?.trim() || !email?.trim() || !message?.trim()) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
        }

        const supabase = await createClient()
        const { error } = await supabase.from('contact_messages').insert({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            subject: subject?.trim() || null,
            message: message.trim(),
        })

        if (error) throw error

        return NextResponse.json({ success: true }, { status: 201 })
    } catch (err) {
        console.error('Contact form error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
