
const express = require('express');
const mongoose = require('mongoose');
//deloy

console.log(process.env.NODE_ENV);
const mongooseUri = 'mongodb+srv://admin123:admin123@cluster0-lczyw.mongodb.net/fs08-vexere-remix?retryWrites=true&w=majority'
mongoose.connect(mongooseUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

//Local

// mongoose.connect('mongodb://localhost:27017/fs08-vexere-remix', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })


const app = express();


// app.get('/',(req,res,next) =>{
//     console.log('MDW 1');
//     next();
// },(req,res,next) =>{
//     console.log('MDW 2');
// })


app.use(express.json());
//Ser cái images lên cho ng ta xem, /images => /uploads
app.use("/images", express.static('uploads'));
app.use('/api', require('./routes/api'));
const port = 5000;
app.listen(port, () => {
    console.log(`app is running on port ${port}`);
});


