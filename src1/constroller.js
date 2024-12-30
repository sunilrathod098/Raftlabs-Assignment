import { User } from "../src/model/user.model.js";
import { ApiError } from "../src/utils/ApiError.js";
import { ApiResponse } from "../src/utils/ApiResponse.js";
import { asyncHandler } from "../src/utils/asyncHandler.js";


export const generatedAccessToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        await user.save({ validateBeforeSave: false })
        return { accessToken }
    } catch{
        throw new ApiError(400, "Error generating access token")
    }
}

export const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password, phone, profession} = req.body;

    const userExits = await User.findOne({
        $or: [{email}, {name}]
})
    if (userExits) {
        throw new ApiError(400, "user already existed")
    }

    const newUser = await User.create({
        name,
        email,
        password,
        phone,
        profession
    })

    const userCreated = await User.findById(newUser._id).select("-password")
    if (!userCreated) {
        throw new ApiError(500, "something wrong while registering new user")
    }

    return res.status(200)
    .json(new ApiResponse(200, userCreated, "user registered successfully"))
})


export const loginUser = asyncHandler(async(req, res) => {

    const {email, password} = req.body;
    if (!email || !password) {
        throw new ApiError(400, "email and password is required")
    }
    const user = await User.findOne({email})
    if (!user) {
        throw new ApiError(404, "user not found")
    }

    const isPasswordMatch = await user.isPasswordCorrect(password)
    if (!isPasswordMatch) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const { accessToken } = await generatedAccessToken(user._id)
    const userLogged = User.findById(user.id)
    if (!userLogged) {
        throw new ApiError(500, "something wrong while logging user")
    }

    return res.status(201)
    .cookie('accessToken', accessToken)
    .json(new ApiResponse(200, userLogged, "user logged successfully"))
})



