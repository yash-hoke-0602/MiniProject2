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
  Profile.findOne({ userid: req.user._id }, (err, profData) => {
    if (err) return console.log(err);
    // console.log(imgUrl.image);
    res.status(200).json({ profData, email: req.user.email });
  });
});

//update the profile data (overwrite new Data on current data)

router.post("/update", requireToken, async (req, res) => {
  //console.log(typeof req.body.year);
  const doc = await Profile.findOne({ userid: req.user._id });
  doc.name = req.body.name;
  doc.prn = req.body.PRN;
  doc.branch = req.body.branch;
  doc.year = Number(req.body.year);
  doc.address = req.body.address;
  doc.pointer = Number(req.body.pointer);
  doc.internship = req.body.internship;
  doc.acheivement = req.body.acheivement;
  doc.placement = req.body.placement;

  await doc.save();

  res.status(200).json({
    message: "success!",
  });

  // Profile.deleteOne({ userid: req.user._id });
  // const profile = new Profile(req.body);

  // try {
  //   await profile.save();
  //   res.send("Data added");
  //   console.log("data Added");
  // } catch (error) {
  //   console.log("data not Added");
  // }
});

router.get("/viewAll", (req, res) => {
  Profile.find({}, (err, profData) => {
    if (err) return console.log(err);
    console.log(profData);
    res.status(200).json(profData);
  });
});

module.exports = router;
