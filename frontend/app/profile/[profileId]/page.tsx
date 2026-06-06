'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  Calendar, 
  FileText, 
  ArrowLeft,
  Settings,
  Loader2,
  User,
  Camera
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
  uploadAvatar,
  UserPublicApiResponse, 
  PostApiResponse 
} from '@/lib/api'
import { toast } from 'sonner'
import { EmptyState } from '@/components/orbit/empty-state'
import { mapPost, mapUser } from '@/lib/utils'
import { User as UserSchema } from '@/lib/schemas'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function PublicProfilePage() {
  const params = useParams()
  const idOrUsername = params.profileId as string
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [user, setUser] = useState<UserSchema | null>(null)
  const [currentUser, setCurrentUser] = useState<UserSchema | null>(null)
  const [userPosts, setUserPosts] = useState<PostApiResponse[]>([])
  const [totalPosts, setTotalPosts] = useState(0)
  const [skip, setSkip] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
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
        
        setUser(mapUser(profileUser))
        setCurrentUser(loggedInUser ? mapUser(loggedInUser) : null)
        
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
  
  const handleAvatarClick = () => {
    if (isOwnProfile && !isUploadingAvatar) {
      fileInputRef.current?.click()
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    // Basic validation
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB")
      return
    }

    setIsUploadingAvatar(true)
    try {
      const updatedUser = await uploadAvatar(user.id, file)
      const mappedUpdatedUser = mapUser(updatedUser)
      
      // Add a timestamp to force browser to re-fetch the new image
      const cacheBustedPath = `${mappedUpdatedUser.avatar}?v=${Date.now()}`
      
      const timestampedUser = {
        ...mappedUpdatedUser,
        avatar: cacheBustedPath
      }
      
      setUser(timestampedUser)
      
      // Also update currentUser to reflect changes in Navbar immediately
      if (currentUser && currentUser.id === user.id) {
        setCurrentUser(timestampedUser)
      }
      
      toast.success("Profile picture updated successfully")
    } catch (err: any) {
      console.error("Error uploading avatar:", err)
      toast.error(err.message || "Failed to upload avatar")
    } finally {
      setIsUploadingAvatar(false)
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

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
        <div className="h-16" />
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
        <Navbar isAuthenticated={!!currentUser} user={currentUser || undefined} />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="glass rounded-xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8" />
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
        user={currentUser || undefined}
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
            <div className="flex-shrink-0 relative group">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
              <div 
                className={`relative rounded-full ${isOwnProfile ? 'cursor-pointer' : ''}`}
                onClick={handleAvatarClick}
              >
                {/* We use avatar as a key to force re-render the entire Avatar when it changes */}
                <Avatar key={user.avatar} className="w-28 h-28 md:w-36 md:h-36 ring-4 ring-primary/30 overflow-hidden">
                  <AvatarImage 
                    src={user.avatar} 
                    alt={user.displayName} 
                  />
                  <AvatarFallback className="text-4xl">{user.displayName?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                
                {isOwnProfile && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    {isUploadingAvatar ? (
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    ) : (
                      <Camera className="w-8 h-8 text-white" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    {user.displayName}
                  </h1>
                  <p className="text-muted-foreground">@{user.username}</p>
                </div>

                {isOwnProfile && (
                  <Button variant="outline" asChild size="sm">
                    <Link href="/settings">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Link>
                  </Button>
                )}
              </div>

              {/* Bio */}
              <p className="text-foreground mb-4 leading-relaxed max-w-2xl">
                {user.bio}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {formatDate(user.date_joined)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2 pb-2 border-b border-border/50">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Posts</h2>
            <span className="text-muted-foreground font-normal ml-1">({totalPosts})</span>
          </div>

          <div className="space-y-4">
            {userPosts.length > 0 ? (
              <>
                {userPosts.map((post) => (
                  <PostCard 
                    key={post.id} 
                    post={mapPost(post)} 
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
              <EmptyState
                icon={<FileText className="w-12 h-12" />}
                title="No posts yet"
                description={isOwnProfile 
                  ? "You haven't created any posts yet. Start sharing your thoughts!" 
                  : `${user.displayName} hasn't posted anything yet.`}
                action={isOwnProfile && (
                  <Button asChild className="bg-primary hover:bg-primary/90">
                    <Link href="/create">Create Your First Post</Link>
                  </Button>
                )}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
