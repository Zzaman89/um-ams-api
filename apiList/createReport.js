const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { body, validationResult } = require('express-validator');
var dbconnection = require('../db/dbconnection');
var utilityService = require("../utility/utility.service");


/**
 * @swagger
 * /createReport:
 *   post:
 *     summary: create new repoort
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Title:
 *                 type: string
 *               RequestedAssessor:
 *                 type: array
 *               FileLink:
 *                 type: string
 *     responses:
 *       200:
 *         description: Create a meeting
*/
router.post('/',
    body('Title').notEmpty().withMessage('Title cannot be empty'),
    body('FileLink').notEmpty().withMessage('FileLink cannot be empty'),
    body('RequestedAssessor').isArray().withMessage('RequestedAssessor should be a array of users'),
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
                            _id: utilityService.guIdGenarator(),
                            Title: req.body.Title,
                            CreatedByUserId: decoded.data.id,
                            CreatedByUserName: decoded.data.Name,
                            Description: req.body.Description,
                            CreatedDate: new Date().toISOString(),
                            ApprovedDate: '',
                            RequestedAssessor: req.body.RequestedAssessor,
                            FileLink: req.body.FileLink,
                            Status: 'Created'
                        }

                        dbconnection.createReport(data).then(function (response) {
                            res.status(200).json({
                                "IsValid": true,
                                "Data": data
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