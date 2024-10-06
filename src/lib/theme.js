// theme.js

// 1. import `extendTheme` function
import { extendTheme } from '@chakra-ui/react'

// 2. Add your color mode config
const config = {
    initialColorMode: 'dark',
    useSystemColorMode: true,
}

const components = {
    RangeDatepicker: {
        baseStyle: {
            calendar: {
                bg: 'teal.50',
                color: 'teal.700',
            },
            day: {
                _hover: {
                    bg: 'teal.200',
                },
                _selected: {
                    bg: 'teal.500',
                    color: 'white',
                },
                _outside: {
                    color: 'gray.400',
                },
            },
        },
    },
}

// 3. extend the theme
const theme = extendTheme({ config, components })

export default theme
