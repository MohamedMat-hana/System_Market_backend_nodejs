const mongoose = require("mongoose")

const SmallMapfro_data = new mongoose.Schema(
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

module.exports = mongoose.model("SmallMapfro_data", SmallMapfro_data);