import express from 'express';
import { InfluxDB } from 'influx';

import dotenv from 'dotenv';
dotenv.config();

import { authMiddleware } from '../middlewares/auth';

var router = express.Router();

// Define the database connection
const database = new InfluxDB({
  host: process.env.INFLUX_HOST,
  database: process.env.INFLUX_DATABASE,
  username: process.env.INFLUX_USER,
  password: process.env.INFLUX_PASSWORD
});

/** GET: Return a list of all vehicle IDs in the database */
router.get('/all', authMiddleware, function (_req, res, _next) {
  // prettier-ignore
  database.query(`SHOW TAG VALUES ON "${process.env.INFLUX_DATABASE}" WITH KEY = "topic"`).then(result =>{
    let finalResult = []
    result.forEach(entry=> {
      console.log(entry)
      // Each entry should be in the form of 'vehicles/VEHICLEID/data', only the vehicle ID is needed here
      let dataArr = entry.value.split('/')
      // Ensure not to add duplicate entries
      if(!finalResult.includes(dataArr[1])){
        finalResult.push(dataArr[1])
      }
    })
    res.status(200).json(finalResult)
  }).catch(err => {
    console.log(err)
    res.status(500)
  });
});

/** GET: Return the most recent DB entry for a specific vehicle */
router.get('/:id', function (req, res, _next) {
  // prettier-ignore
  database.query(`SELECT * FROM "mqtt_consumer" WHERE ("topic" = 'vehicles/${req.params.id}/data') ORDER BY DESC LIMIT 1`).then(result =>{
    res.status(200).json(result[0])
  }).catch(err => {
    console.log(err)
    res.status(500)
  });
});

/** GET: Return the location history (latitude & longitude) for a specific vehicle */
router.get('/:id/tracking', authMiddleware, function (req, res, _next) {
  // prettier-ignore
  database.query(`SELECT "lat","lon","alt" FROM "mqtt_consumer" WHERE "topic" = 'vehicles/${req.params.id}/data' ORDER BY DESC`).then(result =>{
    res.status(200).json(result)
  }).catch(err => {
    console.log(err)
    res.status(500)
  });
});

/** GET: Return a list of metric values for a specific vehicle and metric */
router.get('/:id/:metric', authMiddleware, function (req, res, _next) {
  // prettier-ignore
  database.query(`SELECT "${req.params.metric}" FROM "mqtt_consumer" WHERE "topic" = 'vehicles/${req.params.id}/data'`).then(result =>{
    let finalResult = []
    result.forEach(entry => {
      finalResult.push({time: entry.time, value: entry[req.params.metric]})
    })
    res.status(200).json(finalResult)
  }).catch(err => {
    console.log(err)
    res.status(500)
  });
});

module.exports = router;
