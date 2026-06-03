'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  Calendar, 
  Users,
  FileText, 
  Heart, 
  ArrowLeft,
  Settings,
  Loader2
} from 'lucide-react'
import { Navbar } from '@/components/orbit/navbar'
import { PostCard } from '@/components/orbit/post-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  getUserById,
  getUserByUsername,
  getUserPosts, 
  getMe, 
  UserPublicApiResponse, 
  PostApiResponse 
} from '@/lib/api'

export default function PublicProfilePage() {
  const params = useParams()
  const idOrUsername = params.profileId as string
  
  const [user, setUser] = useState<UserPublicApiResponse | null>(null)
  const [currentUser, setCurrentUser] = useState<UserPublicApiResponse | null>(null)
  const [userPosts, setUserPosts] = useState<PostApiResponse[]>([])
  const [totalPosts, setTotalPosts] = useState(0)
  const [skip, setSkip] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const limit = 10

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      setError(null)
      try {
        const decodedParam = decodeURIComponent(idOrUsername)
        const isUsername = decodedParam.startsWith('@')
        
        const [profileUser, loggedInUser] = await Promise.all([
          isUsername
            ? getUserByUsername(decodedParam.substring(1))
            : getUserById(decodedParam),
          getMe()
        ])
        
        setUser(profileUser)
        setCurrentUser(loggedInUser)
        
        const response = await getUserPosts(profileUser.id, 0, limit)
        setUserPosts(response.posts)
        setTotalPosts(response.total)
        setHasMore(response.has_more)
        setSkip(0)
        
      } catch (err: any) {
        console.error("Error fetching profile data:", err)
        setError(err.message || "Failed to load profile")
      } finally {
        setIsLoading(false)
      }
    }

    if (idOrUsername) {
      fetchData()
    }
  }, [idOrUsername])

  const handleLoadMore = async () => {
    if (!user || !hasMore || isLoadingMore) return

    setIsLoadingMore(true)
    try {
      const nextSkip = skip + limit
      const response = await getUserPosts(user.id, nextSkip, limit)
      
      setUserPosts(prev => [...prev, ...response.posts])
      setHasMore(response.has_more)
      setSkip(nextSkip)
    } catch (err) {
      console.error("Error loading more posts:", err)
    } finally {
      setIsLoadingMore(false)
    }
  }

  const isOwnProfile = user && currentUser && user.id === currentUser.id
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently"
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    })
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar isAuthenticated={!!currentUser} user={currentUser ? {
          id: currentUser.id,
          username: currentUser.username,
          displayName: currentUser.name,
          avatar: currentUser.image_path,
        } : undefined} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar isAuthenticated={!!currentUser} user={currentUser ? {
          id: currentUser.id,
          username: currentUser.username,
          displayName: currentUser.name,
          avatar: currentUser.image_path,
        } : undefined} />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="glass rounded-xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">User Not Found</h2>
            <p className="text-muted-foreground mb-6">
              {error || "The user you are looking for doesn't exist or has been removed."}
            </p>
            <Button asChild className="w-full">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        isAuthenticated={!!currentUser} 
        user={currentUser ? {
          id: currentUser.id,
          username: currentUser.username,
          displayName: currentUser.name,
          avatar: currentUser.image_path,
        } : undefined}
      />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </Link>

        {/* Profile Header */}
        <div className="glass rounded-xl p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <Avatar className="w-28 h-28 md:w-36 md:h-36 ring-4 ring-primary/30">
                <AvatarImage src={user.image_path} alt={user.name} />
                <AvatarFallback className="text-4xl">{user.name[0]}</AvatarFallback>
              </Avatar>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    {user.name}
                  </h1>
                  <p className="text-muted-foreground">@{user.username}</p>
                </div>

                {isOwnProfile && (
                  <Button variant="outline" asChild>
                    <Link href="/settings">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Link>
                  </Button>
                )}
              </div>

              {/* Bio */}
              <p className="text-foreground mb-4 leading-relaxed">
                I'm a passionate creator on Orbit. Sharing my thoughts and experiences with the world.
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {formatDate()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Posts */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full glass mb-4">
            <TabsTrigger value="posts" className="flex-1">Posts</TabsTrigger>
            <TabsTrigger value="liked" className="flex-1">Liked</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            {userPosts.length > 0 ? (
              <>
                {userPosts.map((post) => (
                  <PostCard 
                    key={post.id} 
                    post={{
                      id: post.id,
                      title: post.title,
                      content: post.content,
                      author: {
                        id: post.author.id,
                        username: post.author.username,
                        displayName: post.author.name,
                        avatar: post.author.image_path,
                      },
                      createdAt: new Date(post.date_posted),
                      tags: post.tags ? post.tags.split(',') : []
                    }} 
                  />
                ))}

                {hasMore && (
                  <div className="flex justify-center pt-4">
                    <Button 
                      variant="outline" 
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      className="glass hover:bg-primary/10"
                    >
                      {isLoadingMore ? (
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
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No posts yet</h3>
                <p className="text-muted-foreground">
                  {isOwnProfile 
                    ? "You haven't created any posts yet. Start sharing your thoughts!" 
                    : `${user.name} hasn't posted anything yet.`}
                </p>
                {isOwnProfile && (
                  <Button asChild className="mt-4 bg-primary hover:bg-primary/90">
                    <Link href="/create">Create Your First Post</Link>
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="liked" className="space-y-4">
            <div className="glass rounded-xl p-12 text-center">
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Liked posts</h3>
              <p className="text-muted-foreground">
                Posts that {isOwnProfile ? "you've" : `${user.name} has`} liked will appear here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
