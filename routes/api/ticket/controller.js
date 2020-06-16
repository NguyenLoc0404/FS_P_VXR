
const { Ticket } = require("../../../models/ticket")
const { Trip } = require('../../../models/trip');
const { Seat } = require('../../../models/seat');
const _ = require('lodash');
const { sendSBookEmailTicket } = require('../../../services/sendEmail/bookingTicket');

module.exports.getTickets = (req, res, next) => {
    //console.log("vao gettickets");
    //console.log(req);
    let ticket;
    Ticket.find()
        .populate("tripId")
        .populate("userId")
        .then((_ticket) => {
           // console.log("_ticket",_ticket);
            ticket = _ticket;
            return Promise.all(
                _ticket.map((t, index) => {
                    return Trip.findById(t.tripId._id)
                        .populate("fromStationsId")
                        .populate("toStationsId")
                        .select("-seats")
                })
            )
        })
        .then(trip => {
            for (var i = 0; i < ticket.length; i++) {
                ticket[i].tripId = trip[i];
            }
            return res.status(200).json(ticket);
        })
        .catch(err => res.status(500).json(err));
}
module.exports.getTicketsById = (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    Ticket.findById(id)
        .then((ticket) => {
            console.log(ticket);
            if (!ticket) return Promise.reject({ message: 'Ticket is not found' })
            return res.status(200).json(ticket);
        })
        .catch(err => res.status(500).json(err));
}

//check all ticket of users
module.exports.getAllTicketsById = (req, res, next) => {
    const { id } = req.params;
    let ticket;
    Ticket.find({ userId: id })
        .populate("tripId")
        .populate("userId")
        .then((_ticket) => {
            ticket = _ticket;
            return Promise.all(
                _ticket.map((t, index) => {
                    return Trip.findById(t.tripId._id)
                        .populate("fromStationsId")
                        .populate("toStationsId")
                        .select("-seats")
                })
            )
        })
        .then(trip => {
            //Nếu dùng Biến cục bộ thì ta gán vô ok
            //còn ko thì tạo 1 field khác gán vô , tránh làm thay đổi dữ liệu
            for (var i = 0; i < ticket.length; i++) {
                ticket[i].tripId = trip[i];
            }
            return res.status(200).json(ticket);
        })
        .catch(err => res.status(500).json(err));
}

//Load Trip len
//kiem tra danh sach ghe => Loc Danh Sach Ghe chua co ng boot
//Check Mang Ma ng dùng đăt
//Ghe da co ng boot => quang error
//Boot Done , luu vao Database => Thay doi thong tin trong Trip
module.exports.postTicket = (req, res, next) => {
    const { tripId, seatCodes } = req.body;
    
    //populate truy vấn dữ liệu của bảng khác
    Trip.findById(tripId)
        .populate("fromStationsId")
        .populate("toStationsId")
        .then(trip => {
           
            if (!trip) return Promise.reject({ message: 'Trip not found' })

            //lay danh sach Seat
            const AviableSeat = trip.seats.filter(s => { return !s.isBooked }).map(s => s.code);
            console.log(AviableSeat);
            console.log("==========Aviable Seat ====================")
            //loc ra danh sach Seat error
            const ErrorSeat = seatCodes.filter(s => AviableSeat.indexOf(s) === -1)
            //const ErrorSeat = seatCodes.map(s => { if (AviableSeat.indexOf(s) === -1) return s })


            console.log(ErrorSeat);
            console.log('=====Error Seat =======')
            if (!_.isEmpty(ErrorSeat))
                return Promise.reject({ message: `Seats ${ErrorSeat.join(',')} :  is already booked`, ErrorSeat });
            const ticket = new Ticket({
                tripId,
                userId: req.user._id,
                seats: seatCodes.map(code => new Seat({ code, isBooked: true })),
                totalPrice: seatCodes.length * trip.price
            })
            // console.log(ticket);
            // console.log('===== Ticket =======')
            //console.log(trip.seats)
            //Uptate Danh Sach sau khi booked

            seatCodes.forEach(code => {
                const index = trip.seats.findIndex(s => s.code === code);
                trip.seats[index].isBooked = true;
            })


            //console.log(trip.seats);
            //luu lai 2 tien trinh
            return Promise.all([
                ticket.save(),
                trip.save()
            ])

        })
        .then(result => {
            console.log(result);
            sendSBookEmailTicket(result[0], result[1], req.user);
            return res.status(201).json(result[0])
        })
        .catch(err => { 
            console.log(err)
            res.status(500).json(err) 
        })
}

