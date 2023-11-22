const express = require("express")
const app = express()

const mongoose = require("mongoose")
const cors = require('cors')
const path = require("path")
const HttpStuats = require("./stuats/HttpStuats")

require("dotenv").config()

app.use(express.json()) // for parsing application/json

// console.log(process.env.MONGO_URL);
const url = process.env.MONGO_URL;


mongoose.connect(url).then(() => {
    console.log('connected to db')
    console.log(process.env.MONGO_URL)
})

// Serve static files from the 'uploads' folder

app.use("/upload", express.static(path.join(__dirname, "uploads")))
app.use(cors()) // for parsing application/json

const router_data = require("./Router/code_router")

app.use("/api/data", router_data)

const SmallMaphro_router = require("./Router/SmallMaphro_router")

app.use("/api/SmallMaphro", SmallMaphro_router)

const BigFoat = require("./Router/BigFoat_router")

app.use("/api/BigFoat", BigFoat)

const SmallFoat = require("./Router/SmallFoat_router")

app.use("/api/SmallFoat", SmallFoat)


app.use('/api/data/uploads', express.static('uploads'));
app.use('/api/SmallMaphro/upload', express.static('upload'));
app.use('/api/BigFoat/upload', express.static('upload'));
app.use('/api/SmallFoat/upload', express.static('upload'));

// SmallFoat
app.all("*", (req, res, next) => {
    return res.status(404).json({ status: HttpStuats.ERROR, resorse: "NOT FOUND" })

})
app.use(cors())

// global error handler
app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({ status: error.statusText || HttpStuats.ERROR, message: error.message, code: error.statusCode || 500, data: null });
})

app.listen(process.env.PORT || 5000, () => {
    console.log('Server is running on port 5000')
})