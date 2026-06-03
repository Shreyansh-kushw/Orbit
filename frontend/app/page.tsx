import { Navbar } from '@/components/orbit/navbar'
import { Sidebar } from '@/components/orbit/sidebar'
import { PostFeed } from '@/components/orbit/post-feed'
import { getPosts } from '@/lib/api'
import { mapPost, mapUser } from '@/lib/utils'
import { getCurrentUser } from '@/lib/auth'
import { User } from '@/lib/schemas'


export default async function HomePage() {

  const response = await getPosts(0, 20);
  const rawPosts = response.posts;
  const posts = rawPosts.map(mapPost)
  const hasMore = response.has_more;

  const rawUser = await getCurrentUser()
  let user: User | null;
  if (rawUser) {
    user = mapUser(rawUser)
  }
  else {
    user = null
  }
  return (
    <div className="min-h-screen bg-background">
      <Navbar
        isAuthenticated={!!user}
        user={user || undefined}
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Main Feed */}
          <div className="flex-1 space-y-4">
            {/* Feed Header */}
            <div className="glass rounded-xl p-4 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-foreground">Your Feed</h1>
                <p className="text-sm text-muted-foreground">Discover discussions from across the ORBIT</p>
              </div>
              <div className="flex items-center gap-2">
                <select className="bg-secondary/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50">
                  <option value="latest">Latest</option>
                  <option value="trending">Trending</option>
                  <option value="top">Top</option>
                </select>
              </div>
            </div>

            {/* Posts */}
            <PostFeed initialPosts={posts} initialHasMore={hasMore} />
          </div>

          {/* Right Sidebar */}
          <Sidebar />
        </div>
      </main>
    </div>
  )
}
