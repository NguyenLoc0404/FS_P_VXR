const mongoose = require('mongoose');
const {SeatSchema} = require('./seat');

const TripSchema = new mongoose.Schema({
    fromStationsId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Station"
    },
    toStationsId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Station"
    },
    tripName:  String,
    startTime: { type: Date, required: true },
    price: { type: Number, required: true },
    seats: [SeatSchema]
})

const Trip = mongoose.model('Trip', TripSchema, 'Trip');
module.exports =
    { TripSchema, Trip }