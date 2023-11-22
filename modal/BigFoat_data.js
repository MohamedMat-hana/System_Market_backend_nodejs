const mongoose = require("mongoose")

const dataModalBigFoat = new mongoose.Schema(
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

module.exports = mongoose.model("dataModalBigFoat", dataModalBigFoat);