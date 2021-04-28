import express from 'express';
import { InfluxDB } from 'influx';

import dotenv from 'dotenv';
dotenv.config();

import { authMiddleware } from '../middlewares/auth';

var router = express.Router();

const database = new InfluxDB({
  host: process.env.INFLUX_HOST,
  database: process.env.INFLUX_DATABASE,
  username: process.env.INFLUX_USER,
  password: process.env.INFLUX_PASSWORD,
});

router.get('/all', authMiddleware, function (req, res, next) {
  // prettier-ignore
  database.query(`SHOW TAG VALUES ON "${process.env.INFLUX_DATABASE}" WITH KEY = "topic"`).then(result =>{
    let finalResult = []
    console.log(result)
    result.forEach(entry=> {
      console.log(entry)
      let dataArr = entry.value.split('/')
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

router.get('/:id', authMiddleware, function (req, res, next) {
  // prettier-ignore
  database.query(`SELECT * FROM "mqtt_consumer" WHERE ("topic" = 'vehicles/${req.params.id}/data') ORDER BY DESC LIMIT 1`).then(result =>{
    res.status(200).json(result[0])
  }).catch(err => {
    console.log(err)
    res.status(500)
  });
});

router.get('/:id/tracking', authMiddleware, function (req, res, next) {
  // prettier-ignore
  database.query(`SELECT "lat","lon","alt" FROM "mqtt_consumer" WHERE "topic" = 'vehicles/${req.params.id}/data' ORDER BY DESC`).then(result =>{
    res.status(200).json(result)
  }).catch(err => {
    console.log(err)
    res.status(500)
  });
});

router.get('/:id/:metric', authMiddleware, function (req, res, next) {
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
