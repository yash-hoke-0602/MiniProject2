//model name UserLike
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const likeSchema = new Schema({
  userid: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  folderid: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

mongoose.model("UserLike", likeSchema);
