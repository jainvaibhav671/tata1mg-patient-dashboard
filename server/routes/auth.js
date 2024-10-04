import { getClient } from "@/lib/db"

const express = require("express")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")

const router = express.Router()

router.get("/", (req, res) => {
    res.send({ message: "hello world" })
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body

    if (typeof email === "undefined" || typeof password === "undefined") {
        return res.status(200).send({ error: "email and password are required" })
    }

    const client = getClient()

    let { data: User, error: error1 } = await client
        .from('User')
        .select("*")
        .eq('email', email)


    if (error1) {
        console.log(error1)
        return res.status(400).send({ error: error1.message })
    } else if (User.length === 0) {
        return res.status(400).send({ error: "User not registered" })
    }

    const isSamePassword = await bcryptjs.compare(password, User[0].passwordHash)
    if (!isSamePassword) {
        return res.status(200).send({ error: "Wrong password" })
    }

    const token = jwt.sign({ id: User[0].id, name: User[0].name, email }, process.env.JWT_SECRET, {
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

    const client = getClient()

    let { data: User, error: error1 } = await client
        .from('User')
        .select("*")
        .eq('email', email)

    if (error1) {
        console.log(error1)
        res.send(400).message({ error: error1.message })
    } else if (User.length > 0) {
        return res.status(400).send({ error: "User already registered" })
    }

    const salt = await bcryptjs.genSalt(10)
    const passwordHash = await bcryptjs.hash(password, salt)


    const { error: error2 } = await client
        .from('User')
        .insert([
            { name, email, passwordHash },
        ])

    if (error2) {
        console.log(error2)
        res.send(400).send({ error: error2.message })
    }

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

// router.get("/users", (req, res) => {
//     res.json(users)
// })

export default router
