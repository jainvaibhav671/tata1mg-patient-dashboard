import React, { useEffect, useState } from "react"
import { getIsAuthenticated } from "@/lib/auth"
import { useNavigate } from "@tata1mg/router"
import LoginForm from "./LoginForm"

import { Heading, Flex } from '@chakra-ui/react'
import RegisterForm from "./RegisterForm"
export function Login() {

    const navigate = useNavigate()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        getIsAuthenticated().then((authorized) => {
            if (authorized) {
                navigate("/")
            }

            // Wait for the component to mount
            setMounted(true)
        })

        return () => setMounted(false)
    }, [])

    return mounted && (
        <Flex direction={"column"} gap={3} width={"100vw"} height={"100vh"} justifyContent="center" alignItems="center">
            <Heading mb={8} color="teal">Login</Heading>
            <LoginForm />
        </Flex>
    )
}

export function Register() {

    const navigate = useNavigate()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        getIsAuthenticated().then((authorized) => {
            if (authorized) {
                navigate("/")
            }

            // Wait for the component to mount
            setMounted(true)
        })

        return () => setMounted(false)
    }, [])

    return mounted && (
        <Flex direction={"column"} gap={3} width={"100vw"} height={"100vh"} justifyContent="center" alignItems="center">
            <Heading mb={8} color="teal">Register</Heading>
            <RegisterForm />
        </Flex>
    )
}
