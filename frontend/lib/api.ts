// Handles response and requests from/to the backend api

import Cookies from 'js-cookie'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface UserPublicApiResponse {
    id: number
    username: string
    name: string
    image_file: string | null
    image_path: string
}

export interface PostApiResponse {
    id: number
    user_id: number
    title: string
    content: string
    date_posted: string
    tags: string | null
    author: UserPublicApiResponse
}

export async function getMe(): Promise<UserPublicApiResponse | null> {
    const token = Cookies.get('access_token')
    if (!token) return null

    try {
        const response = await fetch(`${API_URL}/api/users/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) return null
        return response.json()
    } catch (error) {
        console.error("Error fetching current user:", error)
        return null
    }
}

export async function getPosts(): Promise<PostApiResponse[]> {
    const response = await fetch(`${API_URL}/api/posts`)

    if (!response.ok) {
        throw new Error("Failed to fetch posts")
    }

    return response.json()
}

export async function getPostsByID(post_id: string): Promise<PostApiResponse> {
    const response = await fetch(`${API_URL}/api/posts/${post_id}`)

    if (!response.ok) {
        throw new Error("Failed to fetch post")
    }

    return response.json()
}

export async function getUserById(id: string | number): Promise<UserPublicApiResponse> {
    const response = await fetch(`${API_URL}/api/users/${id}`)

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("User not found")
        }
        throw new Error("Failed to fetch user profile")
    }

    return response.json()
}

export async function getUserByUsername(username: string): Promise<UserPublicApiResponse> {
    // Search all posts to find the user ID if they've posted anything
    try {
        const posts = await getPosts()
        const postWithUser = posts.find(p => p.author.username.toLowerCase() === username.toLowerCase())
        
        if (postWithUser) {
            return postWithUser.author
        }
    } catch (e) {
        console.error("Search by username failed:", e)
    }

    throw new Error("User not found")
}

export async function getUserPosts(userId: number): Promise<PostApiResponse[]> {
    const response = await fetch(`${API_URL}/api/users/${userId}/posts`)

    if (!response.ok) {
        throw new Error("Failed to fetch user posts")
    }

    return response.json()
}

export async function deletePost(post_id: string, token: string | undefined) {
    try {
        const response = await fetch(`${API_URL}/api/posts/${post_id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            const result = await response.json()
            throw new Error(result.detail || "Something went wrong")
        }

        return true
    }
    catch (error: any) {
        console.error(error.message)
        throw error
    }
}