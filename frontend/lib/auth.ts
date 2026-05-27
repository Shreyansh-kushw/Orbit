'use client'

import Cookies from 'js-cookie';

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

    const token: string | undefined = Cookies.get('access_token');
    if (!token) {
        return null;
    }

    fetchPromise = (async () => {
        try {
            const response = await fetch("/api/users/me", {
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