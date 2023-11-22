const express = require("express")
const app = express()

require("dotenv").config()
const router = express.Router();
const multer = require('multer')
const controller = require("../contollors/contollors_SmallMapfro")
const path = require("path")
const validationSchema = require("../MiddleWear/validationSchema");
const allowTo = require("../MiddleWear/allowTo");
const userRols = require("../stuats/userRols");
const verfiyToken = require("../MiddleWear/verfiyToken");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload/'); // Destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`); // File naming convention
  },
});

const upload = multer({ storage: storage });

// Serve static files from the 'uploads' folder
router.route("/")
  .get(controller.get_all)
  .post(
    verfiyToken,
    upload.single('avatar'),
    allowTo(userRols.ADMIN, userRols.MANGER),

    validationSchema(),
    controller.create)

router.route("/:id")
  .get(controller.get_single)
  .patch(
    verfiyToken,

    allowTo(userRols.ADMIN, userRols.MANGER),
    controller.update)
  .delete(
    verfiyToken,
    allowTo(userRols.ADMIN, userRols.MANGER),

    controller.delete_one)


module.exports = router;