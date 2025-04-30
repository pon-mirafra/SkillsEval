import express from "express"
import cors from "cors"
import cookieParser  from "cookie-parser"
import  heathCheckRouter  from "./routes/heathCheckRoute.js"
// import  userRouter from "../src/routes/user.routes.js"
import { errorHandler } from "./middleware/error.middleware.js"
const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials:true
}))


// common middleware
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
// app.use(express.static("public"))
app.use(cookieParser())


//routes
app.use("/api/v1/healthcheck",heathCheckRouter)
// app.use("/api/v1/users",userRouter)



// app.use(errorHandler)

export   {app} 