const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { body, validationResult } = require('express-validator');
var dbconnection = require('../db/dbconnection');
var utilityService = require("../utility/utility.service");


/**
 * @swagger
 * /updateReport:
 *   post:
 *     summary: Update report by reportId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Id:
 *                 type: string
 *                 example: 'fc3672d7-ecc9-4a7f-4d72-00417d283087'
 *               Title:
 *                 type: string
 *               RequestedAssessor:
 *                 type: array
 *               Description:
 *                 type: string
 *               FileLink:
 *                 type: string
 *                 example: 'https://meet.google.com/rjq-moip-hcj'
 *     responses:
 *       200:
 *         description: Update a meeting
*/
router.post('/',
    body('_id').notEmpty().withMessage('_id cannot be empty'),
    body('Title').notEmpty().withMessage('Title cannot be empty'),
    body('FileLink').notEmpty().withMessage('FileLink cannot be empty'),
    body('RequestedAssessor').isArray().withMessage('RequestedAssessor should be a array of users '),
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
                        var data = {
                            Title: req.body.Title,
                            Description: req.body.Description,
                            RequestedAssessor: req.body.RequestedAssessor,
                            FileLink: req.body.FileLink
                        }

                        dbconnection.updateReport(req.body._id, data).then(function (response) {
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