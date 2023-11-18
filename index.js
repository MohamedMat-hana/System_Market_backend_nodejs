const express = require("express")
const mongoose = require("mongoose")
const cors = require('cors')
const path = require("path")
const HttpStuats = require("./stuats/HttpStuats")

 require("dotenv").config()

const app = express()
// console.log(process.env.MONGO_URL);
const url =process.env.MONGO_URL;


mongoose.connect(url).then(()=>{
    console.log('connected to db')
    console.log(process.env.MONGO_URL)
})

// app.use("/upload",express.static(path.join(__dirname,"Uploads")))
app.use(express.json()) // for parsing application/json
app.use(cors()) // for parsing application/json

const router_data=require("./Router/code_router")
 
app.use("/api/data",router_data) 
app.use('/api/data/uploads', express.static('uploads'));
app.all("*",(req,res,next)=>{
    return res.status(404).json({ status: HttpStuats.ERROR, resorse:"NOT FOUND" })

})
app.use(cors())

// global error handler
app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({status: error.statusText || HttpStuats.ERROR, message: error.message, code: error.statusCode || 500, data: null});
})

app.listen(process.env.PORT||5000, () => {
    console.log('Server is running on port 5000')
})