dotenv.config();
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { resolvers, typeDefs } from './src1/graphql.schema.js';
import userRouter from './src1/routing.js';


const app = express()
app.use(express.json())


app.get('/', (req, res) => {
    res.status(200).send("Hello NodeJS user this is basic server connection")
})

//consfiguew Database
mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    console.log("connected to database")
}).catch((err) => {
    console.log('Database connection failed:', err)
})

//configure ApolloServer
const server = new ApolloServer({
    typeDefs,
    resolvers,
})
await server.start();


//GraphQl API
app.use('/graphql', expressMiddleware(server));

//RESTful API
app.use('/api/v1/users', userRouter);


//server listen on port
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`)
    console.log(`graphql server running on http://localhost:${port}/graphql`)
})
