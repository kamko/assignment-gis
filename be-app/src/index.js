require('dotenv').config();
const express = require('express');
const process = require('process');
const cors = require('cors');
import {findTown, nearbyWorshipPlaces, religions, worshipPlaces} from './service/db';

const app = express();
app.use(cors());
app.disable('etag');
const port = process.env.PORT || 8081;


app.get('/worshipPlaces', (req, res) => {
    worshipPlaces({
        townId: req.query.uid
    }).then(data => res.json(data));
});


app.get('/town', (req, res) => {
    findTown({
        lng: req.query.lng,
        lat: req.query.lat
    }).then(data => res.json(data));
});

app.get('/nearby', (req, res) => {

    nearbyWorshipPlaces({
        lng: req.query.lng,
        lat: req.query.lat,
        range: req.query.range
    }).then(data => res.json(data));
});

app.get('/religions', (req, res) => {
    religions().then(data => res.json(data.map(i => i.religion)))
});


app.listen(port, () => console.log(`Pdt be-app running on ${port}`));