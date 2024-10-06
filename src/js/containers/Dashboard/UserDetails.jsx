import React from "react"
import { Flex, Heading, Image, Skeleton, Text } from "@chakra-ui/react"
import { formatDate } from "@/lib/util"
import { User2 } from "lucide-react"
import { Link } from "@chakra-ui/react"
import { useGetUserDetailsQuery } from "@store/api/auth"
import { useGetAvatarUrlQuery } from "@store/api/storage"
// import { getUserDetails } from "@/lib/auth"
// import { useCurrentRouteData } from "@tata1mg/router"

export default function UserDetails() {

    const { data: user } = useGetUserDetailsQuery()
    const { data: avatar_url } = useGetAvatarUrlQuery()

    // const { data: routeData, isFetching: routeLoading } = useCurrentRouteData()
    // console.log(routeData, routeLoading)

    return (typeof user !== "undefined" && typeof avatar_url !== "undefined") &&
        (
            <>
                <Flex alignItems={"center"} gap={8}>
                    {avatar_url !== "undefined" ? <Image rounded={"full"} width={150} height={150} src={avatar_url} alt={user.name} /> : <User2 size={64} />}
                    <Flex direction="column" gap={4}>
                        <Heading>{user.name}</Heading>
                        <Flex direction={"column"} gap={3}>
                            <Text>
                                Age:{" "}
                                {user.date_of_birth
                                    ? Math.floor(
                                        (new Date().getTime() - new Date(user.date_of_birth).getTime()) /
                                        (1000 * 60 * 60 * 24 * 365.25)
                                    ).toString()
                                    : <Link href="/profile">Update Profile</Link>}
                            </Text>
                            <Text>DOB: {!user.date_of_birth ? <Link href="/profile">Update Profile</Link> : formatDate(user.date_of_birth)}</Text>
                            <Text>Blood Type: {user.blood_type || <Link href="/profile">Update Profile</Link>}</Text>
                        </Flex>
                    </Flex>
                </Flex>
            </>
        )
}

// UserDetails.clientFunction = async () => {
//     const user = await getUserDetails()
//     console.log(user)
//     return {
//         user
//     }
// }
