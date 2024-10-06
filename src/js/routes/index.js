import Home from "@containers/Home/Home"
import { Login, Register } from "@containers/Auth"
import Dashboard from "@containers/Dashboard"
import Profile from "@containers/Profile"
import Prescriptions from "@containers/Prescriptions"

const routes = [
    {
        path: "/",
        component: Home,
        id: "root",
        children: [
            {
                path: "/",
                end: true,
                component: Dashboard
            },
            {
                path: "/profile",
                end: true,
                component: Profile
            },
            {
                path: "/prescriptions",
                end: true,
                component: Prescriptions
            }
        ]
    },
    {
        path: "/login",
        component: Login
    },
    {
        path: "/register",
        component: Register
    }
]

export default routes
