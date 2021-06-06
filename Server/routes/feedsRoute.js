var multer = require("multer");
const express = require("express");
const mongoose = require("mongoose");

//const Folders = mongoose.model("Folder");
//const Posts = mongoose.model("Post");

const requireToken = require("../middleware/requireToken");

const router = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "feeds");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + file.originalname);
  },
});

var upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), ({ body, file }, res) => {
  console.log(body);
  console.log(file);
  res.json({
    status: "SUCCESS",
    responseData: {
      body: body,
      file: file,
    },
  });
});
//addfolder,deletefolder,addpost,deletepost