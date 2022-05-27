const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const movieSchema = new Schema({
  userid: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  movieName: {
    type: String,
    required: true,
  },
});

mongoose.model("MovieNames", movieSchema);
