'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  Clock,
  ArrowLeft,
  MoreVertical,
  Pencil,
  Trash2
} from 'lucide-react'
import { Navbar } from '@/components/orbit/navbar'
import { Sidebar } from '@/components/orbit/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { getPostsByID, PostApiResponse } from '@/lib/api'
import { mapPost, mapUser } from '@/lib/utils'
import { Post, User } from '@/lib/schemas'
import { getCurrentUser } from '@/lib/auth'
import { deletePost } from '@/lib/api'
import Cookies from 'js-cookie'

export default function PostPage() {

  const params = useParams()
  const router = useRouter()
  const postId = params.id as string

  const [rawPost, setPost] = useState<PostApiResponse | null>(null)
  const [rawUser, setRawUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const token = Cookies.get('access_token')

  useEffect(() => {
    getCurrentUser().then((u) => {
      if (u) setRawUser(u)
      setAuthLoading(false)
    })
  }, [])

  useEffect(() => {
    async function loadPost() {
      const data: PostApiResponse = await getPostsByID(postId)
      setPost(data)
    }
    loadPost()
  }, [postId])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!rawPost) return null

  const post: Post = mapPost(rawPost)
  const user: User | null = rawUser ? mapUser(rawUser) : null

  // Compare by username since that's guaranteed to exist on both sides
  const isAuthor = !authLoading && user && (
    user.username === post.author.username
  )

  console.log('[PostPage] auth debug', {
    authLoading,
    userUsername: user?.username,
    postAuthorUsername: post.author.username,
    isAuthor,
  })

  const handleDelete = async (postId: string) => {
    
    await deletePost(postId, token)
    router.push('/')
  }

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <div className="min-h-screen bg-background">
      {!authLoading && (
        <Navbar isAuthenticated={!!user} user={user || undefined} />
      )}
      {authLoading && <div className="h-16" />}

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          <div className="flex-1 space-y-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Feed</span>
            </Link>

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
                    </div>
                  </div>
                </div>

                {/* Author actions menu — only rendered after auth resolves */}
                {isAuthor && (
                  <div className="relative" ref={menuRef}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="text-muted-foreground hover:text-foreground"
                      style={{cursor: 'pointer'}}
                    >
                      <MoreVertical className="w-5 h-5" />
                    </Button>

                    {menuOpen && (
                      <div className="absolute right-0 mt-1 w-44 rounded-lg border border-border/60 bg-background/95 backdrop-blur shadow-lg z-10 overflow-hidden">
                        <Link
                          href={`/post/${postId}/edit`}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors"
                          onClick={() => setMenuOpen(false)}
                          
                        >
                          <Pencil className="w-4 h-4" />
                          Edit post
                        </Link>
                        <button
                          onClick={() => {
                            setMenuOpen(false)
                            setShowDeleteConfirm(true)
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                          style={{cursor: 'pointer'}}
                        >
                          <Trash2 className="w-4 h-4"/>
                          Delete post
                        </button>
                      </div>
                    )}
                  </div>
                )}
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
            </article>
          </div>

          <Sidebar />
        </div>
      </main>

      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl border border-border/50">
            <h2 className="text-lg font-semibold text-foreground mb-2">Delete post?</h2>
            <p className="text-sm text-muted-foreground mb-6">
              This action cannot be undone. The post will be permanently removed.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)} style={{cursor: 'pointer'}}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => handleDelete(post.id.toString())} style={{cursor: 'pointer'}}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
