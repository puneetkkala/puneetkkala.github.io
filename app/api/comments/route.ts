import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { postSlug, content, parentCommentId } = await request.json()
    if (!postSlug || !content?.trim()) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data: post } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', postSlug)
        .single()

    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

    const { data, error } = await supabase.from('comments').insert({
        post_id: post.id,
        author_id: user.id,
        content: content.trim(),
        parent_comment_id: parentCommentId ?? null,
    }).select('*, profiles(display_name, avatar_url)').single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
}

export async function DELETE(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { commentId } = await request.json()

    const { error } = await supabase.from('comments')
        .delete()
        .eq('id', commentId)
    // RLS enforces own-row or admin only

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}
