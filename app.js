
const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config(); 
const connectDB =require('./config/db')
const port = process.env.PORT || 4000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const logger = require("morgan");


connectDB()

const app = express();



app.use(express.json());
app.use(express.urlencoded({extended: false}));
 
app.use(cors());

app.use(bodyParser.json());
app.use(logger("dev"));
app.use(cookieParser());


// ------------ ROUTES -------------
const userRouter = require('./routes/userRoutes');
const notificationRoute = require("./routes/notificationRoute");


app.use('/users',userRouter)
app.use("/notifications", notificationRoute);
// ---------------------------------







app.listen(port, ()=> console.log(`Server listening on port ${port}`));
module.exports = app;

