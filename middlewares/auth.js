const { jwtVerify } = require("../helpers/callback.helper");
const config = require('./../config');
module.exports.authenticate = (req, res, next) => {
    // token ( header/quering)
    console.log("vao authenticate BE");
    //console.log(req.header);
    const token = req.header("token");
    console.log(token);
    console.log("===============================");
    if (!token)   res.status(401).json({
        message: "you must provide a token"
    })

    //jwtVerify(token, "Cybersoft2020")

    jwtVerify(token, config.SECRET_KEY)
        .then(decoded => {
            if (decoded) {
                //tạo ra đối tượng user trong req , mang nó xuống authorize
                req.user = decoded;
                return next()
            }

            return res.status(200).json({ message: "token is invalid" })
        })
        .catch(err => res.status(500).json(err))
}
// phan biet: client & admin
// authorize(["admin"]) ==> chi cho admin
// authorize(["client"]) ==> chi cho client
// authorize(["admin", "client"]) ==> chi cho client
module.exports.authorize = (userTypeArray) =>
    (req, res, next) => {
        //console.log(req);
        const { userType } = req.user;
       // console.log(userType);
        const index = userTypeArray.findIndex(e => e === userType);
        //console.log(index);
        if (index > -1) return next();
        res.status(403).json({ message: "You are not allowed to access" })
    }
