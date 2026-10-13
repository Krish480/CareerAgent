const userModel = require("../models/user.model")
const blackListTokenModel = require("../models/blacklist.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

/**
 * @name registerUserController
 * @description register a new user, expects username, email and password
 * @access Public
 */


const registerUserController = async (req, res) => {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Please provide username, email and password"
        })
    }

    const isUserAlreadyExist = await userModel.findOne({
        $or: [{ email }, { username }]
    })

    if (isUserAlreadyExist) {
        return res.status(400).json({
            message: "Account already exist with this email address or username"
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token)

    res.status(201).json({
        message: "User registered Successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}


/**
 * @name loginUserController
 * @description login a user, expect email and password in the request body
 * @access Public
 */
const loginUserController = async (req, res) => {

    const { email, username, password } = req.body;



    const user = await userModel.findOne({
        $or: [{ email }, { username }]
    })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token)
    res.status(200).json({
        message: "User LoggedIn Successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}

/**
 * @name logOutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access Public
 */
const logOutUserController = async (req, res) => {
    const token = req.cookies.token;

    if (token) {
        await blackListTokenModel.create({ token })
    }

    res.clearCookie("token")

    res.status(200).json({
        message: "User Logout Successfully..!"
    })

}

/**
 * @name getMeController
 * @description get the currunt logged in user details
 * @access private
 */
const getMeController = async (req, res) => {

    const user = await userModel.findById(req.user.id)

    return res.status(200).json({
        message: "User detailes fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email

        }
    })

}

module.exports = { registerUserController, loginUserController, logOutUserController, getMeController }