const axios = require('axios');

const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const path = require('path');
const cors = require('cors');
const app = express();
const port = 8080;

let lat = 0;
let lon = 0;

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post('/position', (req, res) => {
    lat = req.body.lat
    lon = req.body.lon
});

let arrivals = []
let arrivalsRes = []
let testArray = []
let code_id = null

app.use(express.static(path.join(__dirname, 'frontend/lpp-app/dist/angular-lpp-prject/')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/lpp-app/dist/angular-lpp-prject/index.html'));
});


app.get('/nearbyStations', (req, res) => {
    try {
        axios.get("https://data.lpp.si/api/station/stations-in-range?latitude=" + lat + "&longitude=" + lon + "&radius=" + 500)
            .then(data => {
                arrivals = data.data
                res.status(200).json(data.data)
            })
            .catch(err => res.send(err));
    } catch (err) {
        console.error("GG", err);
    }
})

app.get('/arrivalOnStations', (req, res) => {
    try {
        arrivals?.data.forEach((el, ind) => {
            let tmp = el.ref_id
            axios.get("https://data.lpp.si/api/station/arrival?station-code=" + tmp).then(dataOne => {
                let cuurentArrival = dataOne.data
                axios.get("https://data.lpp.si/api/station/station-details?station-code=" + tmp).then(dataTwo => {
                    let stations = dataTwo.data.data.route_groups_on_station
                    cuurentArrival.data["bueses"] = stations
                    testArray.push(cuurentArrival)
                }).catch(err => res.send(err));
            }).catch(err => res.send(err));
        })
        res.status(200).json(testArray)
        testArray = []
        arrivalsRes = []
    } catch (err) {
        console.error("GG", err);
    }
})

app.get('/arrivalOnSpecificStation', (req, res) => {
   let tmp = req.query.code
    axios.get("https://data.lpp.si/api/station/arrival?station-code=" + tmp).then( el => {
        res.status(200).json(el.data)
    }).catch(err => res.send(err));
})

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));

