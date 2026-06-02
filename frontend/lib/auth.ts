'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';
import { cache } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const getCurrentUser = cache(async () => {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value
    if (!token) {
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/api/users/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            // Ensure we don't cache the fetch globally at the Next.js level
            next: { revalidate: 0 } 
        });

        if (response.ok) {
            return await response.json();
        }

        return null;
    } catch (error) {
        console.error("Error fetching current user:", error);
        return null;
    }
});

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete('access_token')
    redirect("/")
}