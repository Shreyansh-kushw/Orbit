'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Calendar, 
  FileText, 
  ArrowLeft,
  Trash2,
  Save,
  AlertTriangle,
  Mail,
  User,
  Loader2,
  Camera
} from 'lucide-react'
import { Navbar } from '@/components/orbit/navbar'
import { PostCard } from '@/components/orbit/post-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { 
  getPrivateMe, 
  getUserPosts, 
  updateUser, 
  deleteUser,
  uploadAvatar,
  UserPublicApiResponse,
  PostApiResponse
} from '@/lib/api'
import { toast } from 'sonner'
import { logout } from '@/lib/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function SettingsPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [user, setUser] = useState<(UserPublicApiResponse & { email: string }) | null>(null)
  const [userPosts, setUserPosts] = useState<PostApiResponse[]>([])
  const [totalPosts, setTotalPosts] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    email: '',
    bio: '',
  })

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const userData = await getPrivateMe()
        if (!userData) {
          router.push('/auth?mode=login')
          return
        }
        
        setUser(userData as any)
        setProfileData({
          name: userData.name,
          username: userData.username,
          email: userData.email,
          bio: (userData as any).bio || '',
        })

        const postsResponse = await getUserPosts(userData.id, 0, 100)
        setUserPosts(postsResponse.posts)
        setTotalPosts(postsResponse.total)
      } catch (err) {
        console.error("Error fetching settings data:", err)
        toast.error("Failed to load settings")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [router])

  const handleSaveProfile = async () => {
    if (!user) return
    setIsSaving(true)
    try {
      const updated = await updateUser(user.id, {
        name: profileData.name,
        username: profileData.username,
        email: profileData.email,
        bio: profileData.bio,
      })
      setUser({ ...user, ...updated })
      toast.success("Profile updated successfully")
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarClick = () => {
    if (!isUploadingAvatar) {
      fileInputRef.current?.click()
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file")
      return
    }

    setIsUploadingAvatar(true)
    try {
      const updatedUser = await uploadAvatar(user.id, file)

      // Ensure image_path exists before trying to manipulate it
      const rawPath = updatedUser.image_path || user.image_path || ''

      // Add a timestamp to the image path to force browser to re-fetch the new image
      const fullPath = rawPath.includes('?') 
        ? `${rawPath}&t=${Date.now()}`
        : `${rawPath}?t=${Date.now()}`

      setUser({ 
        ...user, 
        ...updatedUser,
        image_path: fullPath
      })
      toast.success("Profile picture updated successfully")
    } catch (err: any) {
      console.error("Error uploading avatar:", err)
      toast.error(err.message || "Failed to upload avatar")
    } finally {
      setIsUploadingAvatar(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDeleteAccount = async () => {
    if (!user) return
    setIsDeleting(true)
    try {
      await deleteUser(user.id)
      await logout()
      toast.success("Account deleted successfully")
    } catch (err: any) {
      toast.error(err.message || "Failed to delete account")
      setIsDeleting(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently"
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar isAuthenticated={true} />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        isAuthenticated={true} 
        user={{
          id: user.id,
          username: user.username,
          displayName: user.name,
          avatar: user.image_path,
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
                <div className="relative group mx-auto w-24 h-24 mb-4">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*"
                  />
                  <div 
                    className="relative rounded-full cursor-pointer"
                    onClick={handleAvatarClick}
                  >
                    <Avatar key={user.image_path} className="w-24 h-24 mx-auto ring-4 ring-primary/30 overflow-hidden">
                      <AvatarImage src={user.image_path?.startsWith('http') ? user.image_path : `${API_URL}${user.image_path || ''}`} alt={user.name} />
                      <AvatarFallback className="text-3xl">{user.name[0]}</AvatarFallback>
                    </Avatar>
                    
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                      {isUploadingAvatar ? (
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                      ) : (
                        <Camera className="w-6 h-6 text-white" />
                      )}
                    </div>
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-foreground mt-4">{user.name}</h2>
                <p className="text-muted-foreground mb-1">@{user.username}</p>
                <p className="text-sm text-muted-foreground mb-3 px-4 italic line-clamp-2">
                  &quot;{user.bio}&quot;
                </p>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {formatDate(user.date_joined)}
                </p>
              </div>
            </div>

            {/* Total Posts */}
            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Total Posts
                </span>
                <span className="font-semibold text-foreground text-lg">{totalPosts}</span>
              </div>
            </div>
          </div>

          {/* Right Column - Settings Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="w-full glass mb-6 flex-wrap h-auto gap-1 p-1">
                <TabsTrigger value="posts" className="flex-1">My Posts</TabsTrigger>
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
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="bg-secondary/30 border-border/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={profileData.username}
                          onChange={(e) => setProfileData({ 
                            ...profileData, 
                            username: e.target.value.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 30) 
                          })}
                          maxLength={30}
                          className="bg-secondary/30 border-border/50"
                        />
                        <p className="text-[10px] text-muted-foreground text-right">{profileData.username.length}/30</p>
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
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value.slice(0, 300) })}
                        maxLength={300}
                        className="bg-secondary/30 border-border/50 min-h-[100px]"
                        placeholder="Tell us about yourself..."
                      />
                      <p className="text-[10px] text-muted-foreground text-right">{profileData.bio.length}/300</p>
                    </div>
                    <Button onClick={handleSaveProfile} disabled={isSaving} className="bg-primary hover:bg-primary/90">
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
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
                      <Button variant="destructive" disabled={isDeleting}>
                        {isDeleting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Account
                          </>
                        )}
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
                        <AlertDialogAction 
                          onClick={handleDeleteAccount}
                          className="bg-destructive hover:bg-destructive/90 text-white border-none"
                        >
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
