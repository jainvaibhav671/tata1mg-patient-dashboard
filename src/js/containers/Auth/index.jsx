import React, { useState } from "react"
import LoginForm from "./LoginForm"
import RegisterForm from "./RegisterForm"
import { Box, Heading, Flex, Button, Spinner, Text } from '@chakra-ui/react'
import { getIsAuthenticated } from "@/lib/auth"
import { useLoginMutation } from "@store/api/auth"
import { useNavigate } from "@tata1mg/router"

export function Login() {
    const [login] = useLoginMutation()
    const [johnSubmitting, setJohnSubmitting] = useState(false)
    const [emilySubmitting, setEmilySubmitting] = useState(false)
    const navigate = useNavigate()

    const handleJohn = async (e) => {
        e.preventDefault()

        setJohnSubmitting(true)

        const { data } = await login({ email: "john@gmail.com", password: "John@123" })

        if (data.success) {
            navigate("/")
        }

        setJohnSubmitting(false)
    }

    const handleEmily = async (e) => {
        e.preventDefault()

        setEmilySubmitting(true)

        const { data } = await login({ email: "emily@gmail.com", password: "Emily@123" })

        if (data.success) {
            navigate("/")
        }

        setEmilySubmitting(false)
    }
    return (
        <Box>
            <Flex direction={"column"} gap={3} width={"100vw"} height={"100vh"} justifyContent="center" alignItems="center">
                <Heading mb={8} size={"2xl"} colorScheme="teal">Login</Heading>
                <LoginForm />
                <Flex mt={4} direction={"column"} gap={3} alignItems="center">
                    <Heading size={"lg"} colorScheme="teal">Demo Accounts</Heading>
                    <Button width={150} disabled={johnSubmitting} type="button" colorScheme="teal" mt={2} onClick={handleJohn}>
                        <Flex gap={2} alignItems="center">
                            {johnSubmitting && <Spinner width={4} height={4} />}
                            <Text>John Doe</Text>
                        </Flex>
                    </Button>
                    <Button width={150} disabled={emilySubmitting} type="button" onClick={handleEmily} colorScheme="teal" mt={2}>
                        <Flex gap={2} alignItems="center">
                            {emilySubmitting && <Spinner width={4} height={4} />}
                            <Text>Emily Willis</Text>
                        </Flex>
                    </Button>
                </Flex>
            </Flex>
        </Box>
    )
}

export function Register() {
    return (
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
