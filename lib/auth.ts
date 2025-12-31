"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");

    // Mock Authentication Logic
    if (email === "admin@cherif.com" && password === "admin123") {
        const cookieStore = await cookies();
        // Set a session cookie that expires in 24 hours
        cookieStore.set("session", "authenticated", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });

        redirect("/");
    } else {
        // Return error state (in a real app, you'd return this to the form)
        // For simplicity here, we'll redirect back with a query param
        redirect("/login?error=invalid_credentials");
    }
}

export async function logout() {
    const cookieStore = await cookies();
    // Force delete by setting immediate expiration
    cookieStore.set("session", "", { expires: new Date(0), path: "/" });
    redirect("/login");
}
