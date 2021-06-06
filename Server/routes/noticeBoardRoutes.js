const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Noticeboard = mongoose.model("Noticeboard");

router.post("/admin/add", async (req, res) => {
  //add data
  const notice = new Noticeboard(req.body);

  try {
    await notice.save();
    res.send("Data added");
    console.log("data Added");
  } catch (error) {
    console.log("data not Added");
  }
});

router.post("/admin/delete", async (req, res) => {
  //delete data
  console.log("data Deleted");
});

router.get("/view", (req, res) => {
  Noticeboard.find({}, "email text", (err, data) => {
    if (err) return res.send({ error: "error occured" });
    //console.log(data);
    res.send(data);
  });
});

module.exports = router;
