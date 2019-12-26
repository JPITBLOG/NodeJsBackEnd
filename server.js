'use strict';
// Public node modules
const cors = require("cors");
const config = require('config');
const express = require("express");
const mongoose = require("mongoose");
const chalk = require('chalk');
//swagger
const swaggerUi = require('swagger-ui-express');
const swaggerTools = require('swagger-tools');

// Variable declaration
const app = express();
const port = 8001 || process.env.PORT;
const log = console.log;
const {
 adminRoutes, beginnerRoutes, documentationRoutes
} = require('./controllers');

// Database connectivity and it's utils
mongoose.Promise = global.Promise;
mongoose.connect(config.get('mongo.host'), config.get('mongo.options'), (error, response) => {
    if(error){
      log(chalk.red('An error occurred while making a connection with database'), error);
      return process.exit(1);
    }
    log(chalk.green('Database successfully connected'));
});

// Middleware configurations
app.use(cors());
// Note:- From express 4.16.* started giving a support for json and urlencoded middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/upload/video'));

// Attach routes with applications
app.use('/admin', adminRoutes);
app.use('/beginner', beginnerRoutes);
app.use('/documentation', documentationRoutes);

// Default home route for status
app.get('/', (req, res) => {
   res.json({status: 'OK', current_datetime: new Date()});
});

// Server start listening
app.listen(port, (error) => {
    if (error) {
      log(chalk.red(`An error occurred while starting a node server on port ${port}`), error);
      return process.exit(1);
    }
    log(chalk.green(`Server successfully started at http://localhost:${port}`));
});