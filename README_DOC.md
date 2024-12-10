# Raftlabs Assignment: Node Developer Intern Test

## Project Overview

- This project is an implementation of a RESTful API using Node.js and Express.js with support for *GraphQL*. The API is built to handle user registration, user login, authentication with tokrns, CRUD operations, and provides features like pagination, filtering, searching, sorting, and error handling. It also includes logging using `Winston & Morgan`, and integrates JWT Authentication for securing routes.

- Additionally, the project demonstrates the ability to work with JavaScript, *GraphQL, and ApolloServer* for optimized data queries.

## Project Structure
- Here’s the structure of the project:

- Raftlabs-assignment/
- │
- ├── src/
- │   ├── config/
- │   │   └── db.config.js              
- │   ├── controller/
- │   │   └── user.controller.js            
- │   ├── graphql/
- │   │   └── schema.js         
- │   ├── middleware/
- │   │   └── authMiddleware.js  
- │   ├── models/
- │   │   └── user.model.js      
- │   ├── utils/
- │   │   ├── ApiError.js                      
- │   │   ├── ApiResponse.js     
- │   │   ├── asyncHandler.js    
- │   │   └── logger.js          
- │   ├── app.js                 
- │   ├── constants.js           
- │   ├── index.js               
- │
- ├── public/                    
- ├── logs/
- │   ├── combined.log
- │   ├── error.log
- ├── .env
- ├── package.json
- ├── README_DOC.md
- └── README.md

## Tools & Technologies
- I use tools and technologies in this Assignment
### Technologies 
- `Node.js, Express.js, MongoDB, Mongoose, JavaScript, JWT, Apollo Server (GraphQL), MVC Architecture`
### Tools
- `VsCode, Git & GitHub, Postman, GraphQL Playground, MongoDBcompass, Nodemon, dotenv, Winston, & Morgan`


### Key Folders and Files
- `controller/`: Contains the business logic for user-related operations.
- `models/`: Contains the schema for users and any other models in the project.
- `routes/`: Holds route definitions (user routes in this case).
- `config/`: Stores the database configuration for setting up the connection.
- `graphql/`: Contains the GraphQL schema and resolvers.
- `utils/`: Contains utility functions for logging, error handling, etc.
- `middleware/`: Stores middleware used for authentication and authorization.
- `logs/`: Stores application logs (combined.log and error.log).
- `public/`: Contains any public files such as images, CSS, etc.
- `.env`: Stores environment variables (e.g., database URL, JWT secret).
- `package.json`: Lists project dependencies and NPM scripts.

## Main Files
- `app.js`: Configures and sets up the main Express.js application.
- `index.js`: Entry point for the application, runs the server.
- `constants.js`: Contains constants like database name, JWT secret, etc.
- `README_DOC.md`: Documentation for the project.

## Features

### 1. User Registration and Login
- Secure password hashing using bcryptjs for storing passwords.
- JWT Authentication to secure routes and ensure authorized access to sensitive endpoints.
### 2. CRUD Functionality for Managing Data
- Create, read, update, and delete operations for managing user data.
- Pagination and sorting functionality for user data.
### 3. Search and Filter
- Endpoints that allow searching and filtering of data by user-defined parameters.
- Data can be filtered by name, email, and other fields.
### 4. Error Handling and Logging
- Winston and Morgan logging for debugging and error tracking. Logs are stored in `logs/combined.log` and `logs/error.log`.
- Custom error handling using the `ApiError.js` utility.
### 5. GraphQL Integration (Optional)
- The application integrates GraphQL using ApolloServer, providing a flexible query language to fetch and manipulate data.
- The GraphQL schema is stored in the `graphql/schema.js` file.
### 6. JavaScript Support
- The API is written in TypeScript/JavaScript, ensuring static typing and better maintainability.

## Testing
### Postman
- You can use Postman to test the API endpoints. Here's an overview of the available routes:

- `POST /users/register`: Register a new user with email and password.
- `POST /users/login`: Login a user and return a JWT token.
- `GET /users`: Get a list of users with pagination and filtering.
- `GET /:userId`: Fetch a user's profile (requires JWT token).
- `PUT /users/:id`: Update a user's details.
- `DELETE /users/:id`: Delete a user.
- Make sure to test different API scenarios using Postman, including valid and invalid inputs.

### Apollo Server for GraphQL
- To use GraphQL, you can query the API using Apollo Server with queries and mutations like:
- *mutation {
    registerUser{
      _id
      name
      email
      phone
      profession
      }*
  
 - *mutation {
  users {
    name
    email
  }
}*

- This a user query:-
  
- *query Query($id: ID!, $search: String!) {
  - getAllUsers {
    _id
    name
    email
    phone
    profession
  }
 - getUserById(_id: $id) {
    _id
    name
    email
    phone
    profession
  }
  - searchUsers(search: $search) {
    _id
    name
    email
    phone
    profession
  }
}*


### Installation and Running the Project

#### Prerequisites
- Node.js installed on your machine.
- Postman for testing.
- Apollo Server for GraphQL queries.

### Steps to Run the Project
- Clone the repository:

`git clone https://github.com/sunilrathod098/Raftlabs-assignment.git`

`cd Raftlabs-assignment`

- Install dependencies:

`npm install`

` Set up environment variables:

- Create a `.env` file in the root directory and add the following:

- `PORT=port`
- `MONGODB_URI = mongodb url`
- `CORS_ORIGIN=*`

- `ACCESS_TOKEN_SECRET=access token`
- `ACCESS_TOKEN_EXPIRY=30d`
- `REFRESH_TOKEN_SECRET=refresh token`
- `REFRESH_TOKEN_EXPIRY=50d`

### Run the application:

- Start the development server:

- `npm run dev`

- The API should now be running on `http://localhost:5000.`

## Conclusion

- This API demonstrates core concepts of backend development, including user authentication, CRUD functionality, GraphQL integration, error handling, and logging. The use of TypeScript ensures a maintainable and scalable codebase, while the inclusion of features like pagination, sorting, and filtering improves the flexibility and performance of the application.

