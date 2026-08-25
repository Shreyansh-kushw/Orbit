'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Clock,
  ChevronRight
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Post } from '@/lib/schemas'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface PostCardProps {
  post: Post
  showFullContent?: boolean
}

export function PostCard({ post, showFullContent = false }: PostCardProps) {

  const MAX_PREVIEW_LENGTH = 400
  const shouldTruncate = !showFullContent && post.content.length > MAX_PREVIEW_LENGTH
  const displayContent = shouldTruncate
    ? post.content.slice(0, MAX_PREVIEW_LENGTH) + '...'
    : post.content

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <article className="glass rounded-xl p-5 hover:border-primary/30 transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link href={`/profile/@${post.author.username}`}>
            <Avatar className="w-12 h-12 ring-2 ring-transparent group-hover:ring-primary/30 transition-all">
              <AvatarImage 
                src={post.author.avatar} 
                alt={post.author.displayName} 
              />
              <AvatarFallback>{post.author.displayName?.[0] || 'U'}</AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link
              href={`/profile/@${post.author.username}`}
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              {post.author.displayName}
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>@{post.author.username}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(post.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <Link href={`/post/${post.id}`} className="block">
        <h2 className="text-lg font-semibold text-foreground mb-2 hover:text-primary transition-colors">
          {post.title}
        </h2>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
          {displayContent}
        </p>
        {shouldTruncate && (
          <span className="inline-flex items-center gap-1 text-primary text-sm mt-2 hover:underline">
            Read Full Post <ChevronRight className="w-4 h-4" />
          </span>
        )}
      </Link>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.map((tag) => (
            <Badge
              key={tag}
              variant="bubble"
              className="px-4 py-1 text-sm font-semibold capitalize"
              asChild
            >
              <Link href={`/explore?tag=${tag}`}>
                #{tag}
              </Link>
            </Badge>
          ))}
        </div>
      )}
    </article>
  )
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}
