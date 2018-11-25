require('dotenv').config();
const express = require('express');
const process = require('process');
const {hlohovec} = require('./service/db');

const app = express();
const port = process.env.PORT || 8081;


app.get('/', async (req, res) => {
    data = await hlohovec();
    res.json(data);
});

app.listen(port, () => console.log(`Pdt be-app running on ${port}`));