import React from "react"
import { Outlet } from "@tata1mg/router"

import "@css/base/index.scss"
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react"
import theme from "@/lib/theme"

const App = () => {
    return (
        <ChakraProvider theme={theme}>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <Outlet />
        </ChakraProvider>
    )
}

App.serverSideFunction = () => {
    return new Promise((resolve) => resolve())
}

export default App
