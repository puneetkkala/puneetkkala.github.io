import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { postSlug, type } = await request.json()
    if (!postSlug || !['heart', 'insightful', 'clap'].includes(type)) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    // Look up post id from slug
    const { data: post } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', postSlug)
        .single()

    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

    const { error } = await supabase.from('reactions').upsert(
        { post_id: post.id, author_id: user.id, type },
        { onConflict: 'post_id,author_id,type' }
    )

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true }, { status: 201 })
}

export async function DELETE(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { postSlug, type } = await request.json()

    const { data: post } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', postSlug)
        .single()

    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

    const { error } = await supabase.from('reactions')
        .delete()
        .eq('post_id', post.id)
        .eq('author_id', user.id)
        .eq('type', type)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}
