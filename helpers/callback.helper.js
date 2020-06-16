const jwt = require('jsonwebtoken');
const { promisify } = require("util");
//const _ = require('lodash');
module.exports.jwtVerify = promisify(jwt.verify);
module.exports.jwtSigner = promisify(jwt.sign);
//module.exports._ = { jwt };