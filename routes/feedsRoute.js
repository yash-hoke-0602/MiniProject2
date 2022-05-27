var multer = require("multer");
const express = require("express");
const mongoose = require("mongoose");
const Folders = mongoose.model("Folder");
const Posts = mongoose.model("Post");
const Likes = mongoose.model("UserLike");
const pdf = require("pdf-parse");
const fs = require("fs");

var similarity = require("string-cosine-similarity");

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
  const pdffile = fs.readFileSync("feeds/" + file.filename);
  pdf(pdffile).then(async function (data) {
    var pdfText = data.text;
    console.log(pdfText);
    const Info = {
      folderid: body.folderId,
      postaddress: file.filename,
      postname: file.originalname,
      postText: pdfText,
    };
    const posts = new Posts(Info);

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

//like folder

router.get("/likeFolder/:folderId", requireToken, async (req, res) => {
  const Data = {
    userid: req.user._id,
    folderid: req.params.folderId,
  };

  const likes = new Likes(Data);

  try {
    await likes.save();
    res.send({ folderId: req.params.folderId });
  } catch (error) {
    console.log("Folder not Created");
  }
});

//unlike folder

router.get("/unlikeFolder/:folderId", requireToken, async (req, res) => {
  try {
    const likes = await Likes.deleteOne({
      folderid: req.params.folderId,
      userid: req.user._id,
    });

    res.send({ msg: "like Deleted" });
    console.log("like deleted");
  } catch (error) {
    res.send({ msg: "error" });
    console.log("Folder not deleted");
  }
});

//all Liked folders

router.get("/allLikedFolders", requireToken, async (req, res) => {
  Likes.find({ userid: req.user._id }, "folderid", (err, data) => {
    if (err) return res.send({ error: "error occured" });
    console.log(data);
    res.send(data);
  });
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

router.get("/recommendationFolders", requireToken, (req, res) => {
  // console.log(req.params.filters);
  // console.log(filterArray);

  Likes.find({ userid: req.user._id }, "folderid", (err, likeData) => {
    if (err) return res.send({ error: "error occured" });

    var likedFolderId = likeData[0].folderid;
    console.log(likedFolderId);
    Folders.find(
      { _id: likedFolderId },
      "similarityTag foldername",
      (err, tagData) => {
        if (err) return res.send({ error: "error occured" });
        Folders.find(
          { foldertag: "Computer" },
          "foldername foldertag folderdescription author date similarityTag",
          (err, data) => {
            if (err) return res.send({ error: "error occured" });
            // var likeFolderTag = tagData[0].similarityTag;
            // for (var item in tagData[0]) {
            //   console.log("A1-" + tagData[item]);
            // }
            var ob = JSON.stringify(tagData[0]);
            var likeFolderTag = "";
            for (var i = 0; i < ob.length; i++) {
              // console.log(ob.substring(i, i + 14));
              if (ob.substring(i, i + 14) === 'similarityTag"') {
                var j = i + 16;
                while (ob[j] != '"') {
                  j++;
                }
                likeFolderTag = ob.substring(i + 16, j);
              }
            }
            // console.log("cool" + ob.charAt(3));
            var objects = [];
            for (var i = 0; i < data.length; i++) {
              var ob2 = JSON.stringify(data[i]);
              var string2 = ob2;
              // console.log(string2);

              var similarityScore = 0;
              if (string2 && likeFolderTag) {
                if (isNaN(similarity(string2, likeFolderTag))) {
                  similarityScore = 0;
                } else {
                  similarityScore = similarity(string2, likeFolderTag);
                  objects.push({
                    similarity: similarityScore,
                    postData: data[i],
                  });
                  // console.log(data[i]);
                }
              }
            }
            function compare_similarity(a, b) {
              if (a.similarity < b.similarity) {
                return 1;
              }
              if (a.similarity > b.similarity) {
                return -1;
              }
              return 0;
            }

            objects.sort(compare_similarity);
            console.log("Done");
            console.log(objects);
            res.json(objects);
          }
        );
      }
    );

    // res.send(data);
  });
});

module.exports = router;
