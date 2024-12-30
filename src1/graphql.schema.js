import { gql } from 'graphql-tag';
import { User } from '../src/model/user.model.js';
import { ApiError } from '../src/utils/ApiError.js';

export const typeDefs = gql
//User - this are fields of the user attributes.
//Query - query is defines the operator retrieved the data that's means get the data from the user.
//Mutation - mutation are defines the operator modified the data that's means post/patch/delete the data.

`type User {
    _id: ID!,
    name: String!,
    email: String!,
    password: String!,
    phone: String!,
    profession: String!
}
type Query {
    getAllUser(page: Int!, limit: Int!): [User]
    getUserById(_id: ID!): User
    userSearch(search: String!): [User]
}
type Mutation {
    registerUser(name: String!, email: String!, password: String!, phone: String!, profession: String!): User
    loginUser(email: String!, password: String!): User
    updateUser(_id: ID!, name: String!, phone: String!, profession: String!): User
    deleteUser(_id: ID!): User
}`;


export const resolvers = {
    Query: {
        getAllUser: async(_, {page = 1, limit = 10}) => {
            const skip = (page - 1) * limit;
            const user = await User.find().skip(skip).limit(parseInt(limit)).select("-password");
            if (!user) {
                throw new ApiError(404, 'user not found when we get all users')
            }
            return user;
        },
        getUserById: async(_, {_id}) => {
            const user = await User.findById(_id).select("-password");
            if (!user) {
                throw new ApiError(404, 'user not found when we get user by there id')
            }
            return user;
        },
        userSearch: async(_, {search}) => {
            const user = await User.find({
                $or:[
                    {
                        name:{
                            $regex: search,
                            $options: 'i'
                        },
                        email: {
                            $regex: search,
                            $options: 'i'
                        }
                    }
                ]
            });
            if (!user) {
                throw new ApiError(404, 'user not matching')
            }
            return user;
        }
    },

    Mutation: {
        registerUser: async(_, {name, email, password, phone, profession}) => {
            const user = await User.create({
                name,
                email,
                password,
                phone,
                profession
            });
            if (!user) {
                throw new ApiError(500, 'something is wrong while registering new user')
            }
            return user;
        },
        loginUser: async(_, {email, password}) => {
            const user = await User.findOne({email}).select("+password");
            if (!user || (await user.isPasswordCorrect(password))) {
                throw new ApiError(404, 'Invalid Credentials')
            }
            return user || "Login successful";
        },
        updateUser: async(_, {name, phone, profession}) => {
            const user = await User.findByIdAndUpdate(_id,
                {name, phone, profession},
                {new: true, runValidators: true}
            );
            if (!user) {
                throw new ApiError(404, "User not found for updating")
            }
            return user;
        },
        deleteUser: async(_, {_id}) => {
            const user = await User.findByIdAndDelete(_id);
            if (!user) {
                throw new ApiError(404, "User not found for deleting")
            }
            return user;
        }
    }
};