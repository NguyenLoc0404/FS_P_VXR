const nodemailer = require('nodemailer');
const config = require('../../config');

//để đọc file
const fs = require('fs'); // built-in NodeJS
const hogan = require('hogan.js');
//const template = fs.readFileSync(`services/sendEmail/bookingTicket.hjs`);

//${__dirname} đường dẫn tuyệt đối
const template = fs.readFileSync(`${__dirname}/bookingTicket.hjs`, "utf-8");
const compiledTemplate = hogan.compile(template);


module.exports.sendSBookEmailTicket = (ticket, trip, user) => {
    console.log('send email ticket check');
    
    //console.log(ticket);
    console.log(trip);
    console.log('==========Trip Email ====================');
    //console.log(user);
    console.log('==========User Email ====================');
    const transport = {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        requireSSL: true,
        auth: {
            // user: 'nttloc0809@gmail.com',
            // pass: 'NguyenLoc0404'

             user: config.EMAIL,
             pass: config.PASSWORD
        }
    }
   
    const transporter = nodemailer.createTransport(transport);
    const mailOptions = {
        //from: 'nttloc0809@gmail.com',
        from: config.EMAIL,
        to: user.email,
        subject: 'Xac nhan mua ve thanh cong',
        // html: 'ahihi'
        html: compiledTemplate.render({
            email: user.email,
            fromStation: trip.fromStationsId.name,
            toStation: trip.toStationsId.name,
            price: trip.price,
            amount: ticket.seats.length,
            total: ticket.totalPrice,
            seatCodes: ticket.seats.map(s => s.code).join(" - ")
          })
    };
 
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) return console.log(err.message)
        console.log('Email sent: ' + info.response);
    })
}