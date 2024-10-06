import React from "react"
import LoginForm from "./LoginForm"

import { Heading, Flex } from '@chakra-ui/react'
import RegisterForm from "./RegisterForm"
import { useMounted } from "@/lib/util"
import { getIsAuthenticated } from "@/lib/auth"

export function Login() {
    const mounted = useMounted()
    return mounted && (
        <Flex direction={"column"} gap={3} width={"100vw"} height={"100vh"} justifyContent="center" alignItems="center">
            <Heading mb={8} size={"2xl"} colorScheme="teal">Login</Heading>
            <LoginForm />
        </Flex>
    )
}

export function Register() {
    const mounted = useMounted()
    return mounted && (
        <Flex direction={"column"} gap={3} width={"100vw"} height={"100vh"} justifyContent="center" alignItems="center">
            <Heading mb={8} size={"2xl"} colorScheme="teal">Register</Heading>
            <RegisterForm />
        </Flex>
    )
}

const fetcher = async ({ navigate }) => {
    const authorized = await getIsAuthenticated()
    if (authorized) {
        return navigate("/")
    }
}

Login.clientFetcher = fetcher;
Register.clientFetcher = fetcher;
