// Contains the frontend interface schemas 

export interface User {
  id: number
  username: string
  displayName: string
  avatar: string
  bio?: string
  date_joined?: string
  email?: string
}

export interface Post {
  id: number
  title: string
  content: string
  author: User
  createdAt: Date
  tags?: string[]
}
