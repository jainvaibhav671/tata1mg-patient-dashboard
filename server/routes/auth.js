import { getClient } from "@/lib/db"

const express = require("express")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const z = require("zod")

const router = express.Router()

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

router.get("/", (req, res) => {
    res.send({ message: "Auth router" })
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body

    const { error, success } = loginSchema.safeParse({ email, password })

    if (!success) {
        return res.send({
            success: false,
            errors: error?.formErrors.fieldErrors
        })
    }

    if (typeof email === "undefined" || typeof password === "undefined") {
        return res.send({
            success: false,
            errors: { formError: "Email and password are required" }
        })
    }

    const client = getClient()

    let { data: User, error: error1 } = await client
        .from('User')
        .select("*")
        .eq('email', email)


    if (error1) {
        console.log(error1)
        return res.send({
            success: false,
            errors: { formError: error1.message }
        })
    } else if (User.length === 0) {
        return res.send({
            success: false,
            errors: { formError: "User not registered" }
        })
    }

    const isSamePassword = await bcryptjs.compare(password, User[0].passwordHash)
    if (!isSamePassword) {
        return res.send({
            success: false,
            errors: { formError: "Incorrect password" }
        })
    }

    const token = jwt.sign({ id: User[0].id, name: User[0].name, email }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    })

    // Set the token in the cookie
    res.cookie('session', token, {
        expires: new Date(Date.now() + 3600000),
        path: '/',
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "none",
    });

    res.status(200).send({ success: true, message: "Logged in successfully" })
})

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body

    const { error, success } = registerSchema.safeParse(req.body)

    if (!success) {
        res.send({
            success: false,
            errors: error?.formErrors.fieldErrors
        })
    }

    const client = getClient()
    const { data: User, error: error1 } = await client
        .from('User')
        .select("*")
        .eq('email', email)

    if (error1) {
        console.log(error1)
        res.send({
            success: false,
            errors: { formError: error1.message }
        })
    } else if (User.length > 0) {
        return res.send({
            success: false,
            errors: { formError: "User already registered" }
        })
    }

    const salt = await bcryptjs.genSalt(10)
    const passwordHash = await bcryptjs.hash(password, salt)

    const { data: createdUser, error: error2 } = await client
        .from('User')
        .insert([
            { name, email, passwordHash },
        ]).select()

    if (error2) {
        console.log(error2)
        res.send({
            success: false,
            errors: { formError: error2.message }
        })
    }
    const token = jwt.sign({ id: createdUser[0].id, name, email }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    })

    // Set the token in the cookie
    res.cookie('session', token, {
        expires: new Date(Date.now() + 3600000),
        path: '/',
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "none",
    });

    res.status(200).send({ success: true, errors: {}, message: "Registered successfully" })
})

router.post("/update-profile", async (req, res) => {
    const token = req.cookies.session
    if (!token) {
        return res.status(400).send({ error: "Unauthorized" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const client = getClient()

        const { error } = await client
            .from('User')
            .update([req.body])
            .eq('id', decoded.id)
            .select()

        if (error) {
            console.log(error)
            return res.status(400).send({ error: error.message })
        }

        res.status(200).send({ message: "Profile updated successfully" })

    } catch (error) {
        console.log(error)
        return res.status(200).send({ error: "Unauthorized" })
    }

})

router.get("/logout", (req, res) => {
    res.clearCookie("session")
    res.status(200).send({ message: "Logged out successfully" })
})

router.get("/authenticated", (req, res) => {
    const token = req.cookies.session
    if (!token) {
        return res.status(200).send({ authorized: false })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        console.log(decoded)
        if (err) {
            return res.status(200).send({ authorized: false })
        }
        res.status(200).send({ authorized: true })
    })
})

router.get("/user", async (req, res) => {
    const token = req.cookies.session
    if (!token) {
        return res.status(200).send({ authorized: false })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const client = getClient()

        const { data: User } = await client
            .from('User')
            .select("*")
            .eq('id', decoded.id)

        res.status(200).send({ authorized: true, user: User[0] })
    } catch (err) {
        res.status(200).send({ authorized: false })
    }

})

export default router
