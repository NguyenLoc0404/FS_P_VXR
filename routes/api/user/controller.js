const { User } = require('../../../models/user');
const bcrypt = require("bcryptjs");
const _ = require('lodash');
const { jwtSigner } = require('../../../helpers/callback.helper');
const config = require('../../../config');
module.exports.getUsers = (req, res, next) => {
    User.find()
        .then((users) => {
            res.status(200).json(users)
        })
        .catch((err) => res.status(500).json(err))
}
module.exports.getUsersById = (req, res, next) => {
    const { id } = req.params;
    User.findById(id)
        .then(user => {
            if (!user) return Promise.reject({ message: 'User not found' })
            res.status(200).json(user)

        }).catch(err => res.status(500).json(err))
}


// module.exports.postUser = async (req, res, next) => {

//     let { email, fullName, userType, password } = req.body;

//     const hashPassword = await bcrypt.hash(password, 10);

//     User.create({
//         email, password: hashPassword, fullName, userType
//     }).then(user => res.status(201).json(user))
//         .catch(err => res.status(500).json(err));
// }


module.exports.postUserWithVal = (req, res, next) => {
    const { email, fullName, password } = req.body;
    User.create({
        email, fullName, password
    }).then(station => res.status(201).json(station))
        .catch(err => res.status(500).json(err));
}

module.exports.postUser = (req, res, next) => {
    const { email, fullName, password } = req.body;
    //console.log(password);
    let newUser;
    User.findOne({ email })
        .then(user => {
            if (user) return Promise.reject({ message: 'Email Exists' })
            newUser = new User({ email, fullName, password })
            return newUser.save()
        })
        .then(user => res.status(201).json(user))
        .catch(err => res.status(500).json(err));

    //vì quá trình gensalt và hash password đều là quá trình bất đồng bộ mà
    //khi nó nhảy vô thằng gensalt với bcrypt
    //thì nó cũng đã chạy đồng thời thằng new User () ở đưới
    //lúc đó pw chưa dc hash

}

module.exports.deleteUser = (req, res, next) => {
    console.log("vao deleteUser");
    const { id } = req.params;
    User.findByIdAndDelete(id).
        then(user => {
            if (!user) return Promise.reject({ message: 'User not found' })
            res.status(200).json({ message: 'User successfully deleted' })
        })
        .catch(err => res.status(500).json(err))
}

module.exports.putUserById = (req, res, next) => {
    const { id } = req.params;
    const { email, fullName } = req.body;
    User.findOne({ email })
        .then(user => {
            return User.findById(id)
                .then(user => {
                    Object.keys(req.body).forEach(key => {
                        user[key] = req.body[key];
                    })
                    return user.save()
                })
                .then(user => res.status(201).json(user))
        })
        .catch(err => { res.status(500).json(err) })
}

module.exports.updatePWById = (req, res, next) => {
    console.log('----------------------');
    console.log("vao patch");
    // console.log("req.params = " + req.params);
    // console.log("req.body = " + req.body);
    const { id } = req.params;
    const { password } = req.body;
    console.log("password body = " + password);
    console.log("id = " + id);
    User.findById(id)
        .then(async user => {
            if (!user) return Promise.reject({ message: 'User not found' })
            const compare = await bcrypt.compare(password, user.password);
            console.log("compare = " + compare);
            if (!compare) {
                user.password = password;
            }

            return user.save();
        })
        .then(user => res.status(200).json(user))
        .catch(err => res.status(500).json(err))
}

//login 
//1.sosanh password 
//2. cap token

module.exports.login = (req, res, next) => {
    const { email, password } = req.body;
    //find , findOne, findById
    let user;
    User.findOne({ email })
        .then((_user) => {
            user = _user;
            if (!user) return Promise.reject({ message: 'email not found' })
            return bcrypt.compare(password, user.password)
        })
        .then(isMatch => {
            if (!isMatch) return Promise.reject({ message: 'Wrong Password' })

            //  const payload = { 
            //      email , 
            //      userType:user.userType , 
            //      fullName: user.FullName
            //  }

            const payload = _.pick(user, ['_id', 'email', 'userType', 'fullName'])
            console.log(payload);
            //header tự có, payload, signaturesign , secrect key
            return jwtSigner(
                payload,
                //"Cybersoft2020",
                config.SECRET_KEY,
                { expiresIn: '4h' }
            )
            //  res.status(200).json({message: 'login successfully'})
        })
        .then(token => res.status(200).json({
            message: 'token successfully',
            token
        }))
        .catch(err => res.status(500).json(err))
}

module.exports.UploadAvatar = (req, res, next) => {
    if(_.isEmpty(req.file))
    return res.status(400).json({message: 'File is error'});
    console.log(req.file);
    console.log("vo api update avatar")
    const { _id } = req.user;
    User.findById(_id)
        .then(user => {
            if (!user) return Promise.reject({ message: "User not found" })

            user.avatar = req.file.path;
            return user.save()
        })
        .then(user => res.status(200).json(user))
        .catch(err => res.status(500).json(err))

}

module.exports.MultiFile = (req, res, next) => {

    const { _id } = req.user;
    //console.log(req,33333);
    User.findById(_id)
        .then(user => {
            const arrayTemp = [];
            req.files.map(item => {
                arrayTemp.push(item);
                //user.avatar.push(item);
            })
            user.avatar = arrayTemp;
            return user.save()
        })
        .then(user => res.status(201).json(user))
        .catch(err => res.status(500).json(err));
}

//validator có thê dùng Joi