import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { User, Post } from './schemas'
import { PostApiResponse, UserPublicApiResponse } from './api'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function mapPost(post: PostApiResponse): Post {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    createdAt: new Date(post.date_posted),
    author: {
      id: post.author.id,
      username: post.author.username,
      displayName: post.author.name,
      avatar: post.author.image_path
    }
  }
}

export function mapUser(user: UserPublicApiResponse): User {
  return {

    id: user.id,
    username: user.username,
    displayName: user.name,
    avatar: user.image_path

  }
}
