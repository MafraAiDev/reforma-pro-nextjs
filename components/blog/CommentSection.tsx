'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User } from 'lucide-react'
import type { Comment } from '@/types'
import { formatRelativeTime } from '@/lib/utils'

const commentSchema = z.object({
  username: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  content: z.string().min(10, 'Comentario deve ter pelo menos 10 caracteres'),
})

type CommentFormData = z.infer<typeof commentSchema>

interface CommentSectionProps {
  postId: string
  initialComments: Comment[]
}

export function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  })

  const onSubmit = async (data: CommentFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: postId,
          user_name: data.username,
          content: data.content,
        }),
      })

      if (response.ok) {
        const newComment = await response.json()
        setComments((prev) => [newComment, ...prev])
        reset()
      }
    } catch (error) {
      console.error('Failed to post comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mt-12">
      <h3 className="text-h2 text-text mb-6">Comments</h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap gap-4 mb-8">
        <div className="w-full sm:w-auto">
          <input
            {...register('username')}
            type="text"
            placeholder="Username..."
            className="w-full sm:w-40 h-10 px-4 border border-border rounded-comment text-body-sm outline-none focus:border-primary"
          />
          {errors.username && (
            <p className="text-small text-red-500 mt-1">{errors.username.message}</p>
          )}
        </div>
        <div className="flex-1 min-w-[200px]">
          <input
            {...register('content')}
            type="text"
            placeholder="Your Comment..."
            className="w-full h-10 px-4 border border-border rounded-comment text-body-sm outline-none focus:border-primary"
          />
          {errors.content && (
            <p className="text-small text-red-500 mt-1">{errors.content.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary disabled:opacity-50"
        >
          {isSubmitting ? 'Enviando...' : 'Comment'}
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
        {comments.length === 0 && (
          <p className="text-body text-text-muted">Seja o primeiro a comentar!</p>
        )}
      </div>
    </section>
  )
}

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="bg-background-comment rounded-comment p-4">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full bg-text flex items-center justify-center flex-shrink-0">
          <User className="w-8 h-8 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <p className="text-body text-text-secondary mb-2">{comment.content}</p>
          <div className="flex items-center gap-4 text-body">
            <span className="text-text-secondary">{comment.user_name}</span>
            <button className="text-text-muted hover:text-primary transition-colors">
              Reply
            </button>
            <span className="text-primary-light">{formatRelativeTime(comment.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
