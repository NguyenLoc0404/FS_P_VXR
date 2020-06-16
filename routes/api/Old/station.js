const express = require('express');
const router = express.Router();
const { Station } = require('../../../models/station');
router.get('/stations', (req, res, next) => {
    Station.find()
        .then(stations => {
            res.status(200).json(stations)
        })
        .catch(err => res.status(500).json(err))
})
router.get('/stations/:id', (req, res, next) => {
    const { id } = req.params;
    Station.findById(id)
        .then(stations => {
            if (!stations) return Promise.reject({ message: 'Station not found' })
             res.status(200).json(stations);
        })
        .catch(err => res.status(500).json(err))
})
router.post('/stations', (req, res, next) => {
    const { name, address, province } = req.body;
    //tao 1 instance de luu tru
    // const newStations = new Station({
    //     name, address, province
    // });
    // newStations.save().then(station => res.status(201).json(station))
    // .catch(err => res.status(500).json(err));
    Station.create({
        name, address, province
    }).then(station => res.status(201).json(station))
        .catch(err => res.status(500).json(err));
})

router.put('/stations/:id', (req, res, next) => {
    const { id } = req.params;
    //console.log(id);
    const { name, address, province } = req.body;
    Station.findById(id)
        .then(stations => {
            //tim ko thay
            //console.log(station);
            if (!stations) return Promise.reject({ message: 'Station not found' });
            //console.log('tim thay id roi')
            stations.name = name;
            stations.address = address;
            stations.province = province;
            return stations.save();

        }).then(stations => { res.status(201).json(stations) })
        .catch(err => res.status(500).json(err))
})

router.delete('/stations/:id', (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    //const { name, address, province } = req.body;
    Station.findByIdAndDelete(id)
        .then(stations => {
            //tim ko thay
            console.log(stations);
            if (!stations) return Promise.reject({ message: 'Station not found' });


        }).then(stations => {
            res.status(200).json({ message: 'Station Delete Successfull' });
            return Station.save()
        })
        .catch(err => res.status(500).json(err))
})
module.exports = router;