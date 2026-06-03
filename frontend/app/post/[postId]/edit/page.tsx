'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Save, 
  FileText, 
  Eye, 
  AlertCircle, 
  Hash, 
  X, 
  Plus, 
  Pencil,
  Lock
} from 'lucide-react'
import { Navbar } from '@/components/orbit/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { getCurrentUser } from '@/lib/auth'
import { User, Post } from '@/lib/schemas'
import { mapUser, mapPost } from '@/lib/utils'
import { getPostsByID } from '@/lib/api'
import Cookies from 'js-cookie'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.postId as string

  const [initialData, setInitialData] = useState<Post | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  
  const [tagInput, setTagInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [postLoading, setPostLoading] = useState(true)
  const [rawUser, setRawUser] = useState(null)

  // Field edit states
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingContent, setIsEditingContent] = useState(false)
  const [isEditingTags, setIsEditingTags] = useState(false)

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) setRawUser(user)
      setAuthLoading(false)
    })
  }, [])

  useEffect(() => {
    async function loadPost() {
      try {
        const data = await getPostsByID(postId)
        const mappedPost = mapPost(data)
        setInitialData(mappedPost)
        setTitle(mappedPost.title)
        setContent(mappedPost.content)
        setTags(mappedPost.tags || [])
      } catch (err) {
        setError('Failed to load post')
      } finally {
        setPostLoading(false)
      }
    }
    loadPost()
  }, [postId])

  const user: User | null = rawUser ? mapUser(rawUser) : null

  // Security check: only author can edit
  useEffect(() => {
    if (!authLoading && !postLoading && user && initialData) {
      if (user.username !== initialData.author.username) {
        router.push(`/post/${postId}`)
      }
    }
  }, [authLoading, postLoading, user, initialData, router, postId])

  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return
    e.preventDefault()
    
    const tag = tagInput.trim().replace(/^#/, '')
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const token = Cookies.get('access_token')
    
    // Only send changed fields
    const updatedFields: any = {}
    if (title !== initialData?.title) updatedFields.title = title
    if (content !== initialData?.content) updatedFields.content = content
    
    const initialTagsStr = (initialData?.tags || []).sort().join(',')
    const currentTagsStr = [...tags].sort().join(',')
    if (initialTagsStr !== currentTagsStr) {
      updatedFields.tags = tags.join(',')
    }

    if (Object.keys(updatedFields).length === 0) {
      setIsSubmitting(false)
      router.push(`/post/${postId}`)
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to update post')
      }

      router.push(`/post/${postId}`)
    } catch (err: any) {
      setError(err.message)
      setIsSubmitting(false)
    }
  }

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
  const characterCount = content.length

  if (authLoading || postLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={!!user} user={user || undefined} />

      <main className="max-w-3xl mx-auto px-4 py-6">
        <Link
          href={`/post/${postId}`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Post</span>
        </Link>

        <div className="glass rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Pencil className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Edit Post</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPreview(!isPreview)}
              className={cn(isPreview && "bg-secondary")}
            >
              <Eye className="w-4 h-4 mr-1" />
              {isPreview ? 'Edit' : 'Preview'}
            </Button>
          </div>
          <p className="text-muted-foreground">
            Update your post content and tags
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="glass rounded-xl p-6">
          {!isPreview ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="title" className="text-base font-semibold text-foreground">
                    Title
                  </Label>
                  <button
                    type="button"
                    onClick={() => setIsEditingTitle(!isEditingTitle)}
                    className="text-xs flex items-center gap-1 text-primary hover:underline"
                  >
                    {isEditingTitle ? <Lock className="w-3 h-3" /> : <Pencil className="w-3 h-3" />}
                    {isEditingTitle ? 'Lock' : 'Edit Field'}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={!isEditingTitle}
                    className={cn(
                      "bg-secondary/30 border-border/50 focus:border-primary/50 h-12 text-lg pr-10",
                      !isEditingTitle && "opacity-70 cursor-not-allowed"
                    )}
                    maxLength={200}
                    required
                  />
                  {!isEditingTitle && (
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="content" className="text-base font-semibold text-foreground">
                    Content
                  </Label>
                  <button
                    type="button"
                    onClick={() => setIsEditingContent(!isEditingContent)}
                    className="text-xs flex items-center gap-1 text-primary hover:underline"
                  >
                    {isEditingContent ? <Lock className="w-3 h-3" /> : <Pencil className="w-3 h-3" />}
                    {isEditingContent ? 'Lock' : 'Edit Field'}
                  </button>
                </div>
                <div className="relative">
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={!isEditingContent}
                    className={cn(
                      "bg-secondary/30 border-border/50 focus:border-primary/50 min-h-[300px] text-base leading-relaxed resize-none pr-10",
                      !isEditingContent && "opacity-70 cursor-not-allowed"
                    )}
                    required
                  />
                  {!isEditingContent && (
                    <Lock className="absolute right-3 top-4 w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{wordCount} words</span>
                  <span>{characterCount} characters</span>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold text-foreground flex items-center gap-2">
                    <Hash className="w-4 h-4 text-primary" />
                    Tags
                  </Label>
                  <button
                    type="button"
                    onClick={() => setIsEditingTags(!isEditingTags)}
                    className="text-xs flex items-center gap-1 text-primary hover:underline"
                  >
                    {isEditingTags ? <Lock className="w-3 h-3" /> : <Pencil className="w-3 h-3" />}
                    {isEditingTags ? 'Lock' : 'Edit Field'}
                  </button>
                </div>

                <div className={cn("space-y-4", !isEditingTags && "opacity-70 pointer-events-none")}>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <span 
                        key={tag} 
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm border border-primary/20 capitalize"
                      >
                        #{tag}
                        {isEditingTags && (
                          <button 
                            type="button" 
                            onClick={() => removeTag(tag)}
                            className="hover:text-foreground transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                  {isEditingTags && tags.length < 5 && (
                    <div className="relative">
                      <Input
                        placeholder="Add tags..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        className="bg-secondary/30 border-border/50 focus:border-primary/50 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleAddTag}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-primary"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {isEditingTags && (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-muted-foreground">Suggested Tags:</p>
                      <div className="flex flex-wrap gap-2.5">
                        {['AI', 'Tech', 'Science', 'Philosophy', 'Coding', 'Space', 'Future', 'Web3'].map((suggestedTag) => (
                          <button
                            key={suggestedTag}
                            type="button"
                            onClick={() => {
                              if (!tags.includes(suggestedTag) && tags.length < 5) {
                                setTags([...tags, suggestedTag])
                              }
                            }}
                            disabled={tags.includes(suggestedTag) || tags.length >= 5}
                            className={cn(
                              "px-3 py-1.5 rounded-md text-sm border transition-all capitalize",
                              tags.includes(suggestedTag)
                                ? "bg-primary/5 text-primary/40 border-primary/10 cursor-not-allowed"
                                : "bg-secondary/50 text-muted-foreground border-border/50 hover:border-primary/50 hover:text-primary hover:bg-primary/5"
                            )}
                          >
                            #{suggestedTag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {!isEditingTags && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Field is locked. Click "Edit Field" to modify tags.
                  </p>
                )}
              </div>

              {/* Guidelines */}
              <div className="bg-secondary/30 rounded-lg p-5">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div className="text-base">
                    <p className="font-semibold text-foreground mb-2">Posting Guidelines</p>
                    <ul className="text-muted-foreground space-y-2 list-disc list-inside">
                      <li>Be respectful and constructive in your discussions</li>
                      <li>No spam, self-promotion, or misleading content</li>
                      <li>Give credit when sharing others&apos; ideas</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/50">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push(`/post/${postId}`)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90 glow-primary min-w-[140px]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Updating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Update Post
                    </span>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            /* Preview */
            <div>
              <div className="mb-6 pb-6 border-b border-border/50">
                <span className="text-xs text-accent uppercase tracking-wider">Previewing Changes</span>
              </div>
              <article>
                <h1 className="text-2xl font-bold text-foreground mb-4">
                  {title || 'Untitled Post'}
                </h1>
                <div className="flex flex-wrap gap-2 mb-6">
                  {tags.map(tag => (
                    <span key={tag} className="text-sm text-primary font-medium capitalize">
                      #{tag}
                    </span>
                  ))}
                </div>
                <p className="text-foreground leading-relaxed whitespace-pre-line">
                  {content || 'No content yet...'}
                </p>
              </article>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
