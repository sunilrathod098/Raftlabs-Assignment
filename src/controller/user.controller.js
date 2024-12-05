import { check, validationResult } from "express-validator"
import { User } from "../model/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import logger from "../utils/logger.js"


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






export {
    generateAccessTokenAndRefreshToken,
    registerUser
}
