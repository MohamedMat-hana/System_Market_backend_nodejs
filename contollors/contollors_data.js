let { dataofarray } = require("../data/data")
const { validationResult } = require("express-validator")
const Data = require("../modal/modal_data")
const HttpStuats = require("../stuats/HttpStuats")
const asyncWrapper = require("../MiddleWear/asyncWrapper");

require("dotenv").config()
const multer = require('multer')
const path = require("path")

const url = process.env.MONGO_URL;

const get_all = async (req, res) => {
    // console.log(req.body);

    const query = req.query;

    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    // get data fron DB
    let Data_ofMongo = await Data.find({}, { "__v": false }).limit(limit).skip(skip);
    res.json({ status: HttpStuats.SUCCESS, data: { dataOfBack: Data_ofMongo } })
}

const get_single = async (req, res) => {
    // const id = +req.params.id;
    // const Data = dataofarray.find((data) => data.id == id)
    // res.json(Data)
    // if (!Data) {
    //     return res.status(404).json({ status: HttpStuats.FAIL, msg: "Data not found" })
    // }

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

const create = asyncWrapper(async (req, res ) => {
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
    
    const imageUrl = `https://system-market-backend-nodejs-womc.vercel.app/api/data/uploads/${req.file.filename}`;

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

    // const id = +req.params.id;
    // // console.log(id);
    // let data = dataofarray.find((Data) =>   Data.id == id  )
    // console.log(data);
    // if (!data) {
    //     return res.status(404).json({ data: data, status: HttpStuats.FAIL, msg: "Data not found" })
    // }
    // data = { ...data, ...req.body }

    // res.status(201).json({
    //     status: HttpStuats.SUCCESS,
    //     data: data
    // })



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
    // const id = +req.params.id;
    // dataofarray = dataofarray.filter((dataofarray) => {
    //     return dataofarray.id != id

    // })
    // res.status(200).json({ status: HttpStuats.SUCCESS, data: null })
    const DataToDelete = await Data.deleteOne({ _id: req.params.id })

    res.status(200).json({ status: HttpStuats.SUCCESS, data: null })
}

module.exports = { get_all, get_single, create, update, delete_one };