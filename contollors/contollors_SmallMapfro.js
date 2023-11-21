// let { dataofarray } = require("../data/data")
const { validationResult } = require("express-validator")
const Data = require("../modal/SmallMaphro_data")
const HttpStuats = require("../stuats/HttpStuats")
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

const create = async (req, res) => {
    console.log(req.file);
    console.log(req.headers);
 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: HttpStuats.FAIL,
            data: errors.array()
        })
    }     
    //    console.log(req.file.filename);

    const imageUrl = `https://market-app-server.onrender.com/api/SmallMaphro/upload/${req.file.filename}`;

    const newData = new Data(
        {
            name: req.body.name,
            price: req.body.price,
            avatar: imageUrl
        }
    );
    // exports.uploadImage = (req, res) => {
    //     if (!req.file) {
    //         return res.status(400).json({ error: 'No file uploaded' });
    //     }

    //     // File uploaded successfully

    //     // Create a new document in the DataModal collection with the image URL
    //     DataModal.create({ avatar: imageUrl })
    //         .then(data => res.json({ imageUrl: imageUrl }))
    //         .catch(error => res.status(500).json({ error: 'Internal Server Error' }));
    // };
    await newData.save()
    res.status(201).json({
        status: HttpStuats.SUCCESS,
        data: newData
    })
}

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
    // const id = +req.params.id;
    // dataofarray = dataofarray.filter((dataofarray) => {
    //     return dataofarray.id != id

    // })
    // res.status(200).json({ status: HttpStuats.SUCCESS, data: null })
    const DataToDelete = await Data.deleteOne({ _id: req.params.id })

    res.status(200).json({ status: HttpStuats.SUCCESS, data: null })
}

module.exports = { get_all, get_single, create, update, delete_one };