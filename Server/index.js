const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000;
const { mogoUrl } = require("./keys");

require("./models/User");

const requireToken = require("./middleware/requireToken");
const authRoutes = require("./routes/authRoutes");
const noticeBoardRoutes = require("./routes/noticeBoardRoutes");

//middlewares

app.use(express.json());
app.use("/", authRoutes);
app.use("/noticeBoard", noticeBoardRoutes);

//connect to database

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
  res.send({ email: req.user.email });
});

//start server

app.listen(PORT, () => {
  console.log("server running " + PORT);
});
