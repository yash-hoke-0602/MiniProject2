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

router.post("/upload", upload.single("file"), async ({ body, file }, res) => {
  // console.log(body);
  // console.log(file);

  const data = {
    folderid: body.folderId,
    postaddress: file.filename,
    postname: file.originalname,
  };
  const posts = new Posts(data);

  try {
    await posts.save();
    res.json({
      status: "SUCCESS",
      responseData: {
        msg: "post added",
      },
    });
  } catch (error) {
    console.log("Folder not Created");
  }
});

//get all posts from a folder

router.get("/posts/:folderId", (req, res) => {
  Posts.find(
    { folderid: req.params.folderId },
    "postaddress postname",
    (err, data) => {
      if (err) return res.send({ error: "error occured" });
      console.log(data);
      res.send(data);
    }
  );
});

//addfolder,deletefolder,addpost,deletepost

router.get("/folders", requireToken, async (req, res) => {
  Folders.find(
    { userid: req.user._id },
    "foldername foldertag folderdescription",
    (err, data) => {
      if (err) return res.send({ error: "error occured" });
      console.log(data);
      res.send(data);
    }
  );
});

router.get("/allFolders/:filters", async (req, res) => {
  // console.log(req.params.filters);
  var filterArray = req.params.filters.split(" ");
  // console.log(filterArray);
  Folders.find(
    { foldertag: filterArray },
    "foldername foldertag folderdescription author date",
    (err, data) => {
      if (err) return res.send({ error: "error occured" });
      console.log(data);
      res.send(data);
    }
  );
});

router.post("/addfolder", requireToken, async (req, res) => {
  const data = {
    userid: req.user._id,
    author: req.user.email,
    foldername: req.body.folderName,
    foldertag: req.body.folderTag,
    folderdescription: req.body.folderDesc,
  };
  const folder = new Folders(data);
  // console.log(folder);

  try {
    await folder.save();
    res.send({ folderId: folder._id });
    console.log("Folder Created");
  } catch (error) {
    console.log("Folder not Created");
  }
});

router.get("/deletefolder/:folderId", async (req, res) => {
  try {
    const folder = await Folders.deleteOne({ _id: req.params.folderId });

    const post = await Posts.deleteMany({ folderid: req.params.folderId });

    res.send({ msg: "Folder Deleted" });
    console.log("Folder deleted");
  } catch (error) {
    res.send({ msg: "error" });
    console.log("Folder not deleted");
  }
});

//deletePosts

router.get("/deletepost/:postid", async (req, res) => {
  try {
    const post = await Posts.deleteOne({ _id: req.params.postid });
    res.send({ msg: "Post Deleted" });
    console.log("Post deleted");
  } catch (error) {
    res.send({ msg: "error" });
    console.log("Post not deleted");
  }
});

module.exports = router;
