'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { BarChart3, Hash, ExternalLink } from 'lucide-react'
import { getTotalUsers, getTotalPosts } from '@/lib/api'
import { cn } from '@/lib/utils'

function SidebarContent() {
  const [totalUsers, setTotalUsers] = useState<number>(0)
  const [totalPosts, setTotalPosts] = useState<number>(0)
  const searchParams = useSearchParams()

  useEffect(() => {
    getTotalUsers().then(setTotalUsers).catch(console.error)
    getTotalPosts().then(setTotalPosts).catch(console.error)
  }, [])

  const currentQuery = searchParams.get('q') || ''
  const currentTag = searchParams.get('tag') || ''

  const getTagHref = (tag: string) => {
    const params = new URLSearchParams()
    const isSelected = currentTag.toLowerCase() === tag.toLowerCase()

    // Toggle off if already selected
    if (!isSelected) {
      params.set('tag', tag)
    }
    if (currentQuery) {
      params.set('q', currentQuery)
    }

    const queryStr = params.toString()
    return `/explore${queryStr ? `?${queryStr}` : ''}`
  }

  return (
    <aside className="w-80 flex-shrink-0 hidden lg:block">
      <div className="sticky top-24 space-y-6">
        {/* Platform Stats - Horizontal Layout */}
        <div className="glass rounded-2xl p-6 border-primary/20 bg-primary/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center glow-success">
              <BarChart3 className="w-6 h-6 text-success" />
            </div>
            <h3 className="font-bold text-lg text-foreground">Community Pulse</h3>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-black text-foreground tracking-tight">
                  {formatNumber(totalUsers)}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Total Explorers</p>
              </div>
              <div className="text-center border-l border-border/20">
                <p className="text-2xl font-black text-foreground tracking-tight">
                  {formatNumber(totalPosts)}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Shared Ideas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Tags - Grid Layout */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center glow-primary">
              <Hash className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg text-foreground">Galaxy Tags</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {['AI', 'Tech', 'Science', 'Philosophy', 'Coding', 'Space', 'Future', 'Web3'].map((tag) => {
              const isSelected = currentTag.toLowerCase() === tag.toLowerCase()
              return (
                <Link
                  key={tag}
                  href={getTagHref(tag)}
                  className={cn(
                    "px-4 py-3 rounded-xl border text-sm font-medium transition-all text-center capitalize",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary glow-primary"
                      : "bg-secondary/30 border-border/50 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/50"
                  )}
                >
                  #{tag}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Footer Links - Horizontal Layout */}
        <div className="glass rounded-2xl p-6 border-border/20">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-muted-foreground">
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
          </div>
          <div className="mt-6 pt-4 border-t border-border/30 flex items-center justify-between">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              © 2026 ORBIT
            </p>
            <ExternalLink className="w-3 h-3 text-muted-foreground/50" />
          </div>
        </div>
      </div>
    </aside>
  )
}

export function Sidebar() {
  return (
    <Suspense fallback={<aside className="w-80 flex-shrink-0 hidden lg:block" />}>
      <SidebarContent />
    </Suspense>
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

