require("dotenv").config()
const app = require('./src/app')
const connectDB = require("./src/.config/database")

connectDB();

const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})