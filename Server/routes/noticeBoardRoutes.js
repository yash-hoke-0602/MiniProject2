const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Noticeboard = mongoose.model('Noticeboard');
router.post("/admin/add", async (req, res) => {
  //add data
  const notice = new Noticeboard(req.body);

  try {
    await notice.save();
    res.send("Data added")
    console.log("data Added");
  } catch (error) {
    console.log("data not Added");
  }
  
});

router.post("/admin/delete", async (req, res) => {
  //delete data
  console.log("data Delted");
});

router.get("/view", async (req, res) => {
  //show data
   const notice = await Noticeboard.find({});

  try {
   res.send(notice);
  } catch (error) {
    res.send("Error in data sent");
  }
});

module.exports = router;
