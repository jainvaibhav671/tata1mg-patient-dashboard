const express = require("express")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")

const router = express.Router()

let users = {}

router.get("/", (req, res) => {
    res.send({ message: "hello world" })
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body

    if (typeof email === "undefined" || typeof password === "undefined") {
        return res.status(200).send({ error: "email and password are required" })
    }

    if (typeof users[email] === "undefined") {
        return res.status(200).send({ error: "User not registered" })
    }

    const isSamePassword = await bcryptjs.compare(password, users[email].passwordHash)
    if (!isSamePassword) {
        return res.status(200).send({ error: "Wrong password" })
    }

    const token = jwt.sign({ name: users[email].name, email }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    })

    // Set the token in the cookie
    res.cookie('session', token, {
        expires: new Date(Date.now() + 3600000),
        path: '/',
        secure: true,
        httpOnly: true,
    });

    res.status(200).send({ message: "Logged in successfully" })
})

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body

    if (!email || !password) {
        return res.status(400).send({ message: "email and password are required" })
    }

    if (typeof users[email] !== "undefined") {
        return res.status(500).send({ message: "user already exists" })
    }

    const salt = await bcryptjs.genSalt(10)
    const passwordHash = await bcryptjs.hash(password, salt)

    users[email] = { name, email, passwordHash }

    const token = jwt.sign({ name, email }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    })

    // Set the token in the cookie
    res.cookie('session', token, {
        expires: new Date(Date.now() + 3600000),
        path: '/',
        secure: true,
        httpOnly: true,
    });

    res.status(200).send({ message: "Registered successfully" })
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

    jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (err) {
            return res.status(200).send({ authorized: false })
        }
        res.status(200).send({ authorized: true })
    })
})

router.get("/users", (req, res) => {
    res.json(users)
})

export default router
