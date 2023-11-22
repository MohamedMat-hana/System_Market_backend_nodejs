const { validationResult } = require("express-validator")
const Data = require("../modal/SmallFoat_data")
const HttpStuats = require("../stuats/HttpStuats")
const asyncWrapper = require("../MiddleWear/asyncWrapper");

require("dotenv").config()

const url = process.env.MONGO_URL;

const get_all = async (req, res) => {

    const query = req.query;

    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    // get data fron DB
    let Data_ofMongo = await Data.find({}, { "__v": false }).limit(limit).skip(skip);
    res.json({ status: HttpStuats.SUCCESS, data: { dataOfBack: Data_ofMongo } })
}

const get_single = async (req, res) => {


    try {
        const DataOfSingle = await Data.findById(req.params.id)
        if (!DataOfSingle) {
            return res.status(404).json({ status: HttpStuats.FAIL, data: { DataOfSingle } })
        }

        return res.json({ status: HttpStuats.SUCCESS, data: { DataOfSingle } })


    }
    catch (err) {
        return res.status(400).send({
            status: HttpStuats.ERROR,
            data: null,
            code: 400,
            message: err.message
        })
    }

}

const create = asyncWrapper(async (req, res) => {
    // console.log(req.body);
    console.log(req.headers);
    console.log(req.file);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: HttpStuats.FAIL,
            data: errors.array()
        })
    }

    const imageUrl = `https://market-app-server.onrender.com/api/SmallFoat/upload/${req.file.filename}`;

    const newData = await new Data(
        {
            name: req.body.name,
            price: req.body.price,
            avatar: imageUrl
        }
    );
    await newData.save()
    res.status(201).json({
        status: HttpStuats.SUCCESS,
        data: newData
    })
})

const update = async (req, res) => {
    try {
        const course = await Data.updateOne({ _id: req.params.id }, { $set: { ...req.body } })
        return res.status(200).json({
            status: HttpStuats.SUCCESS,
            data: course
        })
    }
    catch (err) {
        return res.status(400).json({
            status: HttpStuats.ERROR,
            data: null,
            code: 400,
            message: err.message
        })
    }
}

const delete_one = async (req, res) => {
    const DataToDelete = await Data.deleteOne({ _id: req.params.id })

    res.status(200).json({ status: HttpStuats.SUCCESS, data: null })
}

module.exports = { get_all, get_single, create, update, delete_one };