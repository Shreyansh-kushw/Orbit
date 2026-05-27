'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Clock,
  UserPlus,
  ArrowLeft,
  Bookmark,
  Flag
} from 'lucide-react'
import { Navbar } from '@/components/orbit/navbar'
import { Sidebar } from '@/components/orbit/sidebar'
import { CommentSection } from '@/components/orbit/comment-section'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getPostsByID, PostApiResponse } from '@/lib/api'
import { mapPost } from '@/lib/utils'
import { Post, User } from '@/lib/schemas'

const currentUser: User = { // TEMPORARY
  id: 1,
  username: 'orbituser',
  displayName: 'Orbit User',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=orbituser',
}

export default function PostPage() {

  const params = useParams()
  const postId = params.id as string

  const [rawPost, setPost] = useState<PostApiResponse | null>(null)

  useEffect(() => {
    async function loadPost() {
      const data: PostApiResponse = await getPostsByID(postId)
      setPost(data)
    }
    loadPost()
  }, [postId])

  if (!rawPost){
    return
  }

  const post: Post = mapPost(rawPost);

  // const [isLiked, setIsLiked] = useState(false)
  // const [isDisliked, setIsDisliked] = useState(false)
  // const [likes, setLikes] = useState(post.likes)
  // const [dislikes, setDislikes] = useState(post.dislikes)
  // const [isFollowing, setIsFollowing] = useState(false)
  // const [isSaved, setIsSaved] = useState(false)

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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        isAuthenticated={true}
        user={{
          username: currentUser.username,
          displayName: currentUser.displayName,
          avatar: currentUser.avatar,
        }}
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Back Button */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Feed</span>
            </Link>

            {/* Post Content */}
            <article className="glass rounded-xl p-6">
              {/* Author Card */}
              <div className="flex items-start justify-between mb-6 pb-6 border-b border-border/50">
                <div className="flex items-center gap-4">
                  <Link href={`/profile/${post.author.username}`}>
                    <Avatar className="w-14 h-14 ring-2 ring-primary/30">
                      <AvatarImage src={post.author.avatar} alt={post.author.displayName} />
                      <AvatarFallback>{post.author.displayName[0]}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <Link
                      href={`/profile/${post.author.username}`}
                      className="font-semibold text-lg text-foreground hover:text-primary transition-colors"
                    >
                      {post.author.displayName}
                    </Link>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>@{post.author.username}</span>
                      <span>·</span>
                      {/* <span>{formatNumber(post.author.followers)} followers</span> */}
                    </div>
                  </div>
                </div>
                {/* <Button
                  variant="outline"
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={cn(
                    "transition-all",
                    isFollowing 
                      ? "bg-primary/10 border-primary/50 text-primary" 
                      : "border-border hover:border-primary/50 hover:text-primary"
                  )}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {isFollowing ? 'Following' : 'Follow'}
                </Button> */}
              </div>

              {/* Post Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-balance">
                {post.title}
              </h1>

              {/* Post Meta */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDate(post.createdAt)}
                </span>
              </div>

              {/* Post Content */}
              <div className="prose prose-invert max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-line text-base">
                  {post.content}
                </p>
              </div>

              {/* Post Actions */}
              {/* <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLike}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
                      isLiked 
                        ? "bg-success/20 text-success" 
                        : "text-muted-foreground hover:bg-success/10 hover:text-success"
                    )}
                  >
                    <ThumbsUp className={cn("w-5 h-5", isLiked && "fill-current")} />
                    <span className="font-medium">{formatNumber(likes)}</span>
                  </button>
                  <button
                    onClick={handleDislike}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
                      isDisliked 
                        ? "bg-destructive/20 text-destructive" 
                        : "text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    )}
                  >
                    <ThumbsDown className={cn("w-5 h-5", isDisliked && "fill-current")} />
                    <span className="font-medium">{formatNumber(dislikes)}</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSaved(!isSaved)}
                    className={cn(isSaved && "text-accent")}
                  >
                    <Bookmark className={cn("w-4 h-4 mr-1", isSaved && "fill-current")} />
                    {isSaved ? 'Saved' : 'Save'}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Flag className="w-4 h-4 mr-1" />
                    Report
                  </Button>
                </div>
              </div> */}
            </article>

            {/* Comments Section */}
            {/* <CommentSection comments={mockComments} /> */}
          </div>

          {/* Right Sidebar */}
          <Sidebar />
        </div>
      </main>
    </div>
  )
}
