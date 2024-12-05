import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan"
import logger from "./utils/logger.js";



// Manually calculate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Use path.join to join directories
app.use(cookieParser());


//setup morgan and redirect logs to winston
app.use(
    morgan('combined', {
        stream: {
            write: (message) => logger.info(message.trim())
        },
    })
);





//import routes
// import userRouter from "./routes/user.route.js";

//routes declaration
// app.use('/api/v1/users', userRouter)


export { app };