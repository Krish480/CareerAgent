const jwt = require("jsonwebtoken")

const authUser = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return  res.status(400).json({
            message: "Token not provided"
        })
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded;

        next()

    }
    catch (err) {
        return res.status(400).json({
            message: "Invalid Token"
        })
    }

}


module.exports = { authUser };