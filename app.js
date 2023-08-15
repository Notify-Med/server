const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const port = process.env.PORT || 4000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const logger = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
const clientUrl = "http://localhost:3000";

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: function (origin, callback) {
      // If the origin is undefined or in the allowedOrigins array, allow it
      const allowedOrigins = [clientUrl];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow credentials (e.g., cookies) to be included in requests
  })
);

app.use(bodyParser.json());
app.use(logger("dev"));
app.use(cookieParser());

// ------------ ROUTES -------------
const userRouter = require("./routes/userRoutes");
const {
  notificationRoute,
  // socketGetNotifications,
  socketCreateNotification,
  socketUpdateNotificationLog,
} = require("./routes/notificationRoute");

app.use("/users", userRouter);
app.use("/notifications", notificationRoute);
// ---------------------------------

// ------------ SOCKET -------------
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: clientUrl,
    methods: ["GET", "POST"],
  },
});

// socketGetNotifications(io);
socketCreateNotification(io);
socketUpdateNotificationLog(io);

// ---------------------------------





// ---------- NODEMAILER -----------
// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",  // Gmail SMTP server address
//   port: 465,              // Gmail SMTP port (465 for SSL)
//   secure: true,           // Use SSL (TLS is also available with port 587)
//   auth: {
//     user: 'aayahamzaa@gmail.com',    
//     pass: process.env.PASS     
//   }
// });

// const info = transporter.sendMail({
//   from : 'aya <aayahamzaa@gmail.com>',
//   to: 'ayatheboss2@gmail.com',
//   subject: 'Hi this is a test email'
// })
// console.log("message sent: " + info.messageId)

// ---------------------------------





server.listen(port, () => {
  console.log(`Server running on port ${port}`.yellow.bold);
});

module.exports = app;
