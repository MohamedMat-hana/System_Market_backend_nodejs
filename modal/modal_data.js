const mongoose = require("mongoose")

const dataModal = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        avatar:{
            type:String,
            required: true
        }


    }
)

module.exports = mongoose.model("Data_Modal", dataModal);