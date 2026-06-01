'use client'

import { useEffect, useState, Suspense, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, TrendingUp, Hash, Filter } from 'lucide-react'
import { Navbar } from '@/components/orbit/navbar'
import { Sidebar } from '@/components/orbit/sidebar'
import { PostCard } from '@/components/orbit/post-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getPosts } from '@/lib/api'
import { mapPost } from '@/lib/utils'
import { PostApiResponse } from '@/lib/api'
import { Post, User } from '@/lib/schemas'
import { mapUser } from '@/lib/utils'
import { getCurrentUser } from '@/lib/auth'


function ExplorePageContent() {
  const searchParams = useSearchParams()
  const initialTag = searchParams.get('tag') || ''

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState(initialTag)
  const [sortBy, setSortBy] = useState<'trending' | 'latest' | 'top'>('trending')
  const [rawPosts, setRawPosts] = useState<any[] | null>(null)
  const [rawUser, setRawUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    getPosts().then((posts) => {
      if (posts) setRawPosts(posts)
    })
  }, [])

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) setRawUser(user)
      setAuthLoading(false)
    })
  }, [])

  const posts: Post[] = useMemo(() => rawPosts ? rawPosts.map(mapPost) : [], [rawPosts])
  const user: User | null = rawUser ? mapUser(rawUser) : null

  // Derive trending topics from real post data
  const trendingTopics = useMemo(() => {
    const allTags = ['AI', 'Technology', 'Programming', 'Science', 'Philosophy', 'Web3', 'Space', 'Future']
    return allTags.map(tag => ({
      tag,
      posts: posts.filter(p =>
        p.title.toLowerCase().includes(tag.toLowerCase()) ||
        p.content.toLowerCase().includes(tag.toLowerCase())
      ).length
    })).sort((a, b) => b.posts - a.posts)
  }, [posts])

  const allTags = ['AI', 'Technology', 'Programming', 'Science', 'Philosophy', 'Web3', 'Space', 'Future']

  // Filter posts based on search and tag
  const filteredPosts = useMemo(() => posts.filter(post => {
    const matchesSearch = searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTag = selectedTag === '' ||
      post.title.toLowerCase().includes(selectedTag.toLowerCase()) ||
      post.content.toLowerCase().includes(selectedTag.toLowerCase())

    return matchesSearch && matchesTag
  }), [posts, searchQuery, selectedTag])

  // Sort posts
  const sortedPosts = useMemo(() => [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      // case 'trending':
      //   return (b.likes + b.comments * 2) - (a.likes + a.comments * 2)
      case 'latest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      // case 'top':
      //   return b.likes - a.likes
      default:
        return 0
    }
  }), [filteredPosts, sortBy])

  return (
    <div className="min-h-screen bg-background">
      {!authLoading && (
        <Navbar
          isAuthenticated={!!user}
          user={user || undefined}
        />
      )}
      {authLoading && <div className="h-16" />}

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Header */}
            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">Explore</h1>
              </div>
              <p className="text-muted-foreground mb-6">
                Discover trending discussions and topics across the ORBIT
              </p>

              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search posts, topics, or users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary/30 border-border/50 focus:border-primary/50 h-12 text-base"
                />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTag('')}
                  className={cn(
                    "rounded-full",
                    selectedTag === '' && "bg-primary text-primary-foreground border-primary"
                  )}
                >
                  All Topics
                </Button>
                {allTags.map(tag => (
                  <Button
                    key={tag}
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTag(tag)}
                    className={cn(
                      "rounded-full",
                      selectedTag === tag && "bg-primary text-primary-foreground border-primary"
                    )}
                  >
                    <Hash className="w-3 h-3 mr-1" />
                    {tag}
                  </Button>
                ))}
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Sort by:</span>
                {(['trending', 'latest', 'top'] as const).map(option => (
                  <Button
                    key={option}
                    variant="ghost"
                    size="sm"
                    onClick={() => setSortBy(option)}
                    className={cn(
                      "text-sm capitalize",
                      sortBy === option ? "text-primary bg-primary/10" : "text-muted-foreground"
                    )}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>

            {/* Trending Topics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {trendingTopics.slice(0, 5).map((topic, index) => (
                <button
                  key={topic.tag}
                  onClick={() => setSelectedTag(topic.tag)}
                  className={cn(
                    "glass rounded-xl p-4 text-left hover:border-primary/50 transition-all",
                    selectedTag === topic.tag && "border-primary/50 bg-primary/5"
                  )}
                >
                  <span className="text-xs text-muted-foreground">#{index + 1} Trending</span>
                  <p className="font-semibold text-foreground mt-1">#{topic.tag}</p>
                  <p className="text-xs text-accent mt-1">{topic.posts} posts</p>
                </button>
              ))}
            </div>

            {/* Results */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  {selectedTag ? `#${selectedTag}` : 'All Posts'}
                  <span className="text-muted-foreground font-normal ml-2">
                    ({sortedPosts.length} results)
                  </span>
                </h2>
              </div>

              {!rawPosts ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              ) : sortedPosts.length > 0 ? (
                sortedPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="glass rounded-xl p-12 text-center">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filters to find what you&apos;re looking for.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <Sidebar />
        </div>
      </main>
    </div>
  )
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <ExplorePageContent />
    </Suspense>
  )
}
