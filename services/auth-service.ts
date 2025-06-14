const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"


export async function getToken(username: string, password: string): Promise<string> {
    try {
        const formData = new URLSearchParams();
        formData.append("username", username ?? "");
        formData.append("password", password ?? "");
        const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData.toString(),
        });
        if (!response.ok) throw new Error('Error al iniciar sesión');
        let data = await response.json();
        return data?.access_token || null;
    } catch (error) {
        console.error("Error al iniciar sesión:", error)
        throw error
    }
}