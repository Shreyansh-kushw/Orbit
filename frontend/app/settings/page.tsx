'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Calendar, 
  Users, 
  FileText, 
  Heart, 
  Eye,
  TrendingUp,
  ArrowLeft,
  Lock,
  Bell,
  Shield,
  Trash2,
  Save,
  AlertTriangle,
  Mail,
  User
} from 'lucide-react'
import { Navbar } from '@/components/orbit/navbar'
import { PostCard } from '@/components/orbit/post-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { mockPosts, currentUser } from '@/lib/mock-data'

export default function SettingsPage() {
  const [profileData, setProfileData] = useState({
    displayName: currentUser.displayName,
    username: currentUser.username,
    email: 'orbituser@example.com',
    bio: currentUser.bio,
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    newFollowers: true,
    postLikes: true,
    comments: true,
    mentions: true,
  })

  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    showEmail: false,
    showStats: true,
  })

  const [isSaving, setIsSaving] = useState(false)

  // Get user's posts and drafts
  const userPosts = mockPosts.filter(p => p.author.username === currentUser.username)
  const savedPosts = mockPosts.slice(0, 2) // Mock saved posts

  const handleSaveProfile = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    })
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
      
      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="glass rounded-xl p-6">
              <div className="text-center">
                <Avatar className="w-24 h-24 mx-auto ring-4 ring-primary/30">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.displayName} />
                  <AvatarFallback className="text-3xl">{currentUser.displayName[0]}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold text-foreground mt-4">{currentUser.displayName}</h2>
                <p className="text-muted-foreground">@{currentUser.username}</p>
                <p className="text-sm text-muted-foreground mt-2 flex items-center justify-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {formatDate(currentUser.joinDate)}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border/50">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{formatNumber(currentUser.followers)}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{formatNumber(currentUser.following)}</p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
              </div>
            </div>

            {/* Engagement Stats */}
            <div className="glass rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Your Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Total Posts
                  </span>
                  <span className="font-semibold text-foreground">{currentUser.totalPosts}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Likes Received
                  </span>
                  <span className="font-semibold text-foreground">{formatNumber(currentUser.totalLikes)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Total Views
                  </span>
                  <span className="font-semibold text-foreground">{formatNumber(currentUser.totalViews)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Engagement Rate
                  </span>
                  <span className="font-semibold text-accent">
                    {((currentUser.totalLikes / currentUser.totalViews) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Settings Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="w-full glass mb-6 flex-wrap h-auto gap-1 p-1">
                <TabsTrigger value="posts" className="flex-1">My Posts</TabsTrigger>
                <TabsTrigger value="saved" className="flex-1">Saved</TabsTrigger>
                <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
              </TabsList>

              {/* My Posts Tab */}
              <TabsContent value="posts" className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Your Posts</h3>
                  <Button asChild className="bg-primary hover:bg-primary/90">
                    <Link href="/create">Create New Post</Link>
                  </Button>
                </div>
                {userPosts.length > 0 ? (
                  userPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))
                ) : (
                  <div className="glass rounded-xl p-12 text-center">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No posts yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start sharing your thoughts with the ORBIT community.
                    </p>
                    <Button asChild className="bg-primary hover:bg-primary/90">
                      <Link href="/create">Create Your First Post</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Saved Posts Tab */}
              <TabsContent value="saved" className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground mb-4">Saved Posts</h3>
                {savedPosts.length > 0 ? (
                  savedPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))
                ) : (
                  <div className="glass rounded-xl p-12 text-center">
                    <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No saved posts</h3>
                    <p className="text-muted-foreground">
                      Posts you save will appear here for easy access.
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                {/* Profile Settings */}
                <div className="glass rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                          id="displayName"
                          value={profileData.displayName}
                          onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                          className="bg-secondary/30 border-border/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={profileData.username}
                          onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                          className="bg-secondary/30 border-border/50"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="pl-10 bg-secondary/30 border-border/50"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        className="bg-secondary/30 border-border/50 min-h-[100px]"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    <Button onClick={handleSaveProfile} disabled={isSaving} className="bg-primary hover:bg-primary/90">
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>

                {/* Change Password */}
                <div className="glass rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Change Password
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="bg-secondary/30 border-border/50"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="bg-secondary/30 border-border/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="bg-secondary/30 border-border/50"
                        />
                      </div>
                    </div>
                    <Button variant="outline">Update Password</Button>
                  </div>
                </div>

                {/* Notifications */}
                <div className="glass rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Settings
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label htmlFor={key} className="text-foreground cursor-pointer">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Label>
                        <Switch
                          id={key}
                          checked={value}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, [key]: checked })}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Privacy */}
                <div className="glass rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Privacy Settings
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(privacy).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label htmlFor={key} className="text-foreground cursor-pointer">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Label>
                        <Switch
                          id={key}
                          checked={value}
                          onCheckedChange={(checked) => setPrivacy({ ...privacy, [key]: checked })}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="glass rounded-xl p-6 border-2 border-destructive/30">
                  <h3 className="text-lg font-semibold text-destructive mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Danger Zone
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="glass border-destructive/30">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-foreground">Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your account
                          and remove all your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
