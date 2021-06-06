//model name Post
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema({
  folderid: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  postname: {
    type: String,
    required: true,
  },
  postinfo: {
    type: String,
  },
 postaddress:{ type: String,
 	
 }
});

mongoose.model("Post", postSchema);