module.exports.deleteTicket = (req, res, next) => {
    console.log("vao delete");
    const { id } = req.params;
    console.log(id);
    let tripId;
    let ticket;
    Ticket.findByIdAndDelete(id).
        then(_ticket => {
            tripId = _ticket.tripId;
            ticket = _ticket;
            if (!ticket) return Promise.reject({ message: 'Ticket not found' })
            res.status(200).json({ message: 'Ticket successfully deleted' })
        })
        .then(() => {
            return Trip.findById(tripId)
            console.log(tripId);
        })
        .then(trip => {
            //console.log(trip)
            ticket.seats.forEach(c => {
                const index = trip.seats.findIndex(s => s.code === c.code);
                trip.seats[index].isBooked = false;
            })
            return trip.save()
        })
        .catch(err => res.status(500).json(err))
}


module.exports.putTicketById = (req, res, next) => {
    const { tripId, seatCodes } = req.body;
    const { id } = req.params;
    console.log(id);
    console.log("==========PUT start====================")
    console.log(req.user);
    let ticket;
    Ticket.findById(id)
        .then(_ticket => {
            ticket = _ticket;
            if (!ticket) return Promise.reject({ message: 'ticket not found' });
            return Trip.findById(ticket.tripId)
        })
        .then(trip => {
            //console.log(trip)
            ticket.seats.forEach(c => {
                const index = trip.seats.findIndex(s => s.code === c.code);
                trip.seats[index].isBooked = false;
            })
            return trip.save()
        })
        .then(trip => {
            return Trip.findById(tripId)
                .populate("fromStationsId")
                .populate("toStationsId")
        })
        .then(trip => {
            if (!trip) return Promise.reject({ message: 'Trip not found' })


            //lay danh sach Seat
            const AviableSeat = trip.seats.filter(s => { return !s.isBooked }).map(s => s.code);
            console.log('=====Avibale Seat =======')
            console.log(AviableSeat);
            console.log('=====Avibale Seat =======')
            //loc ra danh sach Seat error
            const ErrorSeat = seatCodes.filter(s => AviableSeat.indexOf(s) === -1)
            console.log('=====Error Seat =======')
            console.log(ErrorSeat);
            console.log('=====Error Seat =======')
            if (!_.isEmpty(ErrorSeat))
                return Promise.reject({ message: `Seats ${ErrorSeat.join(',')} :  is already booked`, ErrorSeat });

            const seatsUpdate = seatCodes.map(code => new Seat({ code, isBooked: true }));

            ticket.tripId = tripId;
            ticket.seats = seatsUpdate;
            ticket.totalPrice = seatCodes.length * trip.price;

            console.log(ticket);
            console.log('===== Ticket =======')

            //Uptate Chuyen sau khi booked

            seatCodes.forEach(code => {
                const index = trip.seats.findIndex(s => s.code === code);
                trip.seats[index].isBooked = true;
            })

            // //luu lai 2 tien trinh
            return Promise.all([
                ticket.save(),
                trip.save()
            ])
        })
        .then(result => {
            sendSBookEmailTicket(result[0], result[1], req.user);
            res.status(201).json(result[0])
        })
        .catch(err => { res.status(500).json(err) })
}