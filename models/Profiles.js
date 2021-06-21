const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const profileSchema = new Schema({
  userid: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
  },
  prn: {
    type: String,
  },
  image: {
    type: String,
    default: "/profiles/defaultUser.png",
  },
  branch: {
    type: String,
  },
  year: {
    type: Number,
    default: 0,
  },
  address: {
    type: String,
  },
  pointer: {
    type: Number,
    default: 0,
  },
  internship: {
    type: String,
  },
  acheivement: {
    type: String,
  },
  placement: {
    type: String,
  },
});

mongoose.model("Profile", profileSchema);
