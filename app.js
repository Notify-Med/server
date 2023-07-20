const express = require('express');
const dotenv = require('dotenv').config(); 
const port = process.env.PORT || 4000;
const bodyParser = require ('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const logger = require('morgan');


const app = express();
app.listen(port, ()=> console.log(`Server listening on port ${port}`));

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