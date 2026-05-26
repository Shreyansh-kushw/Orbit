'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  Calendar, 
  Users, 
  FileText, 
  Heart, 
  Eye,
  UserPlus,
  ArrowLeft,
  Settings,
  MoreHorizontal
} from 'lucide-react'
import { Navbar } from '@/components/orbit/navbar'
import { PostCard } from '@/components/orbit/post-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { mockUsers, mockPosts, currentUser } from '@/lib/mock-data'

export default function PublicProfilePage() {
  const params = useParams()
  const username = params.username as string
  
  // Find the user (use mock data)
  const user = mockUsers.find(u => u.username === username) || mockUsers[0]
  const isOwnProfile = user.username === currentUser.username
  
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false)
  const [followers, setFollowers] = useState(user.followers)

  // Get posts by this user
  const userPosts = mockPosts.filter(p => p.author.id === user.id)

  const handleFollow = () => {
    if (isFollowing) {
      setIsFollowing(false)
      setFollowers(followers - 1)
    } else {
      setIsFollowing(true)
      setFollowers(followers + 1)
    }
  }

  const formatDate = (dateString: string) => {
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
                <AvatarImage src={user.avatar} alt={user.displayName} />
                <AvatarFallback className="text-4xl">{user.displayName[0]}</AvatarFallback>
              </Avatar>
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

                <div className="flex items-center gap-2">
                  {isOwnProfile ? (
                    <Button variant="outline" asChild>
                      <Link href="/settings">
                        <Settings className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={handleFollow}
                        className={cn(
                          "transition-all",
                          isFollowing 
                            ? "bg-primary/10 text-primary border border-primary/50 hover:bg-primary/20" 
                            : "bg-primary hover:bg-primary/90 glow-primary"
                        )}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        {isFollowing ? 'Following' : 'Follow'}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass">
                          <DropdownMenuItem>Share Profile</DropdownMenuItem>
                          <DropdownMenuItem>Block User</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Report User</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  )}
                </div>
              </div>

              {/* Bio */}
              <p className="text-foreground mb-4 leading-relaxed">
                {user.bio}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {formatDate(user.joinDate)}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span className="text-foreground font-medium">{formatNumber(followers)}</span> followers
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span className="text-foreground font-medium">{formatNumber(user.following)}</span> following
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border/50">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-xl font-bold text-foreground">{formatNumber(user.totalPosts)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Posts</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Heart className="w-4 h-4 text-destructive" />
                <span className="text-xl font-bold text-foreground">{formatNumber(user.totalLikes)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Likes Received</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Eye className="w-4 h-4 text-accent" />
                <span className="text-xl font-bold text-foreground">{formatNumber(user.totalViews)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Total Views</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Users className="w-4 h-4 text-success" />
                <span className="text-xl font-bold text-foreground">{formatNumber(followers)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Followers</p>
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
              userPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <div className="glass rounded-xl p-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No posts yet</h3>
                <p className="text-muted-foreground">
                  {isOwnProfile 
                    ? "You haven't created any posts yet. Start sharing your thoughts!" 
                    : `${user.displayName} hasn't posted anything yet.`}
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
                Posts that {isOwnProfile ? "you've" : `${user.displayName} has`} liked will appear here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
