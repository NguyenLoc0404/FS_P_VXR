
const { Station } = require('../../../models/station');
const { Trip } = require('../../../models/trip');
module.exports.getStations = (req, res, next) => {
    Station.find()
        .then(stations => {
            res.status(200).json(stations)
        })
        .catch(err => res.status(500).json(err))
}
module.exports.getStationsById = (req, res, next) => {
    const { id } = req.params;
    Station.findById(id)
        .then(stations => {
            if (!stations) return Promise.reject({ message: 'Station not found' })
            res.status(200).json(stations);
        })
        .catch(err => res.status(500).json(err))
}

module.exports.postStation = (req, res, next) => {
    const { name, address, province, description } = req.body;
    const newStations = new Station({
        name, address, province, description
    });
    console.log(newStations);
    newStations.save().then(station => res.status(201).json(station))
        .catch(err => res.status(500).json(err));

    // Station.create({
    //     name, address, province
    // }).then(station => res.status(201).json(station))
    //     .catch(err => res.status(500).json(err));
}

module.exports.putStationById = (req, res, next) => {
    const { id } = req.params;
    //console.log(id);
    const { name, address, province, description } = req.body;
    Station.findById(id)
        .then(stations => {
            //tim ko thay
            //console.log(station);
            if (!stations) return Promise.reject({ message: 'Station not found' });

            Object.keys(req.body).forEach(key => {
                stations[key] = req.body[key];
            })
            // if (name)
            //     stations.name = name;
            // if (address)
            //     stations.address = address;
            // if (province)
            //     stations.province = province;
            return stations.save();

        }).then(stations => { res.status(201).json(stations) })
        .catch(err => res.status(500).json(err))
}

module.exports.deleteStation = (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    let err = false;
    //const { name, address, province } = req.body;
    console.log("vao station delete");
    Trip.find({
        $or: [{ fromStationsId: id }, { toStationsId: id }]
    })
        .then(trips => {
            //console.log(trips);
            trips.forEach(t => {
                t.seats.forEach(s => {
                    if (s.isBooked === true) {
                        err = true;
                        return;
                    }
                })
            })
            if (err) {
                return Promise.reject({ message: 'không thể xóa station vì trong trip có  chổ ngồi đã đặt' });
            }
        })
        .then(() => {
            return Trip.remove({
                $or: [{ fromStationsId: id }, { toStationsId: id }]
            })
            
        })
        .then(()=>{
            return Station.findByIdAndDelete(id)
        })
        .then(stations => {
            if (!stations) return Promise.reject({ message: 'Station not found' });
            //collectionName.remove({'_id':12,'browser':"GC"})
            res.status(200).json({ message: 'Station Delete Successfull' })
        })
        .catch(err => res.status(500).json(err))


}

module.exports.UploadAvatarStations = (req, res, next) => {
    console.log("vao uploadAvatar stations");
    console.log(req.file, 2222);
    const { id } = req.params;
    console.log(id, 111);

    Station.findById(id)
        .then(station => {

            if (!station) return Promise.reject({ message: 'Station not found' });
            console.log(station);
            station.stationA = req.file.path;
            return station.save()

        }).then(stations => { res.status(201).json(stations) })
        .catch(err => res.status(500).json(err))
}