const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');

var dbconnection = require('../db/dbconnection');

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
 *                 type: string,
 *                 example: 'admin@umams.com'
 *               Password:
 *                 type: string
 *                 example: '1234'
 *     responses:
 *       200:
 *         description: Returns a valid token
*/
router.post('/', function (req, res, next) {
    if (!req && !req?.body) {
        res.status(400).json({
            IsValid: false,
            Error: "Payload invalid"
        });
        return;
    }

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
});

module.exports = router;