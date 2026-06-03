'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { PostCard } from '@/components/orbit/post-card'
import { Button } from '@/components/ui/button'
import { getPosts } from '@/lib/api'
import { mapPost } from '@/lib/utils'
import { Post } from '@/lib/schemas'

interface PostFeedProps {
  initialPosts: Post[]
  initialHasMore: boolean
}

export function PostFeed({ initialPosts, initialHasMore }: PostFeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [isLoading, setIsLoading] = useState(false)
  const [skip, setSkip] = useState(initialPosts.length)
  const limit = 20

  const handleLoadMore = async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      const response = await getPosts(skip, limit)
      const newPosts = response.posts.map(mapPost)
      
      setPosts(prev => [...prev, ...newPosts])
      setHasMore(response.has_more)
      setSkip(prev => prev + limit)
    } catch (error) {
      console.error("Error fetching more posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {hasMore && (
        <div className="flex justify-center pt-8 pb-4">
          <Button 
            variant="secondary"
            size="lg"
            onClick={handleLoadMore}
            disabled={isLoading}
            className="min-w-[200px] border border-white/10 shadow-lg hover:border-primary/50 transition-all"
          >
            {isLoading ? (
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
    </div>
  )
}
