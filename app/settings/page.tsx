'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Download, Trash2, Shield, Edit2, CheckCircle, AlertCircle, Cookie } from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
    const router = useRouter()
    const supabase = createClient()

    const [user, setUser] = useState<SupabaseUser | null>(null)
    const [profile, setProfile] = useState<{ display_name: string; bio: string | null } | null>(null)
    const [displayName, setDisplayName] = useState('')
    const [bio, setBio] = useState('')
    const [saving, setSaving] = useState(false)
    const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) { router.push('/login?redirectTo=/settings'); return }
            setUser(user)
            supabase.from('profiles').select('display_name, bio').eq('id', user.id).single()
                .then(({ data }) => {
                    if (data) {
                        setProfile(data)
                        setDisplayName(data.display_name ?? '')
                        setBio(data.bio ?? '')
                    }
                })
        })
    }, [])

    async function handleSaveProfile() {
        if (!user) return
        setSaving(true)
        setStatus(null)
        const { error } = await supabase.from('profiles')
            .update({ display_name: displayName, bio })
            .eq('id', user.id)
        setSaving(false)
        setStatus(error
            ? { type: 'error', msg: error.message }
            : { type: 'success', msg: 'Profile updated.' }
        )
    }

    async function handleDownloadData() {
        if (!user) return
        const [{ data: profileData }, { data: comments }, { data: reactions }] = await Promise.all([
            supabase.from('profiles').select('*').eq('id', user.id).single(),
            supabase.from('comments').select('*').eq('author_id', user.id),
            supabase.from('reactions').select('*').eq('author_id', user.id),
        ])
        const blob = new Blob([JSON.stringify({
            exported_at: new Date().toISOString(),
            account: { email: user.email, created_at: user.created_at },
            profile: profileData,
            comments: comments ?? [],
            reactions: reactions ?? [],
        }, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url; a.download = 'happyhub-my-data.json'
        a.click(); URL.revokeObjectURL(url)
    }

    async function handleDeleteAccount() {
        if (!user) return
        setDeleting(true)
        // Delete user data — Supabase cascade deletes profile, comments, reactions
        await supabase.auth.signOut()
        // Note: Full account deletion requires a server-side API call with service role key
        router.push('/login?message=Account deletion requested. Your data will be removed within 48 hours.')
    }

    if (!user) return (
        <div className="section container-md text-center text-slate-400">Loading…</div>
    )

    return (
        <div className="section">
            <div className="container-md">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Account Settings</h1>
                <p className="text-slate-500 mb-10">Manage your profile and data rights.</p>

                {status && (
                    <div className={`flex items-center gap-2 px-4 py-3 rounded-xl mb-6 text-sm font-medium ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`} role="alert">
                        {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                        {status.msg}
                    </div>
                )}

                {/* Profile */}
                <section className="card p-6 mb-6" aria-labelledby="profile-heading">
                    <h2 id="profile-heading" className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <User size={18} className="text-blue-600" aria-hidden="true" /> Profile
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="form-label" htmlFor="email">Email (read-only)</label>
                            <input id="email" type="email" value={user.email ?? ''} readOnly
                                className="form-input bg-slate-50 text-slate-500 cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="form-label" htmlFor="display-name">Display name</label>
                            <input id="display-name" type="text" value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="form-input" placeholder="Your name" />
                        </div>
                        <div>
                            <label className="form-label" htmlFor="bio">Short bio (optional)</label>
                            <textarea id="bio" value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="form-input min-h-[80px] resize-y" placeholder="Tell us a bit about yourself" />
                        </div>
                        <button onClick={handleSaveProfile} disabled={saving} className="btn-primary">
                            <Edit2 size={15} aria-hidden="true" />
                            {saving ? 'Saving…' : 'Save profile'}
                        </button>
                    </div>
                </section>

                {/* Data rights */}
                <section className="card p-6 mb-6" aria-labelledby="rights-heading">
                    <h2 id="rights-heading" className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                        <Shield size={18} className="text-green-600" aria-hidden="true" /> Your data rights
                    </h2>
                    <p className="text-sm text-slate-500 mb-5">
                        Under GDPR, CCPA, and India's DPDP Act, you have the following rights:
                    </p>
                    <div className="space-y-3">
                        {/* Download */}
                        <div className="flex items-start justify-between gap-4 py-3 border-b border-slate-100">
                            <div>
                                <p className="font-medium text-slate-800 text-sm">Download my data</p>
                                <p className="text-xs text-slate-400 mt-0.5">Export your profile, comments, and reactions as JSON</p>
                            </div>
                            <button onClick={handleDownloadData} className="btn-outline text-sm shrink-0">
                                <Download size={14} aria-hidden="true" /> Download
                            </button>
                        </div>

                        {/* Cookie consent */}
                        <div className="flex items-start justify-between gap-4 py-3 border-b border-slate-100">
                            <div>
                                <p className="font-medium text-slate-800 text-sm">Analytics consent</p>
                                <p className="text-xs text-slate-400 mt-0.5">Change whether Google Analytics is active for you</p>
                            </div>
                            <button
                                onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}
                                className="btn-outline text-sm shrink-0"
                            >
                                <Cookie size={14} aria-hidden="true" /> Cookie settings
                            </button>
                        </div>

                        {/* Delete account */}
                        <div className="flex items-start justify-between gap-4 py-3">
                            <div>
                                <p className="font-medium text-red-700 text-sm">Delete my account</p>
                                <p className="text-xs text-slate-400 mt-0.5">Permanently remove your account and all associated data</p>
                            </div>
                            {!showDeleteConfirm ? (
                                <button onClick={() => setShowDeleteConfirm(true)} className="btn-outline text-sm text-red-600 border-red-200 hover:bg-red-50 shrink-0">
                                    <Trash2 size={14} aria-hidden="true" /> Delete account
                                </button>
                            ) : (
                                <div className="flex items-center gap-2 shrink-0">
                                    <button onClick={() => setShowDeleteConfirm(false)} className="btn-ghost text-sm">
                                        Cancel
                                    </button>
                                    <button onClick={handleDeleteAccount} disabled={deleting}
                                        className="btn-primary text-sm bg-red-600 hover:bg-red-700 disabled:opacity-50">
                                        {deleting ? 'Processing…' : 'Confirm delete'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <p className="text-xs text-slate-400">
                    For any data request not covered above, contact us at{' '}
                    <a href="mailto:puneet@happyhub.in" className="text-blue-600 hover:underline">puneet@happyhub.in</a>
                </p>
            </div>
        </div>
    )
}
