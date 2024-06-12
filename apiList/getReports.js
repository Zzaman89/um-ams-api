const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { body, validationResult } = require('express-validator');
var dbconnection = require('../db/dbconnection');
var utilityService = require("../utility/utility.service");


/**
 * @swagger
 * /getReports:
 *   post:
 *     summary: Get reports
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Limit:
 *                 type: number
 *               Skip:
 *                 type: number
 *     responses:
 *       200:
 *         description: Gets a list of users
*/
router.post('/',
    body('Limit').notEmpty().withMessage('Limit cannot be empty'),
    body('Skip').notEmpty().withMessage('Skip cannot be empty'),
    function (req, res, next) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send({
                IsValid: false,
                message: errors
            });
        }

        if (!req.headers.authorization) {
            res.status(401).json({
                IsValid: false,
                message: 'Auth token is not supplied'
            });
        } else {
            var token = req.headers['x-access-token'] || req.headers['authorization'];

            if (token) {
                if (token.startsWith('Bearer ')) {
                    token = token.slice(7, token.length);
                }

                jwt.verify(token, utilityService.getPrivateKey(), (err, decoded) => {
                    if (err) {
                        return res.json({
                            IsValid: false,
                            message: 'Token is not valid'
                        });
                    } else {
                        dbconnection.getReports(req.body.Limit, req.body.Skip).then(function (response) {
                            res.status(200).json({
                                "IsValid": true,
                                "Data": response
                            })
                        });
                    }
                });
            } else {
                return res.json({
                    IsValid: false,
                    message: 'Auth token is not supplied'
                });
            }
        }
    });

module.exports = router;