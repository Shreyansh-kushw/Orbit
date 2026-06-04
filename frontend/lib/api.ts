// Handles response and requests from/to the backend api

import Cookies from 'js-cookie'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface UserPublicApiResponse {
    id: number
    username: string
    name: string
    date_joined: string
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

export interface PaginatedApiResponse<T> {
    posts: T[]
    total: number
    skip: number
    limit: number
    has_more: boolean
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

export async function getPosts(skip = 0, limit = 20): Promise<PaginatedApiResponse<PostApiResponse>> {
    const response = await fetch(`${API_URL}/api/posts?skip=${skip}&limit=${limit}`)

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
    const response = await fetch(`${API_URL}/api/users/u/${encodeURIComponent(username)}`)

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("User not found")
        }
        throw new Error("Failed to fetch user profile")
    }

    return response.json()
}

export async function getTotalUsers(): Promise<number> {
    const response = await fetch(`${API_URL}/api/users/total`)

    if (!response.ok) {
        throw new Error("Failed to fetch total users")
    }

    return response.json()
}

export async function getTotalPosts(): Promise<number> {
    const response = await fetch(`${API_URL}/api/posts/total`)

    if (!response.ok) {
        throw new Error("Failed to fetch total posts")
    }

    return response.json()
}

export async function getUserPosts(userId: number, skip = 0, limit = 20): Promise<PaginatedApiResponse<PostApiResponse>> {
    const response = await fetch(`${API_URL}/api/users/${userId}/posts?skip=${skip}&limit=${limit}`)

    if (!response.ok) {
        throw new Error("Failed to fetch user posts")
    }

    return response.json()
}

export async function uploadAvatar(userId: number, file: File): Promise<UserPublicApiResponse> {
    const token = Cookies.get('access_token')
    if (!token) throw new Error("Not authenticated")

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_URL}/api/users/${userId}/avatar`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to upload avatar")
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