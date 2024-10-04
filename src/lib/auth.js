import axios from "axios";
import { z } from "zod"

const schema = z.object({
    name: z.string({ required_error: "Name is required" }),
    email: z.string({ required_error: "Email is required" }).email("Invalid email"),
    password: z
        .string({ required_error: "Password is required" })
        .min(8, "Password must be at least 8 characters")
        .regex(/(?=.*?[#?!@$%^&*-])/, "Password must contain a special character")
        .regex(/(?=.*?[0-9])/, "Password must contain a number"),
    confirmPassword: z.string({ required_error: "Confirm password is required" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export async function login(values) {
    const loginSchema = schema.pick({ email: true, password: true })
    const { error, success } = loginSchema.safeParse(values)

    if (!success) {
        return {
            success: false,
            errors: error?.formErrors.fieldErrors
        }
    }

    const { message, error: errorMessage } = await axios.post("/api/auth/login", values).then(res => res.data)
    if (typeof errorMessage !== "undefined") {
        return {
            success: false,
            errors: { formError: errorMessage }
        }
    }
    return { success: true, message }
}

export async function register(values) {

    const { error, success } = schema.safeParse(values)

    if (!success) {
        return {
            success: false,
            errors: error?.formErrors.fieldErrors
        }
    }

    const { message, error: errorMessage } = await axios.post("/api/auth/register", values).then(res => res.data)
    if (typeof errorMessage !== "undefined") {
        return {
            success: false,
            errors: { formError: errorMessage }
        }
    }
    return { success: true, message }
}

export async function logout() {
    const { data } = await axios.get("/api/auth/logout")
    return data.message
}

export async function getIsAuthenticated() {
    const { data } = await axios.get("/api/auth/authenticated")
    return data.authorized
}
