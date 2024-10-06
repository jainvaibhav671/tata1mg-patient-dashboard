import React, { useState } from "react"
import PasswordInput from "@/components/PasswordInput"
import { useRegisterMutation } from "@store/api/auth"
import {
    FormControl,
    FormLabel,
    Button,
    Input,
    Flex,
    Box,
    Spinner,
    Link,
    Text
} from '@chakra-ui/react'
import { useNavigate } from "@tata1mg/router"

export default function RegisterForm() {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()
    const [register] = useRegisterMutation()

    const onSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        const formData = new FormData(e.target)

        const values = Object.fromEntries(formData.entries())

        const { data } = await register(values)
        if (!data.success) {
            setErrors(data.errors)
        }

        if (data.success) {
            navigate("/")
        }
        setIsSubmitting(false)
    }

    return (
        <Box width={"100%"} maxWidth={400}>
            <form onSubmit={onSubmit} className="w-full flex flex-col gap-2">
                <Flex direction={"column"} gap={4}>
                    <Flex direction={"column"} gap={2}>
                        <FormControl isRequired>
                            <FormLabel htmlFor="name">Name</FormLabel>
                            <Input type="text" name="name" id="name" placeholder="John Doe" />
                            <Text color="red">{typeof errors.name !== "undefined" && errors.name[0]}</Text>
                        </FormControl>
                    </Flex>
                    <Flex direction={"column"} gap={2}>
                        <FormControl isRequired>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <Input type="email" name="email" id="email" placeholder="bar@foo.com" />
                            <Text color="red">{typeof errors.email !== "undefined" && errors.email[0]}</Text>
                        </FormControl>
                    </Flex>
                    <Flex direction={"column"} gap={2}>
                        <FormControl isRequired>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <PasswordInput name="password" id="password" />
                            {typeof errors.password !== "undefined" && (
                                <Flex direction="column" mt={2} gap={1}>
                                    {errors.password.map((e, i) => <Text color="red" key={`error-${i}`}>{e}</Text>)}
                                </Flex>
                            )}
                        </FormControl>
                    </Flex>
                    <Flex direction={"column"} gap={2}>
                        <FormControl isRequired>
                            <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                            <PasswordInput name="confirmPassword" id="confirmPassword" />
                            {typeof errors.confirmPassword !== "undefined" && (
                                <Flex direction="column" mt={2} gap={1}>
                                    {errors.confirmPassword.map((e, i) => <Text color="red" key={`error-${i}`}>{e}</Text>)}
                                </Flex>
                            )}
                        </FormControl>
                    </Flex>
                    <Button disabled={isSubmitting} type="submit" colorScheme="teal" mt={2}>
                        <Flex gap={2} alignItems="center">
                            {isSubmitting && <Spinner width={4} height={4} />}
                            <Text>Register</Text>
                        </Flex>
                    </Button>
                </Flex>
                <Text color="red">{typeof errors.formError !== "undefined" && errors.formError}</Text>
                <Flex alignItems={"end"} gap={1} mt={3}>
                    <p>Already have an account?</p>
                    <Link color="blue" textUnderlineOffset={2} href="/login">Login</Link>
                </Flex>
            </form>
        </Box>
    )
}
