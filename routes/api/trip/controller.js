
const { Trip } = require('../../../models/trip');
const { Seat } = require('../../../models/seat');
const { Station } = require('../../../models/station');
const _ = require('lodash');
const moment = require('moment')
const seatCode = [
    'A01', 'A02', 'A03', 'A04', 'A05', 'A06', 'A07', 'A08', 'A09', 'A10', 'A11', 'A12',
    'B01', 'B02', 'B03', 'B04', 'B05', 'B06', 'B07', 'B08', 'B09', 'B10', 'B11', 'B12'
]



module.exports.getTrips = (req, res, next) => {
    Trip.find()
        .populate("fromStationsId")
        .populate("toStationsId")
        //.select("-seats")
        .then(trips => {
            res.status(200).json(trips)
        })
        .catch(err => res.status(500).json(err))
}

module.exports.Search = (req, res, next) => {
    console.log('==========Search=================')
    console.log("vao search nao");
    const { content, content2 } = req.params;
    console.log("content ", content);
    console.log("content2 ", content2);
    Trip.find()
        .populate("fromStationsId")
        .populate("toStationsId")
        .select("-seats")
        .then(trip => {
            const arrayFilter = trip.filter(t =>
                (
                    //remove white space in string and , UpperCase
                    t.fromStationsId.province.toUpperCase().replace(/\s/g, "").includes(content.toUpperCase().replace(/\s/g, "")) ||
                    t.toStationsId.province.toUpperCase().replace(/\s/g, "").includes(content.toUpperCase().replace(/\s/g, ""))
                )
            );
            console.log("arrayFilter", arrayFilter);
            if (arrayFilter.length == 0) return Promise.reject({ message: 'Trip not found' })
            res.status(200).json(arrayFilter);
        })
        .catch(err => res.status(500).json(err))

}

module.exports.getTripsById = (req, res, next) => {
    const { id } = req.params;
    Trip.findById(id)
        .then(trip => {
            if (!trip) return Promise.reject({ message: 'Trip not found' })
            res.status(200).json(trip)

        })
        .catch(err => res.status(500).json(err))
}

module.exports.postTrip = (req, res, next) => {
    console.log(req.body);
    const { fromStationsId, toStationsId, startTime, price, fromStationProvince, toStationsProvince } = req.body;
    var momentDate = moment(startTime);
    momentDate = momentDate.format("YYYY-MM-DD HH:mm");
    const TripNameT = `${fromStationProvince}-${toStationsProvince}-${momentDate}`;
    console.log(TripNameT);
    const seats = seatCode.map(code => new Seat({ code }));
    Trip.create({
        fromStationsId, toStationsId, startTime, price, seats, tripName: TripNameT
    })
        .then(trip => {
            return res.status(200).json(trip)
        })
        .catch(err => res.status(500).json(err))
}



module.exports.deleteTrip = (req, res, next) => {
    const { id } = req.params;
    let err = false;
    Trip.findById(id).then(trip => {
        if (!trip) return Promise.reject({ message: 'Trip not found' });
        //console.log(trip);
        trip.seats.forEach(s => {
            //console.log(s)
            if (s.isBooked === true) {
                err = true;
                return;
            }
        })
        if (err) {
            return Promise.reject({ message: 'không thể xóa trip vì trong seat có  chổ ngồi đã đặt' });
        }
    }).then(() => {
        return Trip.findByIdAndDelete(id)
    }).then(trip => {  
        res.status(200).json({ message: 'Trip successfully deleted' })
        })
        .catch(err => res.status(500).json(err))
}

module.exports.putTripById = (req, res, next) => {
    console.log("vao put trip ID");
    const { id } = req.params;
    const { fromStationsId, toStationsId, startTime, price, fromStationProvince, toStationsProvince } = req.body;
    var momentDate = moment(startTime);
    momentDate = momentDate.format("YYYY-MM-DD HH:mm");
    const TripNameT = `${fromStationProvince}-${toStationsProvince}-${momentDate}`;
    console.log(TripNameT);

    Trip.findById(id)
        .then(trip => {
            if (!trip) return Promise.reject({ message: 'trip not found' });
            Object.keys(req.body).forEach(key => {
                trip[key] = req.body[key];
            })
            trip.tripName = TripNameT;
            return trip.save();
        })
        .then(trip => { res.status(201).json(trip) })
        .catch(err => { res.status(500).json(err) })
}