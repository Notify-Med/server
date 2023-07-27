
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
const allowedOrigins = require('./config/allowedOrigins');

connectDB()

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

 
app.use(cors({
    origin: function (origin, callback) {
      // If the origin is undefined or in the allowedOrigins array, allow it
      const allowedOrigins = ['http://localhost:3000'];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow credentials (e.g., cookies) to be included in requests
  }));

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

