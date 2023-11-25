const express = require("express")
const app = express()

require("dotenv").config()
const router = express.Router();
const multer = require('multer')
const controller = require("../contollors/contollors_data")
const path = require("path")
const validationSchema = require("../MiddleWear/validationSchema");
const allowedTo = require("../MiddleWear/allowTo");
const userRols = require("../stuats/userRols");
const verfiyToken = require("../MiddleWear/verfiyToken");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Destination folder for uploaded files
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
    //  upload.single('avatar'),
 
    validationSchema(),
    controller.create)

router.route("/:id")
  .get(controller.get_single)
  .patch(
    
     controller.update)
  .delete(
    

 
    controller.delete_one)


module.exports = router;