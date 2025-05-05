import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import heathCheckRouter from "./routes/heathCheckRoute.js"
import userRouter from "./routes/userRouter.js"
import { errorHandler } from "./middleware/error.middleware.js"
const app = express()

/*
backend server must explicitly allow credentials in CORS response headers:
The backend must also not use '*' as the value for Access-Control-Allow-Origin — instead,
it must explicitly list the frontend origin (e.g., http://localhost:3000)
*/
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// common middleware
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
// app.use(express.static("public"))
app.use(cookieParser())


//routes
app.use("/api/v1/healthcheck", heathCheckRouter)
app.use("/api/v1/users", userRouter)



// app.use(errorHandler)

export { app } 