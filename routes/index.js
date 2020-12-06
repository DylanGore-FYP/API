var express = require('express');
var router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: The initial API endpoint
 *     description: Returns the current API version
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 version:
 *                   type: string
 *                   example: 0.0.0
 */
router.get('/', function (req, res, next) {
    res.json({ version: '0.0.0' });
});

/**
 * @swagger
 * /vehicles:
 *   get:
 *     summary: Get a list of all known vehicles
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vehicles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The vehicle ID.
 *                         example: 1
 *                       registration:
 *                         type: string
 *                         description: The vehicle registration.
 *                         example: 202-WX-1000
 *                       manufacturer:
 *                         type: string
 *                         description: The vehicle manufacturer.
 *                         example: Toyota
 *                       model:
 *                         type: string
 *                         description: The vehicle model.
 *                         example: Corolla
 *
 */
router.get('/vehicles', function (req, res, next) {
    // TODO
    res.status(200);
});

module.exports = router;
