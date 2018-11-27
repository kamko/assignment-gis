require('dotenv').config();
const express = require('express');
const process = require('process');
const cors = require('cors');
import {findTown, churches} from './service/db';

const app = express();
app.use(cors());
const port = process.env.PORT || 8081;


app.get('/churches', (req, res) => {
    churches({
        townId: req.query.uid
    }).then(data => res.json(data));
});


app.get('/town', (req, res) => {
    findTown({
        lng: req.query.lng,
        lat: req.query.lat
    }).then(data => res.json(data));
});

app.listen(port, () => console.log(`Pdt be-app running on ${port}`));