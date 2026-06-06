import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { User, Post } from './schemas'
import { PostApiResponse, UserPublicApiResponse } from './api'

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAvatarUrl(path: string | null | undefined): string {
  if (!path || path === '' || path === 'null') return '/placeholder-user.jpg'
  if (path.startsWith('http')) return path
  if (path.startsWith('/placeholder')) return path

  // For backend paths starting with /media
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${API_URL}${cleanPath}`
}

export function mapPost(post: PostApiResponse): Post {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    createdAt: new Date(post.date_posted),
    tags: post.tags ? post.tags.split(',') : [],
    author: {
      id: post.author.id,
      username: post.author.username,
      displayName: post.author.name,
      avatar: getAvatarUrl(post.author.image_path)
    }
  }
}

export function mapUser(user: UserPublicApiResponse): User {
  return {
    id: user.id,
    username: user.username,
    displayName: user.name,
    avatar: getAvatarUrl(user.image_path),
    bio: user.bio,
    date_joined: user.date_joined,
    email: user.email
  }
}
