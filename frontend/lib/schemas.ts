// Contains the frontend interface schemas 

export interface User {
  id: number
  username: string
  displayName: string
  avatar: string
//   bio: string
//   joinDate: string
//   followers: number
//   following: number
//   totalPosts: number
//   totalLikes: number
//   totalViews: number
//   isFollowing?: boolean
}

export interface Post {
  id: number
  author: User
  title: string
  content: string
  createdAt: Date
//   likes: number
//   dislikes: number
//   comments: number
//   isLiked?: boolean
//   isDisliked?: boolean
}

export interface Comment {
  id: string
  author: User
  content: string
  createdAt: string
  upvotes: number
  downvotes: number
  replies?: Comment[]
  isUpvoted?: boolean
  isDownvoted?: boolean
}