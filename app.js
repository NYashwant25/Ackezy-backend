const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);
require('dotenv').config()
var morgan = require('morgan')
const seedDB = require('./api/middleware/seed');
var Ddos = require('ddos')
var ddos = new Ddos({ burst: 50, limit: 50 })
var path = require('path');
var swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');

mongoose.connect(
    "mongodb://localhost:27017/Ackezy", { useNewUrlParser: true, useUnifiedTopology: true }
);

mongoose.Promise = global.Promise;


var options = {
    customCss: `
  .swagger-ui .opblock-tag { font-size : 16px !important}
  .opblock .opblock-summary-path { font-size : 13px !important}
  .swagger-ui .parameter__name { font-size : 13px !important }
  .swagger-ui .wrapper { width: 80% !important }
  .swagger-ui input[type=text] {font-size : 13px !important}
  .swagger-ui input[type=file] {font-size : 13px !important}
  .swagger-ui div{font-size : 13px !important}
  .swagger-ui .execute-wrapper .btn {width : 15% !important}
  .swagger-ui .opblock.opblock-patch .opblock-summary-method {background : darkGreen !important}
  .swagger-ui .opblock.opblock-patch .opblock-summary{background : }`
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));


app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(ddos.express);
app.use('/ackezy', express.static(__dirname + '/uploads')); //Todo Serve Parking Lot Images

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

// Routes which should handle requests
const userRoutes = require('./api/routes/user');
const dashboardRoutes = require('./api/routes/dashboard');
const commonRoutes = require('./api/routes/common');
const companyRoutes = require('./api/routes/company');

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/common", commonRoutes);
app.use("/api/v1/company", companyRoutes);


if (seedDB) {
    require('./api/middleware/seed');
}

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;