const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { validationResult } = require('express-validator');
var dbconnection = require('../db/dbconnection');
var utilityService = require("../utility/utility.service");

router.post('/', function (req, res, next) {
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
                        EntityName: req.body.EntityName,
                        EntityId: req.body.EntityId,
                        UserId: req.body.UserId,
                        UserName: req.body.UserName,
                        Permission: req.body.Permission,
                        NotificationText: req.body.NotificationText,
                        Time: new Date().toISOString()
                    }

                    dbconnection.createNotification(data).then(function (response) {
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