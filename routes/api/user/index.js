const express = require('express');
const router = express.Router();
const controller = require('./controller');

const { authenticate, authorize } = require('../../../middlewares/auth');
const { uploadSingleImage } = require('../../../middlewares/uploadimage');
const { uploadMultiFile } = require("./../../../middlewares/uploadimage");

//validator User
const { validateCreateUser } = require("../../../middlewares/validation/user");
const { validateUpdateUser } = require("../../../middlewares/validation/user");
const { validateUpdatePassWord } = require("../../../middlewares/validation/user");
//const { validateUploadAvatar } = require("../../../middlewares/validation/user/validateUser");

router.get('/', authenticate, authorize(['admin']), controller.getUsers);
router.get('/:id', authenticate, authorize(['client', 'admin']), controller.getUsersById);
router.post('/', validateCreateUser, controller.postUserWithVal);
router.put('/:id', authenticate, authorize(['client', 'admin']), validateUpdateUser, controller.putUserById);
router.patch('/:id', authenticate, authorize(['client', 'admin']), validateUpdatePassWord, authenticate, controller.updatePWById);
router.delete('/:id', authenticate, authorize(['admin']), controller.deleteUser)

router.post('/login', controller.login);

router.post('/avatar',
    authenticate,
    authorize(['client', 'admin']),
    //Nếu mình set chổ này là avatar nó sẽ đẩy vô thư mục avatar ứng với user
    //set là other nó sẽ đẩy vô thư mục other, ứng với Upload File
    //Bên FrontEnd truyền Tên đúng như Thằng này là ok
    //đối với Frontend ( sữa other)
    //còn test trên POSTMAN ( thì cái field phải là other, ko phải avatar)

    uploadSingleImage('avatar'),
    controller.UploadAvatar);

router.post('/multiFile',
    authenticate,
    uploadMultiFile(['avatar']),
    controller.MultiFile);
module.exports = router;