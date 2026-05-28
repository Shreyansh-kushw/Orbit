'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL
let currentUser: any = null;
let fetchPromise: any = null;

export async function getCurrentUser() {
    if (currentUser) {
        return currentUser;
    }

    // Return in-progress fetch to prevent duplicate API calls
    if (fetchPromise) {
        return fetchPromise;
    }

    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value
    if (!token) {
        return null;
    }
    fetchPromise = (async () => {
        try {
            const response = await fetch(`${API_URL}/api/users/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                currentUser = await response.json();
                return currentUser;
            }

            return null;
        } catch (error) {
            console.error("Error fetching current user:", error);
            return null;
        } finally {
            fetchPromise = null;
        }
    })();

    return fetchPromise;

}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete('access_token')
    currentUser = null
    redirect("/")
}