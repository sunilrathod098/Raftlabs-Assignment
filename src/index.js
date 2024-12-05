import dotenv from "dotenv";
import { app } from "../src/app.js";
import connectDB from "./config/db.js";
import logger from "./utils/logger.js";

dotenv.config({
    path: './.env'
})


//database connection
connectDB()
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            logger.info(`Server running on http://localhost:${process.env.PORT}`)
        })
        app.on("error", (err) => {
            logger.error("Server error: ", err);
            throw err
        })

    }).catch((err) => {
        logger.error("Database connection is failed !! ", err);
    })