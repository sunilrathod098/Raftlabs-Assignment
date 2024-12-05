import mongoose from "mongoose";
import logger from "../utils/logger.js"
import { DB_NAME } from "../constants.js";

//here we use async function and await prommiese
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose
            .connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        logger.info(`Database connect successfully!!`)

    } catch (error) {
        logger.error("Database connection is failed:", error);
        process.exit(1)
    }
}

//the database connection is default connection.
export default connectDB