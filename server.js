var utilityService = require("./utility/utility.service");

const http = require('http');
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const port = utilityService.getPort();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'UM AMS API',
            version: '1.0.0',
        },
    },
    apis: ['./apiList/*.js'],
});

//#region Api Routes
const getTokenRoute = require('./apiList/getToken');
const createUserRoute = require('./apiList/createUser');
//#endregion Api Routes

var corsOptions = {
    origin: utilityService.getOrigin(),
    optionsSuccessStatus: 200
}

app.options(cors());
app.use(cors(corsOptions));
app.use(bodyParser.json());

//#region Api Routes
app.use('/getToken', getTokenRoute);
app.use('/createUser', createUserRoute);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//#endregion Api Routes

app.use(function (req, res, next) {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use(function (error, req, res, next) {
    res.status(error.status || 500);
    res.json({
        error: {
            msg: error.message
        }
    })
});

const server = http.createServer(app);
server.listen(port);

module.exports = app;