const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { body, validationResult } = require('express-validator');
var dbconnection = require('../db/dbconnection');
var utilityService = require("../utility/utility.service");


/**
 * @swagger
 * /updateMeeting:
 *   post:
 *     summary: update meetings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Id:
 *                 type: string
 *                 example: 'ec630cea-bfcf-bacb-a40f-f13d417f1e05'
 *               Title:
 *                 type: string
 *               StartingDate:
 *                 type: string
 *               EndingDate:
 *                 type: string
 *               InvitedUsers:
 *                 type: array
 *               MeetingLink:
 *                 type: string
 *                 example: 'https://meet.google.com/rjq-moip-hcj'
 *     responses:
 *       200:
 *         description: Update a meeting
*/
router.post('/',
    body('Id').notEmpty().withMessage('Id cannot be empty'),
    body('Title').notEmpty().withMessage('Title cannot be empty'),
    body('StartingDate').isISO8601().notEmpty().withMessage('StartingDate cannot be empty'),
    body('EndingDate').isISO8601().notEmpty().withMessage('EndingDate cannot be empty'),
    body('MeetingLink').notEmpty().withMessage('EndingDate cannot be empty'),
    body('InvitedUsers').isArray().withMessage('InvitedUsers should be a array of users '),
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
                            StartingDate: req.body.StartingDate,
                            EndingDate: req.body.EndingDate,
                            InvitedUsers: req.body.InvitedUsers,
                            MeetingLink: req.body.MeetingLink
                        }

                        dbconnection.updateMeeting(req.body.Id, data).then(function (response) {
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