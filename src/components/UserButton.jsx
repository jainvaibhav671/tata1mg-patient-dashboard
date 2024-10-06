import React, { useState, useEffect } from "react"

import {
    Menu,
    Button,
    MenuButton,
    MenuList,
    MenuItem,
    Image
} from '@chakra-ui/react'
import { LogOut, User2 } from "lucide-react"
import { useMounted } from "@/lib/util"
import { Link } from "@chakra-ui/react"
import { logout } from "@/lib/auth"
import { useGetAvatarUrlQuery } from "../js/store/api/storage"

export default function UserButton() {

    const { data: avatarUrl, isLoading } = useGetAvatarUrlQuery()

    const mounted = useMounted()
    if (!mounted) return null

    return (
        <Menu>
            <MenuButton variant={"link"} as={Button}>
                {!isLoading ? <Image rounded={"full"} width={50} height={50} src={avatarUrl} alt="Avatar" /> : <User2 />}
            </MenuButton>
            <MenuList>
                <Link href="/profile">
                    <MenuItem icon={<User2 />}>View Profile</MenuItem>
                </Link>
                <form>
                    <MenuItem type="submit" onClick={logout} icon={<LogOut />}>Log out</MenuItem>
                </form>
            </MenuList>
        </Menu>
    )
}
