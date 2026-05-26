'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Bell, 
  Heart, 
  MessageCircle, 
  UserPlus, 
  AtSign,
  ArrowLeft,
  Check,
  CheckCheck,
  Trash2
} from 'lucide-react'
import { Navbar } from '@/components/orbit/navbar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { mockUsers, currentUser } from '@/lib/mock-data'

interface Notification {
  id: string
  type: 'like' | 'comment' | 'follow' | 'mention'
  user: typeof mockUsers[0]
  content: string
  postTitle?: string
  postId?: string
  createdAt: string
  isRead: boolean
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    user: mockUsers[0],
    content: 'liked your post',
    postTitle: 'The Future of AI: A Deep Dive into Neural Architecture',
    postId: '1',
    createdAt: '2024-12-15T10:30:00Z',
    isRead: false,
  },
  {
    id: '2',
    type: 'comment',
    user: mockUsers[1],
    content: 'commented on your post',
    postTitle: 'Why TypeScript Changed My Life as a Developer',
    postId: '2',
    createdAt: '2024-12-15T09:15:00Z',
    isRead: false,
  },
  {
    id: '3',
    type: 'follow',
    user: mockUsers[2],
    content: 'started following you',
    createdAt: '2024-12-14T18:45:00Z',
    isRead: false,
  },
  {
    id: '4',
    type: 'mention',
    user: mockUsers[3],
    content: 'mentioned you in a comment',
    postTitle: 'Quantum Computing: Separating Hype from Reality',
    postId: '4',
    createdAt: '2024-12-14T14:20:00Z',
    isRead: true,
  },
  {
    id: '5',
    type: 'like',
    user: mockUsers[4],
    content: 'liked your comment',
    postTitle: 'The Philosophy of Decentralization',
    postId: '5',
    createdAt: '2024-12-13T11:00:00Z',
    isRead: true,
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const filteredNotifications = notifications.filter(n => 
    filter === 'all' ? true : !n.isRead
  )

  const unreadCount = notifications.filter(n => !n.isRead).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-destructive" />
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-accent" />
      case 'follow':
        return <UserPlus className="w-4 h-4 text-success" />
      case 'mention':
        return <AtSign className="w-4 h-4 text-primary" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
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
      
      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </Link>

        {/* Header */}
        <div className="glass rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-muted-foreground">
                    You have {unreadCount} unread notification{unreadCount !== 1 && 's'}
                  </p>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                <CheckCheck className="w-4 h-4 mr-1" />
                Mark all as read
              </Button>
            )}
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilter('all')}
              className={cn(
                filter === 'all' ? "bg-primary/10 text-primary" : "text-muted-foreground"
              )}
            >
              All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilter('unread')}
              className={cn(
                filter === 'unread' ? "bg-primary/10 text-primary" : "text-muted-foreground"
              )}
            >
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-2">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={cn(
                  "glass rounded-xl p-4 transition-all hover:border-primary/30",
                  !notification.isRead && "bg-primary/5 border-primary/20"
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center flex-shrink-0">
                    {getIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link href={`/profile/${notification.user.username}`}>
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={notification.user.avatar} alt={notification.user.displayName} />
                          <AvatarFallback>{notification.user.displayName[0]}</AvatarFallback>
                        </Avatar>
                      </Link>
                      <p className="text-sm">
                        <Link 
                          href={`/profile/${notification.user.username}`}
                          className="font-semibold text-foreground hover:text-primary transition-colors"
                        >
                          {notification.user.displayName}
                        </Link>
                        {' '}
                        <span className="text-muted-foreground">{notification.content}</span>
                      </p>
                    </div>
                    
                    {notification.postTitle && notification.postId && (
                      <Link 
                        href={`/post/${notification.postId}`}
                        className="text-sm text-accent hover:underline line-clamp-1"
                      >
                        {notification.postTitle}
                      </Link>
                    )}
                    
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8"
                        onClick={() => markAsRead(notification.id)}
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteNotification(notification.id)}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="glass rounded-xl p-12 text-center">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {filter === 'unread' ? 'All caught up!' : 'No notifications yet'}
              </h3>
              <p className="text-muted-foreground">
                {filter === 'unread' 
                  ? 'You have no unread notifications.' 
                  : 'When someone interacts with your posts, you\'ll see it here.'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
