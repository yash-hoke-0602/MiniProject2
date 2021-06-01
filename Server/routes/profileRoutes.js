const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const Profile = mongoose.model("Profile");

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

router.post(
  "/uploadPhoto",
  upload.single("photo"),
  requireToken,
  async (req, res) => {
    // console.log("file", req.file.filename);
    // console.log(req.user);
    const doc = await Profile.findOne({ userid: req.user._id });
    doc.image = "/profiles/" + req.file.filename;
    await doc.save();

    res.status(200).json({
      message: "success!",
    });
  }
);

//send the profile data of user using req.user._id

router.get("/", requireToken, (req, res) => {
  Profile.findOne({ userid: req.user._id }, "image", (err, imgUrl) => {
    if (err) return console.log(err);
    // console.log(imgUrl.image);
    res.status(200).json({
      email: req.user.email,
      img: imgUrl.image,
    });
  });
});

//update the profile data (overwrite new Data on current data)

router.post("/update", requireToken, async (req, res) => {
  //Profile.findone({userid:req.user._id});
  Profile.deleteOne({ userid: req.user._id });
  const profile = new Profile(req.body);

  try {
    await profile.save();
    res.send("Data added");
    console.log("data Added");
  } catch (error) {
    console.log("data not Added");
  }
});

module.exports = router;
