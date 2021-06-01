const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000;
const { mogoUrl } = require("./keys");

require("./models/User");
require("./models/noticeboard");
require("./models/Profiles");

const requireToken = require("./middleware/requireToken");
const authRoutes = require("./routes/authRoutes");
const noticeBoardRoutes = require("./routes/noticeBoardRoutes");
const profileRoutes = require("./routes/profileRoutes");

//middlewares

app.use(express.json());
app.use("/", authRoutes);
app.use("/noticeBoard", noticeBoardRoutes);
app.use("/profile", profileRoutes);
app.use(express.static("images"));
//connect to database
//Serves all the request which includes /images in the url from Images folder
app.use("/profiles", express.static(__dirname + "images/profiles"));

mongoose.connect(mogoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

mongoose.connection.on("connected", () => {
  console.log("connected to mongoDB");
});

mongoose.connection.on("error", (err) => {
  console.log("this is error", err);
});

app.get("/", requireToken, (req, res) => {
  res.send({ email: req.user.email, userId: req.user._id });
});

//start server

app.listen(PORT, () => {
  console.log("server running " + PORT);
});
