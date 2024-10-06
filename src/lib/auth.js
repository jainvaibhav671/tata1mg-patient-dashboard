import axios from "axios";
import { z } from "zod"

const registerSchema = z.object({
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

const loginSchema = z.object({
    email: z.string({ required_error: "Email is required" }).email("Invalid email"),
    password: z
        .string({ required_error: "Password is required" })
        .min(8, "Password must be at least 8 characters")
        .regex(/(?=.*?[#?!@$%^&*-])/, "Password must contain a special character")
        .regex(/(?=.*?[0-9])/, "Password must contain a number")
})

export async function login(values) {
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

    const { error, success } = registerSchema.safeParse(values)

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

const updateUserSchema = z.object({
    blood_type: z.string({ required_error: "Blood type is required" }),
    date_of_birth: z.string({ required_error: "Date of birth is required" }).date(),
    height: z
        .string({ required_error: "Height is required" })
        .transform((val) => parseFloat(val)) // Convert to number
        .refine((val) => !isNaN(val), "Height must be a valid number") // Ensure it's a valid number
        .pipe(z.number().min(30, "Height must be at least 30 cm").max(250, "Height must be at most 250 cm")), // Chain min and max after converting
    weight: z
        .string({ required_error: "Weight is required" })
        .transform((val) => parseFloat(val)) // Convert to number
        .refine((val) => !isNaN(val), "Weight must be a valid number") // Ensure it's a valid number
        .pipe(z.number().min(0.5, "Weight must be at least 0.5 kg").max(200, "Weight must be at most 200 kg")), // Chain min and max after converting
});

export async function updateUserDetails(formData) {

    let values = Object.fromEntries(formData.entries())

    const { error, success } = updateUserSchema.safeParse(values)
    if (!success) {
        return {
            success: false,
            errors: error?.formErrors.fieldErrors
        }
    }

    const res = await axios.post("/api/storage/upload", formData)

    values.avatar_img = res.data.file_name
    const { message, error: errorMessage } = await axios.post("/api/auth/update-profile", values)
        .then(res => res.data)
        .catch(err => ({ error: err.message }))

    // upload the file to supabase storage

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

export async function getUserDetails() {
    const { data } = await axios.get("/api/auth/user")
    return data.user
}

export async function getIsAuthenticated() {
    const { data } = await axios.get("/api/auth/authenticated")
    return data.authorized
}
