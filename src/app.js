import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan"
import logger from "./utils/logger.js";
import { typeDefs, resolvers } from "./graphql/schema.js";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';




// Manually calculate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || ["http://localhost:3000", "http://localhost:5000"],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());


//setup morgan and redirect logs to winston
app.use(
    morgan('combined', {
        stream: {
            write: (message) => logger.info(message.trim())
        },
    })
);

// Create ApolloServer instance
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Start Apollo Server
await server.start();

// Apply Apollo Server middleware to Express app
app.use('/graphql', expressMiddleware(server));


//import routes
import userRouter from "./route/user.route.js";

//routes declaration
app.use('/api/v1/users', userRouter)


export { app };