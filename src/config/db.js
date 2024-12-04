import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

//here we use async function and await prommiese
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose
            .connect(`${process.env.MONGODB_URI}/${DB_NAME}`) // connect database url with db_name 
        console.log(`\n Database connect successfully!!`) //showing here host name also

    } catch (error) {
        console.error("Database connection is faild:", error);
        process.exit(1)
    }
}

//the databse connection is default connection.
export default connectDB