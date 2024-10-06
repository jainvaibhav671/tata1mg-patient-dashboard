import React, { useState, useEffect } from "react"
import { Center, Flex, Input, Text, Box, Heading, Button, Select, Spinner } from "@chakra-ui/react"
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
} from '@chakra-ui/react'
import { updateUserDetails } from "@/lib/auth"
import UpdateAvatarImage from "@/components/UpdateAvatarImage"
import { useGetUserDetailsQuery } from "@store/api/auth"
import { useGetAvatarUrlQuery } from "@store/api/storage"

export default function Profile() {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState({})

    const { data: user, isLoading: userLoading } = useGetUserDetailsQuery()
    const { data: avatar_url, isLoading: avatarLoading } = useGetAvatarUrlQuery()

    const [userDetails, setUserDetails] = useState({})

    useEffect(() => {
        if (userLoading) return;
        setUserDetails(user)
    }, [user, userLoading])

    useEffect(() => {
        if (avatarLoading) return;
        setUserDetails(u => ({ ...u, avatar_img: avatar_url }))
    }, [avatar_url, avatarLoading])

    const onSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setErrors({})

        const formData = new FormData(e.target)

        const res = await updateUserDetails(formData)
        if (!res.success) {
            setErrors(res.errors)
        }

        setIsSubmitting(false)
    }

    const inputOnChange = (e) => {
        setUserDetails(user => ({ ...user, [e.target.name]: e.target.value }))
    }

    return (
        <Box mx={"auto"} minWidth={600}>
            <Heading mb={16} colorScheme="teal">Profile</Heading>
            <form onSubmit={onSubmit}>
                {!userLoading && <Flex direction="column">
                    <Center><UpdateAvatarImage setUser={setUserDetails} imgUrl={!avatarLoading && avatar_url} /></Center>
                    <Flex direction="column" gap={4}>
                        <FormControl mt={3}>
                            <FormLabel>Name</FormLabel>
                            <Input name="name" value={userDetails.name} disabled type='text' />
                            <FormErrorMessage />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Email</FormLabel>
                            <Input name="email" value={userDetails.email} disabled type='email' />
                            <FormErrorMessage />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Date of Birth</FormLabel>
                            <Input onChange={inputOnChange} name="date_of_birth" value={userDetails.date_of_birth || ''} type='date' />
                            <Text color="red">{typeof errors.date_of_birth !== "undefined" && errors.date_of_birth[0]}</Text>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Blood Type</FormLabel>
                            <Select onChange={inputOnChange} value={userDetails.blood_type || ''} name="blood_type" placeholder='Select option'>
                                <option value='A+'>A+</option>
                                <option value='A-'>A-</option>
                                <option value='B+'>B+</option>
                                <option value='B-'>B-</option>
                                <option value='AB+'>AB+</option>
                                <option value='AB-'>AB-</option>
                                <option value='O+'>O+</option>
                                <option value='O-'>O-</option>
                            </Select>
                            <Text color="red">{typeof errors.blood_type !== "undefined" && errors.blood_type[0]}</Text>
                        </FormControl>
                        <Flex gap={4}>
                            <FormControl>
                                <FormLabel>Height <strong>(cm)</strong></FormLabel>
                                <Input onChange={inputOnChange} name="height" value={userDetails.height || 0} type='number' />
                                <Text color="red">{typeof errors.height !== "undefined" && errors.height[0]}</Text>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Weight <strong>(kg)</strong></FormLabel>
                                <Input onChange={inputOnChange} name="weight" value={userDetails.weight || 0} type='number' />
                                <Text color="red">{typeof errors.weight !== "undefined" && errors.weight[0]}</Text>
                            </FormControl>
                        </Flex>
                        <Button disabled={isSubmitting} type="submit" colorScheme="teal" mt={2}>
                            <Flex gap={2} alignItems="center">
                                {isSubmitting && <Spinner width={4} height={4} />}
                                <Text>Update</Text>
                            </Flex>
                        </Button>
                    </Flex>
                </Flex>}
            </form>
        </Box>
    )
}
