const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');

var dbconnection = require('../db/dbconnection');
var utilityService = require("../utility/utility.service");

/**
 * @swagger
 * /createUser:
 *   post:
 *     summary: Get Token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *               Email:
 *                 type: string
 *               Password:
 *                 type: string
 *               Role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Creates a user into the system
*/
router.post('/', function (req, res, next) {
    bcrypt.hash(req.body.Password, 10).then(function (hash) {
        var data = {
            _id: utilityService.guIdGenarator(),
            Name: req.body.Name,
            Email: req.body.Email,
            Password: hash,
            Role: req.body.Role,
            IsSystemBlocked: false
        }

        dbconnection.checkEmail(req.body.Email).then(function (result) {
            if (_.isEmpty(result)) {
                dbconnection.registerUser(data).then(function () {
                    dbconnection.getToken(req.body.Email).then(function (token) {
                        res.status(200).json({
                            IsValid: true,
                            token: (token) ? token : null
                        })
                    })
                })
            } else {
                res.status(200).json({
                    IsValid: false,
                    UserExists: true
                })
            }
        })
    })
});

module.exports = router;