import React from "react"
import { redirect } from "@tata1mg/router"
import LoginForm from "./LoginForm"

import { Heading, Flex } from '@chakra-ui/react'
import RegisterForm from "./RegisterForm"
import { useMounted } from "@/lib/util"
import { getIsAuthenticated } from "@/lib/auth"

export async function loader() {
    const authorized = await getIsAuthenticated()
    if (authorized) {
        return redirect("/")
    }

    return null
}

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

const clientFetcher = async ({ navigate }) => {
    const authorized = await getIsAuthenticated()
    if (authorized) {
        return navigate("/")
    }
}

Login.clientFetcher = clientFetcher;
Register.clientFetcher = clientFetcher;
