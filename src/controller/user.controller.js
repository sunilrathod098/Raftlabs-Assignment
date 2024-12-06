import { body, check, validationResult } from "express-validator"
import { User } from "../model/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import logger from "../utils/logger.js"


//generate token here
const generateAccessTokenAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave : false})
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens.")
    }
}



//registerUser controller
const registerUser = asyncHandler(async (req, res) => {

    if (!req.body || Object.keys(req.body).length === 0) {
        throw new ApiError(400, "Request body is missing or empty")
    }

    //check and validation

    check("name").notEmpty().withMessage("Name is required").run(req);
    check("email").isEmail().withMessage("Email is required").run(req);
    check("password").isLength({ min: 8 }).withMessage("Password must be at least 8 character long").run(req);
    check("phone").isMobilePhone().withMessage("Invalid phone number").run(req);
    check("profession").notEmpty().withMessage("Profession is required").run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error("Validation error: ", errors.array()) // Log errors
        throw new ApiError(400, "Validation failed", errors.array())
    }

    const { name, email, password, phone, profession } = req.body;

    //check here user is already exists or not?
    const existedUser = await User.findOne({
        $or: [{ email }, { name }]
    });

    if (existedUser) {
        logger.error("Conflict: User already exists with this email or name.");
        throw new ApiError(409, "User with this email or name already exists")
    }

    //create a newUser
    const user = await User.create({
        name: name.toLowerCase(),
        email,
        password,
        phone,
        profession,
    })

    //we fetch createUser
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering new user.")
    }

    return res.status(201).json(
        new ApiResponse(
            200,
            createdUser,
            "User registered successfully")
    )
});


//loginUser controller
const loginUser = asyncHandler(async (req, res) => {

    if (!req.body || Object.keys(req.body).length === 0) {
        throw new ApiError(400, "Request body is missing or empty")
    }
    //check and validation
    check("email").isEmail().withMessage("Email is required").run(req);
    check("password").isLength({ min: 8 }).withMessage("Password must be at least 8 character long").run(req);

    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400,"Email and password are required to login.")
    }

    const user = await User.findOne({email}).select("+password")
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }
    
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user.id).select("-refreshToken")
        if (!loggedInUser) {
            throw new ApiError(500, "Something went wrong while login user.")
        }

        return res.status(201)
            .cookie("accessToken", accessToken)
            .cookie("refreshToken", refreshToken)
            .json(
                new ApiResponse(
                    200,
                    "User logged successfully"
                )
            )
});


// CRUD operations is perform on user Create, Read, Update, Delete.
//get all users
const getAllUsers = asyncHandler(async (req, res) => {

    //Pagination and Sorting user data
    const {
        page = 1,
        limit = 10,
        sort = 'asc'
    } = req.query;

    const skip = ( page - 1 ) * limit;

    const users = await User.find()
    .select("-password -refreshToken")
    .sort({ createdAt: sort === 'asc' ? 1 : -1})
    .skip(skip)
    .limit(parseInt(limit));

    if (!users || users.length === 0) {
        throw new ApiError(404, "Users are not found")
    }

    //here count total user form metadata i.e in docs
    const totalUsers = await User.countDocuments();

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            {
                totalUsers,
                totalPages : Math.ceil(totalUsers / limit),
                currentPage: parseInt(page),
                users
            },
            "All users fetched successfully" ));
});



//getUserById
const getUserById = asyncHandler(async (req, res) => {
    check("_id").isMongoId().withMessage("Invalid user Id").run(req);
    
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new ApiError(400, "Validation Failed", errors.array())
    }

    const user = await User.findById(req.params._id).select("-password")
    if (!user) {
        throw new ApiError(400, "User not found")
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "User fetched successfully")
        );
});


//update user
const updateUser = asyncHandler(async (req, res) => {
    check("_id").isMongoId().withMessage("Invalid user Id").run(req),
    check("name").optional().notEmpty().withMessage("Name cannot be empty").run(req),
    check("phone").optional().isMobilePhone().withMessage("Invalid phone number").run(req),
    check("profession").optional().notEmpty().withMessage("Profession cannot be empty").run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, "validation failed", errors.array())
    }

    const { name, phone, profession } = req.body;
    const user = await User.findByIdAndUpdate(
        req.params._id,
        {
            name,
            phone,
            profession
        },
        {
            new: true,
            runValidators: true
        });

        if (!user) {
            throw new ApiError(404, "User not found")
        }

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "User updated successfully"));
});


//Delete User
const deleteUser = asyncHandler(async (req, res) => {
    check("_id").isMongoId().withMessage("Invalid user Id").run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, "Validation failed", errors.array());
    }

    const user = await User.findByIdAndDelete(req.params._id);
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            null,
            "User deleted successfully" ));
});

//Search and filter from user data
const SearchUser = asyncHandler(async (req, res) => {
    const { search } = req.query;
    if (!search || search.trim() === "") {
        throw new ApiError(400, "Search query is required")
    }

    const users = await User.find({
        $or: [
            {
                name:{
                    $regex: search,
                    $options: 'i'
                }
            },
            {
                email:{
                    $regex: search,
                    $options: 'i'
                }
            }
    ]});
    
    if (!users.length) {
        throw new ApiError(404, "No matching users found")
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            users,
            "Matching users fetched successfully" ));
});


export {
    generateAccessTokenAndRefreshToken,
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    SearchUser
}
