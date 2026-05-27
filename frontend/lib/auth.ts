const API_URL = process.env.NEXT_PUBLIC_API_URL


export async function getCurrentUser(){
    const response = await fetch(`${API_URL}/api/users/me`)

    if (response.ok){
        const result = await response.json()
        return result
    }
    else{
        return null
    }

}