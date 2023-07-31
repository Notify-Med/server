const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const port = process.env.PORT || 4000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const logger = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
const allowedOrigins = require("./config/allowedOrigins");
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
} = require("./routes/notificationRoute");

app.use("/users", userRouter);
app.use("/notifications", notificationRoute);
app.use("/receiver", receiverRoute);
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

// ---------------------------------

// ---------------------------------

server.listen(port, () => {
  console.log(`Server running on port ${port}`.yellow.bold);
});

module.exports = app;
