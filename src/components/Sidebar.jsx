import React from "react"
import { Button, Flex, Heading } from "@chakra-ui/react"
import { Link, useResolvedPath } from "@tata1mg/router"


export default function Sidebar() {

    const { pathname } = useResolvedPath()

    return (
        <Flex backgroundColor={"gray.900"} height={"100%"} px={8} direction={"column"}>
            <Heading pt={4}>Catalyst</Heading>
            <Flex mt={20} direction={"column"} gap={2}>
                <Button variant={pathname === "/" ? "solid" : "ghost"}>
                    <Link to="/">Home</Link>
                </Button>
                <Button variant={pathname === "/prescriptions" ? "solid" : "ghost"}>
                    <Link to="/prescriptions">Prescriptions</Link>
                </Button>
            </Flex>
        </Flex>
    )
}
