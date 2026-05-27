'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  UserPlus,
  Clock,
  ChevronRight
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Post } from '@/lib/mock-data'

interface PostCardProps {
  post: Post
  showFullContent?: boolean
}

export function PostCard({ post, showFullContent = false }: PostCardProps) {
  // const [isLiked, setIsLiked] = useState(post.isLiked || false)
  // const [isDisliked, setIsDisliked] = useState(post.isDisliked || false)
  // const [likes, setLikes] = useState(post.likes)
  // const [dislikes, setDislikes] = useState(post.dislikes)
  // const [isFollowing, setIsFollowing] = useState(post.author.isFollowing || false)

  const MAX_PREVIEW_LENGTH = 400
  const shouldTruncate = !showFullContent && post.content.length > MAX_PREVIEW_LENGTH
  const displayContent = shouldTruncate
    ? post.content.slice(0, MAX_PREVIEW_LENGTH) + '...'
    : post.content

  // const handleLike = () => {
  //   if (isLiked) {
  //     setIsLiked(false)
  //     setLikes(likes - 1)
  //   } else {
  //     setIsLiked(true)
  //     setLikes(likes + 1)
  //     if (isDisliked) {
  //       setIsDisliked(false)
  //       setDislikes(dislikes - 1)
  //     }
  //   }
  // }

  // const handleDislike = () => {
  //   if (isDisliked) {
  //     setIsDisliked(false)
  //     setDislikes(dislikes - 1)
  //   } else {
  //     setIsDisliked(true)
  //     setDislikes(dislikes + 1)
  //     if (isLiked) {
  //       setIsLiked(false)
  //       setLikes(likes - 1)
  //     }
  //   }
  // }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <article className="glass rounded-xl p-5 hover:border-primary/30 transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.author.username}`}>
            <Avatar className="w-12 h-12 ring-2 ring-transparent group-hover:ring-primary/30 transition-all">
              <AvatarImage src="/placeholder-user.jpg" alt={post.author.displayName} />
              <AvatarFallback delayMs={600}>
                {post.author.displayName}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link
              href={`/profile/${post.author.username}`}
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
        {/* <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFollowing(!isFollowing)}
          className={cn(
            "text-xs transition-all",
            isFollowing 
              ? "bg-primary/10 border-primary/50 text-primary" 
              : "border-border hover:border-primary/50 hover:text-primary"
          )}
        >
          <UserPlus className="w-3 h-3 mr-1" />
          {isFollowing ? 'Following' : 'Follow'}
        </Button> */}
      </div>

      {/* Content */}
      <Link href={`/post/${post.id}`} className="block">
        <h2 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
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

      {/* Actions */}
      {/* <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/50">
        <button
          onClick={handleLike}
          className={cn(
            "flex items-center gap-2 text-sm transition-colors",
            isLiked ? "text-success" : "text-muted-foreground hover:text-success"
          )}
        >
          <ThumbsUp className={cn("w-4 h-4", isLiked && "fill-current")} />
          <span>{formatNumber(likes)}</span>
        </button>
        <button
          onClick={handleDislike}
          className={cn(
            "flex items-center gap-2 text-sm transition-colors",
            isDisliked ? "text-destructive" : "text-muted-foreground hover:text-destructive"
          )}
        >
          <ThumbsDown className={cn("w-4 h-4", isDisliked && "fill-current")} />
          <span>{formatNumber(dislikes)}</span>
        </button>
        <Link
          href={`/post/${post.id}`}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{formatNumber(post.comments)} comments</span>
        </Link>
        <Link
          href={`/profile/${post.author.username}`}
          className="ml-auto text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          View Profile
        </Link>
      </div> */}
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
