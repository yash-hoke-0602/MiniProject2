//model name Folder
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const folderSchema = new Schema({
  userid: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  foldername: {
    type: String,
    required: true,
  },
  foldertag: {
    type: String,
    required: true,
  },
  folderdescription: {
    type: String,
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  date: { type: Date, default: Date.now },
});

mongoose.model("Folder", folderSchema);
