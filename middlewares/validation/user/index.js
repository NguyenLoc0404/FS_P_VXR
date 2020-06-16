const validator = require('validator');
//co the dung JOI thay the validator
const _ = require('lodash');

const { User } = require('../../../models/user');

//đầu tiên tạo ra 1 object error trước
//mỗi lần có lỗi thêm phần tử vào trong object error
//cuối cùng return 1 object , trong dó có thuộc tính isValid
// nếu object error = rỗng , isValid = true
//nếu object error = có giá trị , isValid = false

//input: email, password, password2 , fullname
//email ( frontend ko tra ve| undifined) => email = " "
module.exports.validateCreateUser = async (req, res, next) => {
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

module.exports.validateUpdateUser = async (req, res, next) => {
    let errors = {}
    //validate
    const email = _.get(req, 'body.email', '');
    const fullName = _.get(req, 'body.fullName', '');

    //email
    if (validator.isEmpty(email))
        errors.email = 'Email is required'
    else {
        const user = await User.findOne({ email });
        if (user)
            errors.email = 'Email exist';
        else if (!validator.isEmail(email))
            errors.email = 'Email is invalid'

        //fullName
        if (validator.isEmpty(fullName))
            errors.fullName = 'fullName is required'
    }

    const isValid = _.isEmpty(errors)
    if (isValid) return next();
    res.status(400).json(errors);
}

module.exports.validateUpdatePassWord = async (req, res, next) => {
    let errors = {}
    //validate
    const password = _.get(req, 'body.password', '');
    const password2 = _.get(req, 'body.password2', '');

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

    const isValid = _.isEmpty(errors)
    if (isValid) return next();
    res.status(400).json(errors);
}

