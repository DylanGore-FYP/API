import express from 'express';

import dotenv from 'dotenv';
dotenv.config();

var router = express.Router();

/** GET: Root route - return the current package version */
router.get('/', function (_req, res, _next) {
  res.json({ version: process.env.npm_package_version });
});

module.exports = router;
