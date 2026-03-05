import type { Metadata } from 'next'
import { TalkEditor } from '../TalkEditor'

export const metadata: Metadata = { title: 'Talk Editor' }
export const dynamic = 'force-dynamic'

export default function AdminTalkEditorPage() {
    return <TalkEditor />
}
