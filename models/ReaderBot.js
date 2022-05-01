//model name Post
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const readerBotSchema = new Schema({
  userid: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  docname: {
    type: String,
    required: true,
  },
  // postinfo: {
  //   type: String,
  // },
  docaddress: { type: String },
});

mongoose.model("ReaderDocs", readerBotSchema);
