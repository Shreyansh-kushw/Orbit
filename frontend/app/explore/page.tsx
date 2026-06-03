'use client'

import { useEffect, useState, Suspense, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, TrendingUp, Hash, Filter, Loader2 } from 'lucide-react'
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
  const router = useRouter()
  const initialTag = searchParams.get('tag') || ''

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState(initialTag)
  const [sortBy, setSortBy] = useState<'trending' | 'latest' | 'top'>('trending')
  const [posts, setPosts] = useState<Post[]>([])
  const [totalPosts, setTotalPosts] = useState(0)
  const [skip, setSkip] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)
  const [rawUser, setRawUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  const limit = 10

  const handleTagSelect = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (tag) {
      params.set('tag', tag)
    } else {
      params.delete('tag')
    }
    router.push(`/explore?${params.toString()}`)
  }

  // Sync selectedTag with URL query parameter
  useEffect(() => {
    setSelectedTag(initialTag)
  }, [initialTag])

  const fetchPosts = async (currentSkip: number, reset = false) => {
    setIsLoadingPosts(true)
    try {
      const response = await getPosts(currentSkip, limit)
      const newPosts = response.posts.map(mapPost)
      
      if (reset) {
        setPosts(newPosts)
      } else {
        setPosts(prev => [...prev, ...newPosts])
      }
      
      setTotalPosts(response.total)
      setHasMore(response.has_more)
      setSkip(currentSkip)
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setIsLoadingPosts(false)
    }
  }

  useEffect(() => {
    fetchPosts(0, true)
  }, [])

  const handleLoadMore = () => {
    if (hasMore && !isLoadingPosts) {
      fetchPosts(skip + limit)
    }
  }

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) setRawUser(user)
      setAuthLoading(false)
    })
  }, [])

  const user: User | null = rawUser ? mapUser(rawUser) : null

  // Extract all unique tags from real post data
  const allAvailableTags = useMemo(() => {
    const tagsSet = new Set<string>()
    // We only have the currently loaded posts, so this might not be complete
    // In a real app, you might have a separate endpoint for tags
    posts.forEach(post => {
      post.tags?.forEach(tag => tagsSet.add(tag))
    })
    // If no tags found in posts, use some defaults to keep UI populated
    const defaults = ['AI', 'Technology', 'Programming', 'Science', 'Philosophy', 'Web3', 'Space', 'Future']
    const combined = Array.from(tagsSet)
    return combined.length > 0 ? combined.sort() : defaults
  }, [posts])

  // Derive trending topics from real post data
  const trendingTopics = useMemo(() => {
    const tagCounts: Record<string, number> = {}
    posts.forEach(post => {
      post.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    })

    const trending = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, posts: count }))
      .sort((a, b) => b.posts - a.posts)

    // Fallback if no tags exist yet
    if (trending.length === 0) {
      return allAvailableTags.map(tag => ({ tag, posts: 0 }))
    }
    return trending
  }, [posts, allAvailableTags])

  // Filter posts based on search and tag
  const filteredPosts = useMemo(() => posts.filter(post => {
    const matchesSearch = searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesTag = selectedTag === '' ||
      post.tags?.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())

    return matchesSearch && matchesTag
  }), [posts, searchQuery, selectedTag])

  // Sort posts
  const sortedPosts = useMemo(() => [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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
                  onClick={() => handleTagSelect('')}
                  className={cn(
                    "rounded-full transition-all",
                    selectedTag === '' 
                      ? "bg-primary text-primary-foreground border-primary glow-primary" 
                      : "hover:bg-primary/10 hover:text-primary hover:border-primary/50"
                  )}
                >
                  All Topics
                </Button>
                {allAvailableTags.map(tag => (
                  <Button
                    key={tag}
                    variant="outline"
                    size="sm"
                    onClick={() => handleTagSelect(tag)}
                    className={cn(
                      "rounded-full transition-all capitalize",
                      selectedTag === tag 
                        ? "bg-primary text-primary-foreground border-primary glow-primary" 
                        : "hover:bg-primary/10 hover:text-primary hover:border-primary/50"
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
                      onClick={() => handleTagSelect(topic.tag)}
                      className={cn(
                      "glass rounded-xl p-4 text-left hover:border-primary/50 transition-all",
                      selectedTag === topic.tag && "border-primary/50 bg-primary/10 glow-primary-sm"
                      )}
                      >
                      <span className="text-xs text-muted-foreground">#{index + 1} Trending</span>
                      <p className="font-semibold text-foreground mt-1 capitalize">#{topic.tag}</p>
                      <p className="text-xs text-accent mt-1">{topic.posts} posts</p>
                      </button>
                      ))}
                      </div>

                      {/* Results */}
                      <div className="space-y-4">
                      <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-foreground">
                      <span className="capitalize">{selectedTag ? `#${selectedTag}` : 'All Posts'}</span>
                      <span className="text-muted-foreground font-normal ml-2">
                      ({totalPosts} results)
                      </span>
                      </h2>
                      </div>

              {!posts.length && isLoadingPosts ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              ) : sortedPosts.length > 0 ? (
                <>
                  {sortedPosts.map(post => (
                    <PostCard key={post.id} post={post} />
                  ))}
                  
                  {hasMore && (
                    <div className="flex justify-center pt-8 pb-4">
                      <Button 
                        variant="secondary"
                        size="lg"
                        onClick={handleLoadMore}
                        disabled={isLoadingPosts}
                        className="min-w-[200px] border border-white/10 shadow-lg hover:border-primary/50 transition-all"
                      >
                        {isLoadingPosts ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          'Load More Posts'
                        )}
                      </Button>
                    </div>
                  )}
                </>
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
