require('dotenv').config();
const express = require('express');
const process = require('process');
const cors = require('cors');
import {hlohovec} from './service/db';

const app = express();
app.use(cors());
const port = process.env.PORT || 8081;


app.get('/', async (req, res) => {
    const data = await hlohovec();
    res.json(data);
});

app.listen(port, () => console.log(`Pdt be-app running on ${port}`));