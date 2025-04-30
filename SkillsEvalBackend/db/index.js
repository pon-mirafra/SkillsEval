import mongoose from "mongoose"
import { DB_NAME } from "../constant.js"




const connectDB = async()=>{
    try {
      const connectionInstance =   await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`db connnected and host is ${connectionInstance.connection.host}`)
    } catch (error) {
         console.log("error in connecting to the database",error)
         process.exit(1)
    }
}


export default connectDB