const express = require("express")

const router = express.Router();
const multer = require('multer')
const controller = require("../contollors/contollors_data")

const validationSchema = require("../MiddleWear/validationSchema");
const diskStorage1 = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("FILE", file);
        cb(null, "uploads")
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split("/")[1];
        const filename = Date.now() + '.' + ext
        cb(null, filename)
    }

})
const fileFilter = function (req, file, cb)  {

    const Image = file.mimetype.split("/")[0];
    if (Image == "image") {
        cb(null, file)
    }
    else {
        cb(AppError.create("file must be an image", 400), false)
    }
}
const upload = multer({
     storage: diskStorage1,
     fileFilter:fileFilter})


 router.route("/")
    .get(controller.get_all)
    .post(upload.single('avatar'),
         validationSchema(),
        controller.create)

router.route("/:id")
    .get(controller.get_single)
    .patch(controller.update)
    .delete(
         controller.delete_one)


module.exports = router;