require("dotenv").config()
require("colors")
const {
  data: { DEV_PORT },
} = require("../config/keys")
const express = require("express")
let app = express()
const morgan = require("morgan")
const errorHandler = require("../middlewares/error")
const cookieParser = require("cookie-parser")
const path = require("path")
const PORT = process.env.PORT || DEV_PORT
if (!process.env.NODE_ENV === "production") {
  app.use(morgan("dev"))
}
const authRoutes = require("../routes/auth")

const connectDB = require("../database/db")
//connect to database
connectDB()
// req.protocol will return https in production
app.enable("trust proxy")
// express middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// routes middlewares
app.use("/api/v1/auth", authRoutes)

// custom error handler
app.use(errorHandler)

// if in production serve index.html build file as frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend", "build")))
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend", "build", "index.html"))
  })
}

const server = app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`.bold)
})
// Unhandled Expections
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`.red)
  //close and exit server
  server.close(() => process.exit(1))
})
