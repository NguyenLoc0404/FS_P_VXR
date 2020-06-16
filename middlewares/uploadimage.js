const multer = require('multer')
// type = avatar | coach | trip
module.exports.uploadMultiFile = (type) => {
    const storage = multer.diskStorage({
        //luôn đọc từ file server.js
        destination: function (req, file, cb) {
            cb(null, `./uploads/${type}s`)
        },
        filename: function (req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`)
        }
    })

    const upload = multer({ storage: storage })
    //return upload.single(type);
    return upload.array(`${type}`, 12)
}

module.exports.uploadSingleImage = (type) => {
    const storage = multer.diskStorage({
        //luôn đọc từ file server.js
        destination: function (req, file, cb) {
            
            cb(null, `./uploads/${type}s`)
        },
        filename: function (req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`)
        },
    })

    const upload = multer({ 
        storage: storage,
        limit:{fileSize:5120},
        fileFilter: function (req, file, cb) {
            console.log(file)
            if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/gif' && file.mimetype !== 'image/jpeg' ) {
                //console.log('Wrong format!');
                return cb(null, false, new Error('Wrong format!'));
            }
            // if ( file.size > 5120 ){
            //     console.log('Too large!');
            //     return cb(null, false, new Error('Too large!'));
            // }
            cb(null, true);
        }
     })
    return upload.single(type);
    //return upload.array(`${type}`, 12)
}