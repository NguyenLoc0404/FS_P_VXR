const dotenv = require('dotenv');
// tự động đọc  file .env
dotenv.config();
let mongoURI;
let PORT;
let SECRET_KEY;
let EMAIL;
let PASSWORD;

switch (process.env.NODE_ENV) {
    case "local":
        mongoURI = process.env.LOCAL_MONGODB_URI;
        PORT = process.env.LOCAL_PORT;
        SECRET_KEY = process.env.LOCAL_SECRET_KEY;
        EMAIL = process.env.LOCAL_EMAIL;
        PASSWORD = process.env.LOCAL_PASSWORD;
        break;
    case "staging":
        mongoURI = process.env.STAGING_MONGODB_URI;
        SECRET_KEY = process.env.STAGING_SECRET_KEY;
        EMAIL = process.env.STAGING_EMAIL;
        PASSWORD = process.env.STAGING_PASSWORD;
        break;

}
console.log(mongoURI);
module.exports = {
    mongoURI,
    PORT,
    SECRET_KEY,
    EMAIL,
    PASSWORD
}