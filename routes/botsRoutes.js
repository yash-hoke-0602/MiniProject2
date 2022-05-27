const express = require("express");
const mongoose = require("mongoose");
const Posts = mongoose.model("Post");

const requireToken = require("../middleware/requireToken");
var similarity = require("string-cosine-similarity");

const router = express.Router();

router.get("/getUser", requireToken, (req, res) => {
  // console.log("got req");
  res.status(200).json({ userId: req.user._id });
});

router.post("/pdfSearch", (req, res) => {
  Posts.find({}, "postaddress postname postText", (err, data) => {
    if (err) return res.send({ error: "error occured" });

    var string1 = req.body.searchQuery;
    const objects = [];

    for (var i = 0; i < data.length; i++) {
      var string2 = data[i].postText;

      var similarityScore = 0;

      if (isNaN(similarity(string2, string1))) {
        similarityScore = 0;
      } else {
        similarityScore = similarity(string2, string1);
        objects.push({
          similarity: similarityScore,
          postData: data[i],
        });
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
    res.json(objects);
  });
});

router.post("/chatBot", (req, res) => {
  // console.log(req.body.userResponse);

  // const commandArray = [
  //   "name",
  //   "prn",
  //   "branch",
  //   "year",
  //   "address",
  //   "internship",
  //   "pointer",
  //   "achievement",
  //   "placement",
  // ];

  // var maxScore = 0.0;
  var maxCommand = "year";
  // for (var i = 0; i < commandArray.length; i++) {
  //   const similarityScore = await similarity(
  //     req.body.userResponse,
  //     commandArray[i]
  //   );
  //   if (!(await isNaN(similarityScore))) {
  //     if (similarityScore > maxScore) {
  //       maxScore = similarityScore;
  //       maxCommand = commandArray[i];
  //     }
  //   }
  // }
  console.log(maxCommand);
  res.json({ commandResponse: maxCommand });
});

router.get("/movieGameBot", async (req, res) => {
  console.log("Cool");
  if (!req.session.moviesList) {
    console.log("----------------------------");
    const movieObject = {
      avengers: false,
      "baby boss": false,
      cars: false,
      "dark knight": false,
      elysium: false,
      "fast and furious": false,
      "green lantern": false,
      "happy new year": false,
      interstellar: false,
      joker: false,
      "kung fu panda": false,
      "life of pie": false,
      "man of steel": false,
      "no problem": false,
      overlord: false,
      pink: false,
      quarantine: false,
      "rush hour": false,
      "spider Man": false,
      tenet: false,
      up: false,
      venom: false,
      wanted: false,
      "x-men": false,
      yaadein: false,
      "zombie land": false,
    };
    req.session.moviesList = movieObject;
    console.log(req.session.moviesList);
  }
  console.log("Cool2");
  for (var item in req.session.moviesList) {
    req.session.moviesList[item] = false;
    console.log(item + "-" + req.session.moviesList[item]);
  }
  console.log(req.session.moviesList);
  res.json({ movieList: req.session.moviesList });
});

router.post("/setMovieGameBot", async (req, res) => {
  console.log(req.body.moviesList);
  req.session.moviesList = req.body.moviesList;
  res.json({ message: "success" });
});

router.get("/destroyMovieGameBot", async (req, res) => {
  req.session.moviesList = null;
  res.json({ message: "success" });
});

module.exports = router;
