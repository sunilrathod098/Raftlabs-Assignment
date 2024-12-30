import { gql } from 'graphql-tag';
import { User } from '../model/user.model.js';

const typeDefs = gql
    `type User
    {
    _id: ID!
    name: String!
    email: String!
    phone: String!
    profession: String!
    }
    type Query {
        getAllUsers(page: Int, limit: Int): [User]
        getUserById(_id: ID!): User
        searchUsers(search: String!): [User]
    }
    type Mutation {
        registerUser(name: String!, email: String!, password: String!, phone: String!, profession: String!): User
        loginUser(email: String!, password: String! ): String
        updateUser(_id: ID!, name: String!, email: String!, phone: String!, profession: String!): User
        deleteUser(_id: ID!): User
    }`;


const resolvers = {
    Query: {
        //getAllUsers
        getAllUsers: async (_, { page = 1, limit = 10 }) => {
            const skip = (page - 1) * limit;
            return await User.find().skip(skip).limit(limit).select('-password');
        },

        //getUserById
        getUserById: async (_, { _id }) => {
            return await User.findById(_id).select('-password -refreshToken');
        },

        //searchUsers
        searchUsers: async (_, { search }) => {
            return await User.find({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            });
        }
    },


    Mutation: {
        //registerUser
        registerUser: async (_, { name, email, password, phone, profession }) => {
            const user = new User({ name, email, password, phone, profession });
            if (!user) throw new Error('User not created');
            await user.save();
            return user;
        },

        //loginUser
        loginUser: async (_, { email, password }) => {
            const user = await User.findOne({ email }).select('+password');
            if (!user || !(await user.isPasswordCorrect(password))) {
                throw new Error('Invalid credentials');
            }
            return "Login Successful";
        },

        //updateUser
        updateUser: async (_, { _id, name, phone, profession }) => {
            const user = await User.findByIdAndUpdate(
                _id,
                { name, phone, profession },
                { new: true, runValidators: true }
            );
            if (!user) throw new Error('User not found');
            return user;
        },

        //deleteUser
        deleteUser: async (_, { _id }) => {
            const user = await User.findByIdAndDelete(_id);
            if (!user) throw new Error('User not found');
            return user;
        }
    }
};



export { resolvers, typeDefs };
