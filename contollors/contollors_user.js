const asyncWrapper = require("../MiddleWear/asyncWrapper");
const user = require("../modal/User_model");
const HttpStuats = require("../stuats/HttpStuats")
const appError = require("../stuats/AppError");
 const jwt = require('jsonwebtoken');
const genarateJWT = require("../stuats/genarateJWT");

const get = asyncWrapper(async (req, res) => {
    const query = req.query;

    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    // get data fron DB
    let users = await user.find({}, { "__v": false, "password": false }).limit(limit).skip(skip);
    res.json({ status: HttpStuats.SUCCESS, data: { users } })

    // const user = await user.findById(req.params.id);
    // res.status(200).json(user);    
})


const reqister = asyncWrapper(async (req, res, next) => {
    console.log(req.file);


    const { firstName,
        lastName,
        email,
        password,
        role
    } = req.body;


    const oldUser = await user.findOne({ email: email })
    if (oldUser) {
        const error = appError.create('Email is already exist', 400, HttpStuats.FAIL)
        return next(error);
    } 
       console.log('Before bcrypt.hash');

    // const hashedPassowrd = await bcrypt.hash(password, 10)
    console.log('After bcrypt.hash');
    const newUser = new user({
        firstName:firstName,
        lastName:lastName,
        email:email,
        password:password,
        role:role,
    });
    const validationError = newUser.validateSync();

    if (validationError) {
        // Handle validation error
        return res.status(400).json({ status: 'error', message: validationError.message });
    }
    
    // Save the user
    // create JWT Token
    console.log('Before generateJWT');
    const token = await genarateJWT({
        _id: newUser._id,
        email: newUser.email,
        role: newUser.role,
    })
    console.log('After generateJWT');


    newUser.token = token;


    await newUser.save();
    res.status(201).json({ status: HttpStuats.SUCCESS, data: { newUser } })

})

// login

const login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email) {
        const error = appError.create('Please provide email', 400, HttpStuats.FAIL)
        return next(error);

    }
    if (!password) {
        const error = appError.create('Please provide password', 400, HttpStuats.FAIL)
        return next(error);
    }
    const User = await user.findOne({ email: email })
    if (!User) {
        const error = appError.create('user is not exist', 400, HttpStuats.FAIL)
        return next(error);
    }

    // const mathchedpassword = await bcrypt.compare(password, User.password)
    // console.log(mathchedpassword);
    // "logged in success" 
    if (User && password) {
        const token = await genarateJWT({ _id: User._id, email: User.email, role: User.role })

        return res.json({ status: HttpStuats.SUCCESS, data: { token } })
    }
    else {
        const error = appError.create('Something is wrong', 500, HttpStuats.ERROR)
        return next(error);
    }

})


module.exports = {
    get,
    reqister,
    login
}