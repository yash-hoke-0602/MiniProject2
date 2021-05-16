const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

router.post("/admin/add", async (req, res) => {
  //add data
  console.log("data Added");
});

router.post("/admin/delete", async (req, res) => {
  //delete data
  console.log("data Delted");
});

router.get("/view", async (req, res) => {
  //show data
  console.log("data Sent");
  res.send("data Sent");
});

module.exports = router;
