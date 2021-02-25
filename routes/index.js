import express, { response } from 'express';
import { InfluxDB } from '@influxdata/influxdb-client';

var router = express.Router();
const queryApi = new InfluxDB({
  url: 'http://10.0.0.4:8086',
  token: '0BMOKQa0xSA7t4QFBQuZgqCXhksbL2lPAbBeQ_EB004BQlj0VZf988WLt6-nh-G-ZFDQKeLNiX0oVMGgmphQfg==',
}).getQueryApi('Home');

const fluxQueryMetric = `from(bucket: "vehicles")
|> range(start: 0)
|> filter(fn: (r) => r["_measurement"] == "mqtt_consumer")
|> filter(fn: (r) => r["_field"] == "METRIC_NAME")
|> filter(fn: (r) => r["topic"] == "vehicles/VEHICLE_ID/METRIC_NAME")
|> yield(name: "mean")`;

const fluxListTopics = `
import "influxdata/influxdb/v1"
v1.tagValues(
    bucket: "vehicles",
    tag: "topic",
    predicate: (r) => true,
    start: -30d
)`;

router.get('/', function (req, res, next) {
  res.json({ version: '0.0.0' });
});

router.get('/vehicles/all', function (req, res, next) {
  var result = [];
  queryApi.queryRows(fluxListTopics, {
    next(row, tableMeta) {
      const data = tableMeta.toObject(row);
      console.log(data);
      var dataArr = data._value.split('/');
      if (!result.includes(dataArr[1])) {
        result.push(dataArr[1]);
      }
    },
    error(error) {
      console.error(error);
    },
    complete() {
      res.json(result);
    },
  });
});

router.get('/vehicles/:vehicleId/:metric', function (req, res, next) {
  var result = [];
  var query = fluxQueryMetric.replaceAll('VEHICLE_ID', req.params.vehicleId).replaceAll('METRIC_NAME', req.params.metric);
  console.log(query);
  console.log(req.params);
  queryApi.queryRows(query, {
    next(row, tableMeta) {
      const data = tableMeta.toObject(row);
      // if (result.includes(req.params.vehicleId)) {
      result.push({ time: data._time, field: data._field, value: data._value });
      // }
    },
    error(error) {
      console.error(error);
    },
    complete() {
      res.json(result);
    },
  });
});

module.exports = router;
