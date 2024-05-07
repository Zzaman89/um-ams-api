const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');

var dbconnection = require('../db/dbconnection');
var utilityService = require("../utility/utility.service");

/**
 * @swagger
 * /getToken:
 *   post:
 *     summary: Get Token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Email:
 *                 type: string
 *               Password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns a valid token
*/
router.post('/', function (req, res, next) {
    if (!req.headers.authorization) {
        res.status(500).json({
            "Error": "Internal server Error!"
        })
    } else {
        var token = req.headers['x-access-token'] || req.headers['authorization'];

        if (token) {
            if (token.startsWith('Bearer ')) {
                token = token.slice(7, token.length);
            }

            jwt.verify(token, utilityService.getAnonPrivateKey(), (err, decoded) => {
                if (err) {
                    return res.json({
                        IsValid: false,
                        message: 'Token is not valid'
                    });
                } else {
                    dbconnection.checkPassword(req.body.Email).then(function (responsePass) {
                        if (_.isEmpty(responsePass[0])) {
                            res.status(200).json({
                                IsValid: false,
                                Error: "Username or password is incorrect!"
                            })
                        }
                        var isValidPass = bcrypt.compareSync(req.body.Password, responsePass[0].Password);
                        if (isValidPass) {
                            if (responsePass[0].IsSystemBlocked) {
                                res.status(200).json({
                                    IsValid: true,
                                    IsInactive: true,
                                    Error: "User is inactive"
                                });
                            } else {
                                dbconnection.getToken(req.body.Email).then(function (token) {
                                    res.status(200).json({
                                        IsValid: true,
                                        token: (token) ? token : null
                                    })
                                });
                            }
                        } else {
                            res.status(200).json({
                                IsValid: false,
                                IsInactive: true,
                                Error: "Username/Password is wrong"
                            });
                        }
                    })
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