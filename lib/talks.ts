import { createClient } from '@/lib/supabase/server'

export type Talk = {
  id: string
  title: string
  event_name: string | null
  event_date: string | null
  location: string | null
  talk_url: string | null
  video_embed_url: string | null
  description: string | null
}

export async function getPublishedTalks(limit?: number): Promise<Talk[]> {
  const supabase = await createClient()
  let query = supabase
    .from('talks')
    .select('id, title, event_name, event_date, location, talk_url, video_embed_url, description')
    .eq('is_published', true)
    .order('event_date', { ascending: false, nullsFirst: false })

  if (typeof limit === 'number') {
    query = query.limit(limit)
  }

  const { data, error } = await query
  if (error) return []
  return data ?? []
}
