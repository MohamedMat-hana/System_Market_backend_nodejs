const express = require("express");

const router = express.Router();
const AppError = require("../stuats/AppError");
const contollors_user = require("../contollors/contollors_user")
const verfiyToken = require("../MiddleWear/verfiyToken");

router.route("/")
    .get( contollors_user.get)

router.route("/reqister")
    .post(contollors_user.reqister)

router.route("/login")
    .post(contollors_user.login)




module.exports =router;