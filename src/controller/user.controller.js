import { ApiError } from "./utils/ApiError.js"
import { ApiResponse } from "./utils/ApiResponse.js"
import { asyncHandler } from "./utils/asyncHandler.js"
import { User } from "./model/user.model.js"


const generateAccessTokenAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken
        user.save({ validateBeforeSave : false})
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens.")
    }
}



//registerUser
const registerUser = asyncHandler( async (res, req) => {
    const { name, email, password, phone, profession } = req.body;

    //check validation 
    if ([ name, email, password, phone, profession].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }
})
