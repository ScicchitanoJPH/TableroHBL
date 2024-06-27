const { check,validationResult } = require("express-validator") ;

const validateLoginData = [
    check("email")
        .isEmail()
        .withMessage("Enter a valid email address")
        .normalizeEmail(),
    check("password")
        .notEmpty(),
        
    (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let error = {};
        errors.array().map((err) => (error[err.param] = err.msg));
        return res.status(422).json({ error });
    }
    next();
}];
const validateRegisterData = [
    check("email")
        .notEmpty()
        .isEmail()
        .withMessage("Enter a valid email address")
        .normalizeEmail(),
    check("name")
        .not()
        .isEmpty()
        .withMessage("You name is required")
        .trim()
        .escape(),
    check("password")
        .notEmpty()
        .isLength({ min: 4 })
        .withMessage("Must be at least 4 chars long"), 
    (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let error = {};
        errors.array().map((err) => (error[err.param] = err.msg));
        return res.status(422).json({ error });
    }
    next();
}];
module.exports =  {validateLoginData,validateRegisterData};