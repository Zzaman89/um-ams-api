const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { body, validationResult } = require('express-validator');
var dbconnection = require('../db/dbconnection');
var utilityService = require("../utility/utility.service");


/**
 * @swagger
 * /updateUser:
 *   post:
 *     summary: Update users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 id: string
 *               Name:
 *                 type: string
 *               Email:
 *                 type: string
 *               Role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updates a user by user id
*/
router.post('/',
    body('id').notEmpty().withMessage('Id cannot be empty'),
    body('Name').notEmpty().withMessage('Name cannot be empty'),
    body('Email').notEmpty().withMessage('Email cannot be empty'),
    body('Role').notEmpty().withMessage('Role cannot be empty'),
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
                        dbconnection.updateUser(req.body.id, req.body.Name, req.body.Email, req.body.Role).then(function (response) {
                            res.status(200).json({
                                "IsValid": true,
                                "Data": response
                            });
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