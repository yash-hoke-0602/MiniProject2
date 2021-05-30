const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const requireToken = require("../middleware/requireToken");

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "images/profiles");
  },
  filename(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

//save image file at location '/image/profiles' with name as '<current_time>userName'

router.post("/uploadPhoto", upload.single("photo"), async (req, res) => {
  console.log("file", req.file.filename);
  console.log(req.user);
  res.status(200).json({
    message: "success!",
  });
});

//send the profile data of user using req.user._id

router.get("/", requireToken, (req, res) => {
  res.status(200).json({
    name: "Yash",
    PRN: "2018BTECS00101",
    img: "/profiles/1622318896570userName.jpg",
  });
});

//update the profile data (overwrite new Data on current data)

router.post("/update", requireToken, (req, res) => {
  // use req.user._id to find user
});

module.exports = router;
