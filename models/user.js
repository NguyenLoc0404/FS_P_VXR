const mongoose = require('mongoose');
const { promisify } = require("util");
const bcrypt = require("bcryptjs");

const genSaltPromise = promisify(bcrypt.genSalt);
const hashPromise = promisify(bcrypt.hash);

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    userType: { type: String, default: 'client' },
    avatar: { type: String } ,
    totalTickets: Number,
});
//cái dòng UserSchema.pre("save") là kiểu DP observer đó
//kiểu như nó đăng ký lắng nghe sự kiện "save"
//như vậy khi có 1 user được "save" thì nó chạy qua cái hàm này
//anh cũng có thể hình dung nó như lifecycle vậy
//khi 1 document được save thì nó sẽ chạy qua những hook pre save (trước khi save), after save (sau khi save)
//
UserSchema.pre("save", function (next) {
    //dòng const user = this, this ở đây đại diện cho document user
    //nó đc tạo ra trong cái hook (event) này
    const user = this;
    //dòng thứ 3, lý do phải dùng !user.isModified là để trường hợp mình update 1 user nhưng password lại ko đổi thì nó sẽ ko hash lại pw nữa
    //nếu ko có điều kiện chặn trên
    //thì mỗi lần user.save() nó sẽ vào hook này và sẽ hash lại cái pw
    console.log(user);
    console.log(`user.password = ` + user.password);
    console.log(`user.isModified("password") = ` + user.isModified("password"));

    if (!user.isModified("password")) return next();

    genSaltPromise(10)
        .then(salt => hashPromise(user.password, salt))
        .then(hash => {
            user.password = hash;
            next();
        }).catch(err => {
            throw Error(err.message);
        })
})

const User = mongoose.model('User', UserSchema, 'User');
module.exports = {
    User, UserSchema
}



