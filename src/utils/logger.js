import winston from "winston";
import moment from "moment";

//here we create winston logger is use for
//debugging, error tracking and monitoring.
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        //use IST Indian Standard Time
        winston.format.timestamp({
            format: () => moment().format("YYYY-MM-DD HH:mm:ss A")
        }),
        winston.format.printf(
            ({
                timestamp, level, message
            }) => `[${timestamp} ${level.toUpperCase()}: ${message}]`
        )
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "logs/error.log", level: "error" }),
        new winston.transports.File({ filename: "logs/combined.log" })
    ],
});

export default logger;