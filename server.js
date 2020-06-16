
const express = require('express');
const mongoose = require('mongoose');
//deloy
const config = require('./config');

console.log(process.env.NODE_ENV);
//const mongooseUri = config.mongoURI;

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})



const app = express();




app.use(express.json());
//Ser cái images lên cho ng ta xem, /images => /uploads

//mở cor
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH");
    next();
});


app.use("/uploads", express.static('uploads'));
app.use('/api', require('./routes/api'));
const port = process.env.PORT || config.PORT;
console.log(port);
app.listen(port, () => {
    console.log(`app is running on port ${port}`);
});


