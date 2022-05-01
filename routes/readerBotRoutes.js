var multer = require("multer");
const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const pdf = require("pdf-parse");

const { createWorker } = require("tesseract.js");

const worker = createWorker();

const ReaderDocs = mongoose.model("ReaderDocs");

const requireToken = require("../middleware/requireToken");

const router = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "readerDocs");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + file.originalname);
  },
});

var upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), async ({ body, file }, res) => {
  //   console.log(body);
  console.log(file);
  //   res.send("Good");
  const doc = await ReaderDocs.findOne({ userid: body.user });
  if (!doc) {
    const data = {
      userid: body.user,
      docaddress: file.filename,
      docname: file.originalname,
    };
    console.log(body.user);
    console.log(data);
    const readerDocs = new ReaderDocs(data);

    try {
      await readerDocs.save();
      res.json({
        status: "SUCCESS",
        responseData: {
          msg: "Doc added",
        },
      });
    } catch (error) {
      console.log("Folder not Created");
    }
  } else {
    doc.userid = body.user;
    doc.docaddress = file.filename;
    doc.docname = file.originalname;

    await doc.save();

    res.status(200).json({
      message: "success!",
    });
  }
});

router.post(
  "/uploadImage",
  upload.single("photo"),
  requireToken,
  async (req, res) => {
    // console.log("file", req.file.filename);
    // console.log(req.user);
    const doc = await ReaderDocs.findOne({ userid: req.user._id });
    if (!doc) {
      const data = {
        userid: req.user._id,
        docaddress: req.file.filename,
        docname: req.file.originalname,
      };
      const readerDocs = new ReaderDocs(data);

      try {
        await readerDocs.save();
        res.json({
          status: "SUCCESS",
          responseData: {
            msg: "Doc added",
          },
        });
      } catch (error) {
        console.log("Folder not Created");
      }
    } else {
      doc.userid = req.user._id;
      doc.docaddress = req.file.filename;
      doc.docname = req.file.originalname;

      await doc.save();

      res.status(200).json({
        message: "success!",
      });
    }
  }
);

router.get("/convert", requireToken, (req, res) => {
  // ReaderDocs.findOne({ userid: req.user._id }, (err, profData) => {
  //   if (err) return console.log(err);
  //   // console.log(imgUrl.image);
  //   const pdffile = fs.readFileSync("readerDocs/" + profData.docaddress);
  //   pdf(pdffile).then(function (data) {
  //     res.status(200).json({ pdfText: data.text });
  //   });
  // });
});

router.get("/getUser", requireToken, (req, res) => {
  // console.log("got req");
  res.status(200).json({ userId: req.user._id });
});

module.exports = router;
