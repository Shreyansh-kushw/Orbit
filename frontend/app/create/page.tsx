'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Send, FileText, Eye, AlertCircle } from 'lucide-react'
import { Navbar } from '@/components/orbit/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { getCurrentUser } from '@/lib/auth'
import { User } from '@/lib/schemas'
import { mapUser } from '@/lib/utils'

export default function CreatePostPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPreview, setIsPreview] = useState(false)

  let user: User | null;

  const [rawUser, setRawUser] = useState(null)
  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user){
        setRawUser(user)
      }
    })
  }, [])

  if (rawUser) {
    user = mapUser(rawUser)
  }
  else {
    user = null
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)

    // Redirect to home
    router.push('/')
  }

  const characterCount = content.length
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        isAuthenticated={!!user}
        user={user || undefined}
      />

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </Link>

        {/* Header */}
        <div className="glass rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Create Post</h1>
            </div>
            <div className="flex items-center gap-2">
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
          </div>
          <p className="text-muted-foreground">
            Share your thoughts with the ORBIT community
          </p>
        </div>

        {/* Form / Preview */}
        <div className="glass rounded-xl p-6">
          {!isPreview ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-foreground">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Give your post a compelling title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-secondary/30 border-border/50 focus:border-primary/50 h-12 text-lg"
                  maxLength={200}
                  required
                />
                <p className="text-xs text-muted-foreground text-right">
                  {title.length}/200 characters
                </p>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-foreground">
                  Content <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="content"
                  placeholder="Share your thoughts, ideas, or start a discussion..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="bg-secondary/30 border-border/50 focus:border-primary/50 min-h-[300px] text-base leading-relaxed resize-none"
                  required
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{wordCount} words</span>
                  <span>{characterCount} characters</span>
                </div>
              </div>

              {/* Guidelines */}
              <div className="bg-secondary/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground mb-1">Posting Guidelines</p>
                    <ul className="text-muted-foreground space-y-1">
                      <li>Be respectful and constructive in your discussions</li>
                      <li>No spam, self-promotion, or misleading content</li>
                      <li>Give credit when sharing others&apos; ideas</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !title.trim() || !content.trim()}
                  className="bg-primary hover:bg-primary/90 glow-primary"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Publishing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Publish Post
                    </span>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            /* Preview */
            <div>
              <div className="mb-6 pb-6 border-b border-border/50">
                <span className="text-xs text-accent uppercase tracking-wider">Preview</span>
              </div>

              {title || content ? (
                <article>
                  <h1 className="text-2xl font-bold text-foreground mb-4">
                    {title || 'Untitled Post'}
                  </h1>
                  <p className="text-foreground leading-relaxed whitespace-pre-line">
                    {content || 'No content yet...'}
                  </p>
                </article>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Start writing to see your preview
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
