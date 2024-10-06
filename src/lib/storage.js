import axios from "axios"

export async function getAvatarUrl() {
    const { data } = await axios.get("/api/storage/get-avatar-url")
    return data
}
