import axios from "axios"
import { z } from "zod"

export async function getPrescriptions() {
    const { data } = await axios.get("/api/prescriptions")
    return data.data
}

const prescriptionSchema = z.object({
    name: z.string({ required_error: "Name is required" }),
    prescribed_by: z.string({ required_error: "Prescribed by is required" }),
    symptoms: z.array(z.string({ required_error: "Symptoms are required" })),
    start_date: z.date({ required_error: "Start date is required" }),
    end_date: z.date({ required_error: "End date is required" }),
})

export async function createPrescription(values) {
    const { error, success } = prescriptionSchema.safeParse(values)

    if (!success) {
        return {
            success: false,
            errors: error?.formErrors.fieldErrors
        }
    }
    const { data } = await axios.post("/api/prescriptions/create", values)
    return data
}

export async function createMedicines(values, prescription_id) {
    const { data } = await axios.post("/api/prescriptions/create-medicine", values.map((v) => ({ ...v, prescription_id })))
    return data
}

export async function getMedicines(prescription_id) {
    const { data } = await axios.get(`/api/prescriptions/get-medicines/${prescription_id}`)
    return data
}
