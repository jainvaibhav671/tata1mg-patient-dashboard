import { InputGroup, Input, InputRightElement, Button } from "@chakra-ui/react"
import { Eye, EyeOff } from "lucide-react"
import React, { useState } from "react"

export default function PasswordInput(props) {
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)

    return (
        <InputGroup size='md'>
            <Input
                {...props}
                pr='4.5rem'
                type={show ? 'text' : 'password'}
                placeholder='Enter password'
            />
            <InputRightElement width='4.5rem'>
                <Button size='xs' variant={"ghost"} onClick={handleClick}>
                    {show ? <EyeOff /> : <Eye />}
                </Button>
            </InputRightElement>
        </InputGroup>
    )
}
