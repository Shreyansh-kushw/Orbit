import { Navbar } from '@/components/orbit/navbar'
import { Sidebar } from '@/components/orbit/sidebar'
import { PostCard } from '@/components/orbit/post-card'
import { getPosts } from '@/lib/api'
import { User, Post } from '@/lib/schemas'
import { mapPost } from '@/lib/utils'
import { PostApiResponse } from '@/lib/api'

const currentUser: User = { // TEMPORARY
  id: 1,
  username: 'orbituser',
  displayName: 'Orbit User',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=orbituser',
}

export default async function HomePage() {
  
  const rawPosts: PostApiResponse[] = await getPosts();
  const posts = rawPosts.map(mapPost)
  
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
            {posts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Right Sidebar */}
          <Sidebar />
        </div>
      </main>
    </div>
  )
}
