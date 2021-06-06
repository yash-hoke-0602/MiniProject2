var multer = require("multer");
const express = require("express");
const mongoose = require("mongoose");
const Folders = mongoose.model("Folder");
const Posts = mongoose.model("Post");

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

router.get("/addfolder", async (req, res) => {
    const folder = new Folders(req.body);

  try {
    await folder.save();
    res.send("Folder Created")
    console.log("Folder Created");
  } catch (error) {
    console.log("Folder not Created");
  }  
});
router.get("/deletefolder", async (req, res) => {
    const post = await Folders.deleteOne({ userid: req.user._id }); 
});
router.get("/addpost", async (req, res) => {
    const post = new Posts(req.body);

  try {
    await post.save();
    res.send("Post Created")
    console.log("Post Created");
  } catch (error) {
    console.log("Post not Created");
  }  
});
router.get("/deletepost", async (req, res) => {
    const post= await Folders.deleteOne({ folderid: req.user._id }); 
});
module.exports = router;
