'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Home,
  Compass,
  Bell,
  PenSquare,
  Search,
  LogOut,
  Menu,
  X,
  User,
  Settings,
  ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { logout } from '@/lib/auth'

interface NavbarProps {
  isAuthenticated?: boolean
  user?: {
    username: string
    displayName: string
    avatar: string
  }
}

export function Navbar({ isAuthenticated = true, user }: NavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const defaultUser = {
    username: 'orbituser',
    displayName: 'Orbit User',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=orbituser',
  }

  const currentUser = user || defaultUser

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center glow-primary transition-all duration-300 group-hover:scale-105">
              <img
                src="/logo-navbar.png"
                alt="O"
              />
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:block">ORBIT</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/" icon={<Home className="w-4 h-4" />} label="Home" />
            <NavLink href="/explore" icon={<Compass className="w-4 h-4" />} label="Explore" />
            {isAuthenticated && (
              <>
                <NavLink href="/notifications" icon={<Bell className="w-4 h-4" />} label="Notifications" badge={3} />
                <NavLink href="/create" icon={<PenSquare className="w-4 h-4" />} label="Create" />
              </>
            )}
          </div>

          {/* Search & Auth */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className={cn(
              "relative transition-all duration-300",
              isSearchOpen ? "w-64" : "w-10"
            )}>
              {isSearchOpen ? (
                <div className="flex items-center">
                  <Input
                    type="search"
                    placeholder="Search ORBIT..."
                    className="pr-10 bg-secondary/50 border-border/50 focus:border-primary/50"
                    autoFocus
                    onBlur={() => setIsSearchOpen(false)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                  className="hover:bg-secondary/80"
                >
                  <Search className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Auth Buttons / Profile */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-0 py-5 hover:bg-secondary/80" style={{ cursor: 'pointer' }}>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={currentUser.avatar} alt={currentUser.displayName} />
                      <AvatarFallback>{currentUser.displayName[0]}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block text-sm">{currentUser.displayName}</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass">
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${currentUser.username}`} className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" asChild>
                    <button onClick={async () => { await logout() }} className="w-full" style={{ cursor: 'pointer' }}>
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild className="hidden sm:flex">
                  <Link href="/auth?mode=login">Login</Link>
                </Button>
                <Button asChild className="bg-primary hover:bg-primary/90 glow-primary">
                  <Link href="/auth?mode=signup">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <div className="flex flex-col gap-2">
              <MobileNavLink href="/" icon={<Home className="w-4 h-4" />} label="Home" onClick={() => setIsMobileMenuOpen(false)} />
              <MobileNavLink href="/explore" icon={<Compass className="w-4 h-4" />} label="Explore" onClick={() => setIsMobileMenuOpen(false)} />
              {isAuthenticated && (
                <>
                  <MobileNavLink href="/notifications" icon={<Bell className="w-4 h-4" />} label="Notifications" onClick={() => setIsMobileMenuOpen(false)} />
                  <MobileNavLink href="/create" icon={<PenSquare className="w-4 h-4" />} label="Create Post" onClick={() => setIsMobileMenuOpen(false)} />
                </>
              )}
              {!isAuthenticated && (
                <MobileNavLink href="/auth?mode=login" icon={<User className="w-4 h-4" />} label="Login" onClick={() => setIsMobileMenuOpen(false)} />
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

function NavLink({
  href,
  icon,
  label,
  badge
}: {
  href: string
  icon: React.ReactNode
  label: string
  badge?: number
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors relative"
    >
      {icon}
      <span className="text-sm">{label}</span>
      {badge && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
          {badge}
        </span>
      )}
    </Link>
  )
}

function MobileNavLink({
  href,
  icon,
  label,
  onClick
}: {
  href: string
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}
