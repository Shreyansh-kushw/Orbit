'use client'

import { useState } from 'react'
import { 
  ThumbsUp, 
  ThumbsDown, 
  Reply,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { Comment } from '@/lib/mock-data'

interface CommentItemProps {
  comment: Comment
  depth?: number
}

export function CommentItem({ comment, depth = 0 }: CommentItemProps) {
  const [isUpvoted, setIsUpvoted] = useState(comment.isUpvoted || false)
  const [isDownvoted, setIsDownvoted] = useState(comment.isDownvoted || false)
  const [upvotes, setUpvotes] = useState(comment.upvotes)
  const [downvotes, setDownvotes] = useState(comment.downvotes)
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [showReplies, setShowReplies] = useState(true)

  const handleUpvote = () => {
    if (isUpvoted) {
      setIsUpvoted(false)
      setUpvotes(upvotes - 1)
    } else {
      setIsUpvoted(true)
      setUpvotes(upvotes + 1)
      if (isDownvoted) {
        setIsDownvoted(false)
        setDownvotes(downvotes - 1)
      }
    }
  }

  const handleDownvote = () => {
    if (isDownvoted) {
      setIsDownvoted(false)
      setDownvotes(downvotes - 1)
    } else {
      setIsDownvoted(true)
      setDownvotes(downvotes + 1)
      if (isUpvoted) {
        setIsUpvoted(false)
        setUpvotes(upvotes - 1)
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const hasReplies = comment.replies && comment.replies.length > 0

  return (
    <div className={cn("relative", depth > 0 && "ml-6 pl-4 border-l-2 border-border/30")}>
      <div className="py-4">
        {/* Comment Header */}
        <div className="flex items-center gap-3 mb-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={comment.author.avatar} alt={comment.author.displayName} />
            <AvatarFallback>{comment.author.displayName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-foreground">
              {comment.author.displayName}
            </span>
            <span className="text-xs text-muted-foreground">
              @{comment.author.username}
            </span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">
              {formatDate(comment.createdAt)}
            </span>
          </div>
        </div>

        {/* Comment Content */}
        <p className="text-foreground text-sm leading-relaxed mb-3 ml-11">
          {comment.content}
        </p>

        {/* Comment Actions */}
        <div className="flex items-center gap-4 ml-11">
          <button
            onClick={handleUpvote}
            className={cn(
              "flex items-center gap-1 text-xs transition-colors",
              isUpvoted ? "text-success" : "text-muted-foreground hover:text-success"
            )}
          >
            <ThumbsUp className={cn("w-3.5 h-3.5", isUpvoted && "fill-current")} />
            <span>{upvotes}</span>
          </button>
          <button
            onClick={handleDownvote}
            className={cn(
              "flex items-center gap-1 text-xs transition-colors",
              isDownvoted ? "text-destructive" : "text-muted-foreground hover:text-destructive"
            )}
          >
            <ThumbsDown className={cn("w-3.5 h-3.5", isDownvoted && "fill-current")} />
            <span>{downvotes}</span>
          </button>
          <button
            onClick={() => setShowReplyInput(!showReplyInput)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <Reply className="w-3.5 h-3.5" />
            <span>Reply</span>
          </button>
          {hasReplies && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors"
            >
              {showReplies ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>Hide replies</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span>Show {comment.replies?.length} replies</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Reply Input */}
        {showReplyInput && (
          <div className="mt-3 ml-11">
            <Textarea
              placeholder="Write a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="min-h-[80px] bg-secondary/30 border-border/50 focus:border-primary/50 resize-none"
            />
            <div className="flex items-center gap-2 mt-2">
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90"
                disabled={!replyContent.trim()}
              >
                Reply
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setShowReplyInput(false)
                  setReplyContent('')
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Nested Replies */}
      {hasReplies && showReplies && (
        <div>
          {comment.replies?.map((reply) => (
            <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

interface CommentSectionProps {
  comments: Comment[]
}

export function CommentSection({ comments }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('')

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Comments ({comments.length})
      </h3>

      {/* Add Comment */}
      <div className="mb-6">
        <Textarea
          placeholder="Share your thoughts..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px] bg-secondary/30 border-border/50 focus:border-primary/50 resize-none"
        />
        <div className="flex justify-end mt-3">
          <Button
            className="bg-primary hover:bg-primary/90 glow-primary"
            disabled={!newComment.trim()}
          >
            Post Comment
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="divide-y divide-border/30">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  )
}
