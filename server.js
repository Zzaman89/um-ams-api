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
    swaggerDefinition: {
        openapi: '3.0.1',
        info: {
            title: 'UM AMS API',
            version: '1.0.0'
        },
        basePath: '/',
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./apiList/*.js']
});

//#region Api Routes
const getTokenRoute = require('./apiList/getToken');
const createUserRoute = require('./apiList/createUser');
const getUserRoute = require('./apiList/getUsers');
const updateUserRoute = require('./apiList/updateUser');
const deleteUserRoute = require('./apiList/deleteUser');
const createMeetingRoute = require('./apiList/createMeeting');
const getMeetingsRoute = require('./apiList/getMeetings');
const updateMeetingRoute = require('./apiList/updateMeeting');
const deleteMeetingRoute = require('./apiList/deleteMeeting');
const createReportRoute = require('./apiList/createReport');
const getReportsRoute = require('./apiList/getReports');
const getReportByIdRoute = require('./apiList/getReportById');
const updateReportRoute = require('./apiList/updateReport');
const deleteReportRoute = require('./apiList/deleteReport');
const updateReportStatusRoute = require('./apiList/updateReportStatus');
const getDashboardStatisticsRoute = require('./apiList/getDashboardStatistics');
const createCommentRoute = require('./apiList/createComment');
const getCommentsRoute = require('./apiList/getComments');
const createNotificationRoute = require('./apiList/createNotification');
const getNotificationsRoute = require('./apiList/getNotifications');
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
app.use('/getUsers', getUserRoute);
app.use('/updateUser', updateUserRoute);
app.use('/deleteUser', deleteUserRoute);
app.use('/createMeeting', createMeetingRoute);
app.use('/getMeetings', getMeetingsRoute);
app.use('/updateMeeting', updateMeetingRoute);
app.use('/deleteMeeting', deleteMeetingRoute);
app.use('/createReport', createReportRoute);
app.use('/getReports', getReportsRoute);
app.use('/getReport', getReportByIdRoute);
app.use('/updateReport', updateReportRoute);
app.use('/deleteReport', deleteReportRoute);
app.use('/updateReportStatus', updateReportStatusRoute);
app.use('/getDashboardStatistics', getDashboardStatisticsRoute);
app.use('/createComment', createCommentRoute);
app.use('/getComments', getCommentsRoute);
app.use('/createNotification', createNotificationRoute);
app.use('/getNotifications', getNotificationsRoute);
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