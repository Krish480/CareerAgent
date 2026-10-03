const mongoose = require("mongoose")

const blackListTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required to be added in blacklist"]
    },
}, {
    timestamps: true
})

const blackListTokenModel = mongoose.model("blacklistTokens", blackListTokenSchema)

module.exports = blackListTokenModel;