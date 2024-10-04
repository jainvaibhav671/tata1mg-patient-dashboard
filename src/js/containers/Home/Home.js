import React, { useEffect } from "react"
import { getIsAuthenticated } from "@/lib/auth"
import { useNavigate } from "@tata1mg/router"
import { Box, Button, Flex } from "@chakra-ui/react"
import { logout } from "@/lib/auth"
import Sidebar from "@/components/Sidebar"

function Home() {


    const navigate = useNavigate()
    useEffect(() => {
        getIsAuthenticated().then((authorized) => {
            console.log(authorized)
            if (!authorized) {
                navigate("/login")
            }
        })
    }, [])

    return (
        <Flex justify="space-between">
            <Sidebar />
        </Flex>
    )
}

export default Home
