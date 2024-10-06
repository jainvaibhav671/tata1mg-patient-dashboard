import { getClient } from "@/lib/db"

const express = require("express")
const jwt = require("jsonwebtoken")

const router = express.Router()

router.get("/", async (req, res) => {
    const token = req.cookies.session

    if (!token) {
        return res.status(400).send({ error: "Unauthorized" })
    }

    const { id } = jwt.verify(token, process.env.JWT_SECRET)
    const client = getClient()

    let { data: Prescription, error } = await client
        .from('Prescription')
        .select("*")
        .eq('user_id', id)

    if (error) {
        console.log(error)
        return res.status(400).send({ error: error.message })
    }

    res.status(200).send({ data: Prescription })
})

router.post("/create", async (req, res) => {
    const token = req.cookies.session
    if (!token) {
        return res.status(400).send({ error: "Unauthorized" })
    }

    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET)
        const client = getClient()

        const { data, error } = await client
            .from('Prescription')
            .insert([
                { ...req.body, user_id: id },
            ]).select()

        if (error) {
            res.status(400).send({ error: error.message })
        }

        return res.status(200).send({ prescription_id: data[0].id, message: "Prescription created successfully" })
    } catch (err) {
        console.log(err.message)
    }
})

router.post("/create-medicine", async (req, res) => {
    const token = req.cookies.session
    if (!token) {
        return res.status(400).send({ error: "Unauthorized" })
    }

    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET)
        const client = getClient()


        const { data, error } = await client
            .from('Medication')
            .insert(req.body)
            .select()

        console.log(req.body, data)
        if (error) {
            console.log(error)
            return res.status(400).send({ error: error.message })
        }

        return res.status(200).send({ message: "Medicines added" })
    } catch (err) {
        console.log(err.message)
    }
})

router.get("/get-medicines/:prescription_id", async (req, res) => {
    const token = req.cookies.session
    if (!token) {
        return res.status(400).send({ error: "Unauthorized" })
    }

    const { prescription_id } = req.params
    const client = getClient()

    try {
        const { data: Medicines, error } = await client
            .from('Medication')
            .select("*")
            .eq('prescription_id', prescription_id)

        console.log(Medicines, error)

        return res.status(200).send({ data: Medicines })

    } catch (err) {
        console.log(err)
        res.send(400).send({ error: "Error in fetching medicines" })
    }

})

router.get("/ongoing", async (req, res) => {
    const token = req.cookies.session
    if (!token) {
        return res.status(400).send({ error: "Unauthorized" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const client = getClient()

    let { data: Prescription, error } = await client
        .from('Prescription')
        .select("*")
        .eq('user_id', decoded.id)
        .gt('end_date', new Date().toISOString())
        .lt('start_date', new Date().toISOString())

    if (error) {
        console.log(error)
        return res.status(400).send({ error: error.message })
    }

    res.status(200).send({ data: Prescription })
})

export default router
