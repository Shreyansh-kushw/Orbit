'use client'

import Link from 'next/link'
import { TrendingUp, Users, BarChart3, Hash, ExternalLink } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { trendingTopics, platformStats, mockUsers } from '@/lib/mock-data'

export function Sidebar() {
  const suggestedUsers = mockUsers.slice(0, 3)

  return (
    <aside className="w-80 flex-shrink-0 hidden lg:block">
      <div className="sticky top-20 space-y-4">
        {/* Trending Topics */}
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Trending Topics</h3>
          </div>
          <div className="space-y-3">
            {trendingTopics.map((topic, index) => (
              <Link
                key={topic.tag}
                href={`/explore?tag=${topic.tag}`}
                className="flex items-center justify-between group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">{index + 1}</span>
                  <Hash className="w-4 h-4 text-accent" />
                  <span className="text-foreground group-hover:text-primary transition-colors">
                    {topic.tag}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatNumber(topic.posts)} posts
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Suggested Users */}
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-foreground">Who to Follow</h3>
          </div>
          <div className="space-y-4">
            {suggestedUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <Link
                  href={`/profile/${user.username}`}
                  className="flex items-center gap-3 group"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatar} alt={user.displayName} />
                    <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {user.displayName}
                    </p>
                    <p className="text-xs text-muted-foreground">@{user.username}</p>
                  </div>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Follow
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Stats */}
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-success" />
            <h3 className="font-semibold text-foreground">Platform Stats</h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-foreground">
                {formatNumber(platformStats.totalUsers)}
              </p>
              <p className="text-xs text-muted-foreground">Users</p>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">
                {formatNumber(platformStats.totalPosts)}
              </p>
              <p className="text-xs text-muted-foreground">Posts</p>
            </div>
            <div>
              <p className="text-lg font-bold text-accent">
                {formatNumber(platformStats.activeNow)}
              </p>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
        </div>

        {/* Popular Tags */}
        <div className="glass rounded-xl p-4">
          <h3 className="font-semibold text-foreground mb-3">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {['AI', 'Tech', 'Science', 'Philosophy', 'Coding', 'Space', 'Future', 'Web3'].map((tag) => (
              <Link
                key={tag}
                href={`/explore?tag=${tag}`}
                className="px-3 py-1 rounded-full bg-secondary/80 text-sm text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Links */}
        <div className="px-4 py-2">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/help" className="hover:text-foreground transition-colors">Help</Link>
            <a href="https://twitter.com" className="hover:text-foreground transition-colors flex items-center gap-1">
              Twitter <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            © 2024 ORBIT. All rights reserved.
          </p>
        </div>
      </div>
    </aside>
  )
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}
