const express = require("express");
const mongoose = require("mongoose");
var multer = require("multer");

const router = express.Router();

const Noticeboard = mongoose.model("Noticeboard");

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "feeds");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + "-" + Date.now() + file.originalname);
//   },
// });

//var upload = multer({ storage: storage });

var upload = multer({ dest: "feeds/" });

router.post("/upload", upload.single("file"), async (req, res) => {
  console.log(req.body);
  console.log(req.files);

  // const data = {
  //   folderid: body.folderId,
  //   postaddress: file.filename,
  //   postname: file.originalname,
  // };
  // const posts = new Posts(data);

  // try {
  //   await posts.save();
  //   res.json({
  //     status: "SUCCESS",
  //     responseData: {
  //       msg: "post added",
  //     },
  //   });
  // } catch (error) {
  //   console.log("Folder not Created");
  // }
});

router.post("/admin/add", async (req, res) => {
  //add data
  const notice = new Noticeboard(req.body);
  console.log(req.body);
  try {
    await notice.save();
    res.send({ msg: "Data added" });
    console.log("data Added");
  } catch (error) {
    res.send({ msg: "Data not added" });
    console.log("data not Added");
  }
});

router.get("/admin/delete/:id", async (req, res) => {
  try {
    const notice = await Noticeboard.deleteOne({ _id: req.params.id });

    res.send({ msg: "Folder Deleted" });
    console.log("Folder deleted");
  } catch (error) {
    res.send({ msg: "error" });
    console.log("Folder not deleted");
  }
});

router.get("/view", (req, res) => {
  Noticeboard.find({}, "email text", (err, data) => {
    if (err) return res.send({ error: "error occured" });
    //console.log(data);
    res.send(data);
  });
});

module.exports = router;
