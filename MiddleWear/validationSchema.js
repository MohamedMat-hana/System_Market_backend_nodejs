const { body } = require("express-validator")

const validationSchema = () => {
    return [
        body('name')
            .notEmpty()
            .withMessage("name is required")
            .isLength({min: 2})
            .withMessage("name at least is 2 digits"),
        body('price')
            .notEmpty()
            .withMessage("price is required")
    
    ] 
}

module.exports = validationSchema
 