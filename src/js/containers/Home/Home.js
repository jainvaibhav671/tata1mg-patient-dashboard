import React from "react"
import { getIsAuthenticated } from "@/lib/auth"
import { Outlet, useLoaderData } from "@tata1mg/router"
import { Flex } from "@chakra-ui/react"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"

function Home() {
    return (
        <Flex width={"100vw"} height={"100vh"} gap={0}>
            <Sidebar />
            <Flex width="100%" direction={"column"} height="100%">
                <Header />
                <Outlet />
            </Flex>
        </Flex>
    )
}

Home.clientFetcher = async ({ navigate }) => {
    const authorized = await getIsAuthenticated()
    if (!authorized) {
        return navigate("/login")
    }
}

export default Home
