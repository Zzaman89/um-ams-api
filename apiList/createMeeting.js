const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { body, validationResult } = require('express-validator');
var dbconnection = require('../db/dbconnection');
var utilityService = require("../utility/utility.service");


/**
 * @swagger
 * /createMeeting:
 *   post:
 *     summary: create meetings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
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
 *     responses:
 *       200:
 *         description: Create a meeting
*/
router.post('/',
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
                            _id: utilityService.guIdGenarator(),
                            Title: req.body.Title,
                            CreatedByUserId: decoded.data.id,
                            CreatedByUserName: decoded.data.Name,
                            Description: req.body.Description,
                            StartingDate: req.body.StartingDate,
                            EndingDate: req.body.EndingDate,
                            InvitedUsers: req.body.InvitedUsers,
                            MeetingLink: req.body.MeetingLink
                        }
                        console.log(data);

                        dbconnection.createMeeting(data).then(function (response) {
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