import type { Metadata } from 'next'
import { NewPostForm } from '../NewPostForm'

export const metadata: Metadata = { title: 'Create Blog Post' }

export default function NewBlogPostPage() {
    return <NewPostForm />
}
