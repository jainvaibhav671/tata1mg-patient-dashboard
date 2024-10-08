import React from "react"
import { Flex } from "@chakra-ui/react"
import UserButton from "./UserButton"

export default function Header() {
    return <Flex width={"100%"} alignItems={"center"} justifyContent={"end"} p={4}>
        <UserButton />
    </Flex>
}
