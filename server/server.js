const express = require("express")
const path = require("path")
const routes = require("./routes")
// Server middlewares are added here.

export function addMiddlewares(app) {
    app.use("/favicon.ico", express.static(path.join(__dirname, "../public/favicon.ico")))
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.use("/api/auth", routes.authRouter)
    app.use("/api/storage", routes.storageRouter)
    app.use("/api/prescriptions", routes.prescriptionRouter)
}
