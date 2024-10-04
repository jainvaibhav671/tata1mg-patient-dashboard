import Home from "@containers/Home/Home"
import { Login, Register } from "@containers/Auth"

const routes = [
    {
        path: "/",
        end: true,
        component: Home,
    },
    {
        path: "/login",
        end: true,
        component: Login
    },
    {
        path: "/register",
        end: true,
        component: Register
    }
]

export default routes
