import React from "react"
import { Head, Body } from "catalyst-core"

function Document(props) {
    return (
        <html lang="en">
            <Head {...props}>
                <title>Patient Dashboard</title>
                <meta name="description" content="Patient Dashboard" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
            </Head>
            <Body {...props} />
        </html>
    )
}
export default Document
