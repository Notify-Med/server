var express = require('express');
var bodyParser = require ('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var logger = require('morgan');



var app = express();

app.use(cors());

mongoose.connect('mongodb://127.0.0.1/NotifyMed',).then(()=>{
    console.log('-> connexion to database ');
}).catch((err)=>{
    console.log(err);
});

app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cookieParser());

module.exports = app;