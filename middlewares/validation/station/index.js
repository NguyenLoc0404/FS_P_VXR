const validator = require('validator');
const _ = require('lodash');

module.exports.validateStation = async (req, res, next) => {
    let errors = {}
    //validate
    const name = _.get(req, 'body.name', '');
    const address = _.get(req, 'body.address', '');
    const description = _.get(req, 'body.description', '');
    const province = _.get(req, 'body.province', '');


    if (validator.isEmpty(name))
        errors.name = 'Name is required'
    else if (!validator.isLength(name, { min: 5 }))
        errors.name = 'Name  must be at least 5 characters'
    
    if (validator.isEmpty(address))
        errors.address = 'Address is required'
    else if (!validator.isLength(address, { min: 8 }))
        errors.address = 'Address  must be at least 8 characters'

   
    if (validator.isEmpty(description))
        errors.description = 'Description  is required'
    else if (!validator.isLength(description, { min: 10 }))
        errors.description = 'Description  must be at least 10 characters'

    if (validator.isEmpty(province))
        errors.province = 'Province is required'
    else if (!validator.isLength(province, { min: 4 }))
        errors.province = 'Province  must be at least 4 characters'

    //lodash check cho array va object
    const isValid = _.isEmpty(errors)
    if (isValid) return next();
    res.status(400).json(errors);

}
