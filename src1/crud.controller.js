import { User } from "../src/model/user.model.js";
import { ApiError } from "../src/utils/ApiError.js";
import { ApiResponse } from "../src/utils/ApiResponse.js";
import { asyncHandler } from "../src/utils/asyncHandler.js";


//CURD operations
//create
export const createUser = asyncHandler(async(req, res) => {

    const {name, email, password, phone, profession} = req.body

    const existedUser = await User.findOne({email})
    if (existedUser) {
        throw new ApiError(400, "email already existed")
    }

    const newUser = await User.create({
        name,
        email,
        password,
        phone,
        profession
    })
    if (!newUser) {
        throw new ApiError(500, "something went wrong while created user")
    }

    return res.status(200).json(new ApiResponse(201, newUser, "User created successful"))
})

//read
//getAllUser
export const getAllUser = asyncHandler(async(req, res) => {
    // const id = req.params.id

    //PAGINATION AND SORTING
    const {
        page = 1,
        limit = 10,
        sort = 'asc'
    } = req.query;

    const skip = (page - 1) * limit;
    const options = {
        skip,
        limit,
        sort: sort === 'asc' ? 1 : -1
    }

    const users = await User.find().select("-password").sort(options).skip(skip).limit(parseInt(limit));
    if (!users || users.length === 0) {
        throw new ApiError(404, 'user not found')
    }

    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers/limit); //totalPages = Math.ceil(27 / 10) = 3
    const nextPage = page < totalPages ? page + 1 : null; //nextPage = page < totalPages ? page + 1 : null = 3
    const prevPage = page > 1 ? page - 1 : null; //prevPage = page > 1 ? page - 1 : null = 1


    return res.status(200).json(new ApiResponse(200, users, "All Users list", {
        totalPages,
        nextPage,
        prevPage
        }))
})


//get user ById
export const getUserById = asyncHandler(async(req, res) => {
    const _id = req.params._id;
    const user = await User.findById(_id).select("-password")
    if (!user) {
        throw new ApiError(400, "user not found")
    }
    return res.status(200).json(new ApiResponse(201, user, "User found"))
})

//update
export const updateUser = asyncHandler(async(req, res) => {
    const _id = req.params._id;
    const user = await User.findByIdAndUpdate(_id);
    if (!user) {
        throw new ApiError(404, 'user not found')
    }

    return res.status(200).json(new ApiResponse(201, user, "update user successful"))
})


//delete
export const deleteUser = asyncHandler(async(req, res) => {
    const _id = req.params._id;
    const user = await User.findByIdAndDelete(_id);
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    return res.status(200).json(new ApiResponse(201, user, "user deleted successfully"))
})



//searching
export const userSearch = asyncHandler(async(req, res) => {

    const {search} = req.query;
    if (!search || search.trim() === '') {
        throw new ApiError(400, 'search is required')
    }

    const user = await User.find({
        $or: [
            {
                name: {
                    $regex: search,
                    $options: 'i'
                },
                email: {
                    $regex: search,
                    $options: 'i'
                }
            }
        ]
    })

    if (!user.length) {
        throw new ApiError(404, 'user not found')
    }

    return res.status(200).json(new ApiResponse(201, user, 'Matching user correctly '))
})
