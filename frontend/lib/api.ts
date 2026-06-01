// Handles response and requests from/to the backend api

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function getPosts() {
    const response = await fetch(`${API_URL}/api/posts`)

    if (!response.ok) {
        throw new Error("Failed to fetch posts")
    }

    return response.json()
}

export async function getPostsByID(post_id: string): Promise<PostApiResponse> {
    const response = await fetch(`${API_URL}/api/posts/${post_id}`)

    if (!response.ok) {
        throw new Error("Failed to fetch posts")
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

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.detail || "Something went wrong")

        }

        return response.json
    }
    catch (error: any) {
        console.log(error.message)
    }
}


export interface PostApiResponse {

    id: number
    user_id: number
    title: string
    content: string
    date_posted: string

    author: {
        id: number
        username: string
        name: string
        image_file: string | null
        image_path: string
    }
}

export interface UserPublicApiResponse {

    id: number
    username: string
    name: string
    image_file: string | null
    image_path: string

}