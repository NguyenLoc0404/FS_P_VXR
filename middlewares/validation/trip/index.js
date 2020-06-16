const validator = require('validator');
const _ = require('lodash');

// const { User } = require('../../../models/user');

module.exports.validateTrip = async (req, res, next) => {
    let errors = {}
    //validate
    const price = _.get(req, 'body.price', '');

    if (validator.isEmpty(price))
        errors.price = 'Price is required'
    else if (!validator.isLength(price, { max: 8 }))
        errors.price = 'Price  must be maximum 8 characters'
    else if (!validator.isNumeric(price))
        errors.price = 'Price must be A Number';

    //lodash check cho array va object
    const isValid = _.isEmpty(errors)
    if (isValid) return next();
    res.status(400).json(errors);
}