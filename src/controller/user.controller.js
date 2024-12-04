import { ApiError } from "../config/ApiError.js";
import { ApiResponse } from "../config/ApiResponse.js";
import { asyncHandler } from "../config/asyncHandler.js";
import { User } from "../model/user.model.js";


//generate token function-backend
const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}



//registerUser function-backend
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, phone, profession, comment } = req.body;

    //validation - check
    if (
        [name, email, password, phone, profession, comment].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    //check user is existed or not
    const existedUser = await User.findOne({
        $or: [{ name }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exist.")
    }


    //create new user
    const user = await User.create({
        name: name.toLowerCase(),
        email,
        password,
        phone,
        profession,
        comment
    })

    //remove password and refreshToken from the create user
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    //return a success response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
});



//loginUser function-backend
const loginUser = asyncHandler(async (req, res) => {

    //extract login credinatials from the body
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "email or password is required")
    }

    //find user
    const user = await User.findOne({ email }).select("+password")

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    //compare provided password and stored one
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user Credentials")
    }

    //generate refreshToken and AccessToken
    const { accessToken, refreshToken } = await
        generateAccessTokenAndRefreshToken(user._id)


    //retrive user info without sensitive feilds
    const loggedInUser = await User.findById(user._id).
        select(" -refreshToken")

    //there's are the cookie settings
    const options = {
        httpOnly: true,
        secure: true
    }

    //return a success response
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200,
                {
                    // user: accessToken,
                    // refreshToken
                },
                "User logged in successfully"
            )
        )
});


//get all user
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find()
        .select("-password -refreshToken");

    return res.status(200)
        .json(new ApiResponse(200,
            users,
            "Users fetched successfully"));
});


// Update user function
const updateUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { name, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId,
        {
            name,
            phone
        },
        {
            new: true,
            runValidators: true
        }).select("-password -refreshToken");

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200)
        .json(new ApiResponse(200,
            updatedUser,
            "User updated successfully"));
});



// Delete user
const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(400, "User ID is required for deletion");
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, null, "User deleted successfully")
    );
});




export {
    deleteUser, generateAccessTokenAndRefreshToken, getAllUsers, loginUser,
    registerUser, updateUser
};