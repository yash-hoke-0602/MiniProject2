const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const { mogoUrl } = require("./keys");

require("./models/User");
require("./models/noticeboard");
require("./models/Profiles");
require("./models/Folders");
require("./models/Posts");
require("./models/UserLike");
require("./models/ReaderBot");

const requireToken = require("./middleware/requireToken");
const authRoutes = require("./routes/authRoutes");
const noticeBoardRoutes = require("./routes/noticeBoardRoutes");
const profileRoutes = require("./routes/profileRoutes");
const feedsRoutes = require("./routes/feedsRoute");
const readerBotRoutes = require("./routes/readerBotRoutes");
const BotsRoutes = require("./routes/botsRoutes");
//middlewares

app.use(express.json());
app.use(cors());
app.use("/", authRoutes);
app.use("/noticeBoard", noticeBoardRoutes);
app.use("/profile", profileRoutes);
app.use("/feeds", feedsRoutes);
app.use("/readerBot", readerBotRoutes);
app.use("/bots", BotsRoutes);

app.use(express.static("images"));
//connect to database
//Serves all the request which includes /images in the url from Images folder
app.use("/profiles", express.static(__dirname + "images/profiles"));
app.use("/feeds", express.static(__dirname + "/feeds"));
app.use("/readerDocs", express.static(__dirname + "/readerDocs"));

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
