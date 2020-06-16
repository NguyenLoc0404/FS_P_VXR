const validator = require('validator');
//co the dung JOI thay the validator
const _ = require('lodash');

module.exports.validateTicket = async (req, res, next) => {
    let errors = {}
    //validate
    const email = _.get(req, 'body.email', '');
    const password = _.get(req, 'body.password', '');
    const password2 = _.get(req, 'body.password2', '');
    const fullName = _.get(req, 'body.fullName', '');

    // email rổng => error.email = "Email is required"
    // email  ton tai  => error.email = "Email is exist"
    // email co dung dinh dang hay ko ===> "email is invalid"
    // email hop le ===> pass qua
    if (validator.isEmpty(email))
        errors.email = 'Email is required'
    else {
        const user = await User.findOne({ email });
        if (user)
            errors.email = 'Email exist';
        else if (!validator.isEmail(email))
            errors.email = 'Email is invalid'
    }


    //password
    if (validator.isEmpty(password))
        errors.password = 'password is required'
    else if (!validator.isLength(password, { min: 8 }))
        errors.password = 'password  must be at least 8 characters'

    //password2
    if (validator.isEmpty(password2))
        errors.password2 = 'cormfirm password is required'
    else if (!validator.equals(password, password2))
        errors.password2 = 'password not match'


    //fullName
    if (validator.isEmpty(fullName))
        errors.fullName = 'fullName is required'


    //lodash check cho array va object
    const isValid = _.isEmpty(errors)
    if (isValid) return next();
    res.status(400).json(errors);

}