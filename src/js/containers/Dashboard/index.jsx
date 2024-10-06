import { Grid, GridItem } from "@chakra-ui/react"
import React from "react"
import UserDetails from "./UserDetails"
import OngoingPrescriptions from "./OngoingPrescriptions"
import { getUserDetails } from "@/lib/auth"
import { getAvatarUrl } from "@/lib/storage"

export default function Dashboard() {
    return (
        <Grid px={32} width={"100%"} templateColumns={"repeat(2, 1fr)"}>
            <GridItem colSpan={2}>
                <UserDetails />
            </GridItem>
            <GridItem mt={32}>
                <OngoingPrescriptions />
            </GridItem>
        </Grid>
    )
}

//Fetcher functions returning Promise
Dashboard.serverFunction = async ({ route, location, params, searchParams, navigate }, { store }) => {
    const user = await getUserDetails()
    const { url } = await getAvatarUrl()

    return {
        user,
        avatar_url: url
    }
};
