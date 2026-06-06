'use client'

import { useEffect, useState, Suspense, useMemo, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, TrendingUp, Hash, Loader2 } from 'lucide-react'
import { Navbar } from '@/components/orbit/navbar'
import { Sidebar } from '@/components/orbit/sidebar'
import { PostCard } from '@/components/orbit/post-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn, mapPost, mapUser } from '@/lib/utils'
import { getPosts } from '@/lib/api'
import { Post, User } from '@/lib/schemas'
import { getCurrentUser } from '@/lib/auth'
import { EmptyState } from '@/components/orbit/empty-state'


function ExplorePageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialTag = searchParams.get('tag') || ''
  const initialSearch = searchParams.get('q') || ''

  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(initialSearch)
  const [selectedTag, setSelectedTag] = useState(initialTag)

  // Sync state with URL when it changes externally
  useEffect(() => {
    setSearchQuery(initialSearch)
    setDebouncedSearchQuery(initialSearch)
  }, [initialSearch])

  // Sync searchQuery with URL after debounce
  useEffect(() => {
    if (searchQuery === initialSearch) return

    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
      const params = new URLSearchParams(searchParams.toString())
      if (searchQuery) {
        params.set('q', searchQuery)
      } else {
        params.delete('q')
      }
      router.replace(`/explore?${params.toString()}`, { scroll: false })
    }, 800)

    return () => clearTimeout(timer)
  }, [searchQuery, initialSearch, router, searchParams])

  const [posts, setPosts] = useState<Post[]>([])
  const [totalPosts, setTotalPosts] = useState(0)
  const [skip, setSkip] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)
  const [rawUser, setRawUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const abortControllerRef = useRef<AbortController | null>(null)

  const limit = 10

  const handleTagSelect = (tag: string) => {
    // If the tag is already selected, unselect it (set to '')
    const newTag = selectedTag === tag ? '' : tag
    
    setSelectedTag(newTag)
    const params = new URLSearchParams(searchParams.toString())
    if (newTag) {
      params.set('tag', newTag)
    } else {
      params.delete('tag')
    }
    router.push(`/explore?${params.toString()}`, { scroll: false })
  }

  const fetchPosts = async (currentSkip: number, reset = false, tagToFetch = '', keywordToFetch = '') => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    setIsLoadingPosts(true)
    try {
      const response = await getPosts(
        currentSkip, 
        limit, 
        tagToFetch, 
        keywordToFetch, 
        abortControllerRef.current.signal
      )
      const newPosts = response.posts.map(mapPost)
      
      if (reset) {
        setPosts(newPosts)
      } else {
        setPosts(prev => [...prev, ...newPosts])
      }
      
      setTotalPosts(response.total)
      setHasMore(response.has_more)
      setSkip(currentSkip)
    } catch (error: any) {
      if (error.name === 'AbortError') return
      console.error("Error fetching posts:", error)
    } finally {
      setIsLoadingPosts(false)
    }
  }

  // Sync selectedTag with URL query parameter and fetch
  useEffect(() => {
    setSelectedTag(initialTag)
    fetchPosts(0, true, initialTag, debouncedSearchQuery)
  }, [initialTag, debouncedSearchQuery])

  const handleLoadMore = () => {
    if (hasMore && !isLoadingPosts) {
      fetchPosts(skip + limit, false, selectedTag, debouncedSearchQuery)
    }
  }

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) setRawUser(user)
      setAuthLoading(false)
    })
  }, [])

  const user: User | null = rawUser ? mapUser(rawUser) : null

  // Hardcoded tags to match the sidebar's "Galaxy Tags" exactly
  const allAvailableTags = ['AI', 'Tech', 'Science', 'Philosophy', 'Coding', 'Space', 'Future', 'Web3']

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
                Discover trending discussions and semantic topics across the ORBIT
              </p>

              {/* Search */}
              <div className="relative mb-6">
                <Search className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors",
                  debouncedSearchQuery ? "text-primary animate-pulse" : "text-muted-foreground"
                )} />
                <Input
                  type="search"
                  placeholder="Ask ORBIT something..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary/30 border-border/50 focus:border-primary/50 h-12 text-base"
                />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
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
                {allAvailableTags.map((tag: string) => (
                  <Button
                    key={tag}
                    variant="outline"
                    size="sm"
                    onClick={() => handleTagSelect(tag)}
                    className={cn(
                      "rounded-full transition-all capitalize border-border/50",
                      selectedTag.toLowerCase() === tag.toLowerCase() 
                        ? "bg-primary text-primary-foreground border-primary glow-primary hover:bg-primary/90 hover:text-primary-foreground" 
                        : "hover:bg-primary/10 hover:text-primary hover:border-primary/50"
                    )}
                  >
                    <Hash className="w-3 h-3 mr-1" />
                    {tag}
                  </Button>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground flex items-center">
                  <span className="capitalize">{selectedTag ? `#${selectedTag}` : 'All Posts'}</span>
                  {isLoadingPosts ? (
                    <Loader2 className="w-4 h-4 ml-3 animate-spin text-muted-foreground" />
                  ) : (
                    <span className="text-muted-foreground font-normal ml-2 transition-opacity">
                      ({totalPosts} results)
                    </span>
                  )}
                </h2>
              </div>

              {!posts.length && isLoadingPosts ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              ) : posts.length > 0 ? (
                <>
                  {posts.map(post => (
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
                <EmptyState
                  icon={<Search className="w-12 h-12" />}
                  title="No results found"
                  description="Try adjusting your search or filters to find what you're looking for."
                  action={
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchQuery('')
                        handleTagSelect('')
                      }}
                    >
                      Clear all filters
                    </Button>
                  }
                />
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
