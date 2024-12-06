import { gql } from 'graphql-tag';
import { User } from '../model/user.model.js';

export const typeDefs = gql`
type User {
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

export const resolvers = {
    Query: {
        getAllUsers: async (_, { page = 1, limit = 10 }) => {
            const skip = (page - 1) * limit;
            return User.find().skip(skip).limit(limit);
        },

        getUserById: async (_, { _id }) => {
            return User.findById(_id).select('-password');
        },

        searchUsers: async (_, { search }) => {
            return User.find({
                $or: [
                    {
                        name: {
                            $regex: search,
                            $options: 'i'
                        }
                    },
                    {
                        email: {
                            $regex: search,
                            $options: 'i'
                        }
                    },
                ],
            });
        },
    },

    Mutation: {
        registerUser: async (_, { name, email, password, phone, profession }) => {
            const user = new User({ name, email, password, phone, profession });
            await user.save();
            return user;
        },

        loginUser: async (_, { email, password }) => {
            const user = await User.findOne({ email }).select('+password');
            if (!user || !(await user.isPasswordCorrect(password))) {
                throw new Error('Invalid credentials');
            }
            return user.generateAccessToken();
        },

        updateUser: async (_, { _id, name, email, phone, profession }) => {
            const updatedUser = await User.findByIdAndUpdate(
                _id,
                { name, email, phone, profession },
                { new: true }
            );
            return updatedUser;
        },

        deleteUser: async (_, { _id }) => {
            const deletedUser = await User.findByIdAndDelete(_id);
            return deletedUser;
        },
    },
};
