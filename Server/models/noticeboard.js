const mongoose = require("mongoose");
const noticeboardSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: { type: Date, default: Date.now },
});

mongoose.model("Noticeboard", noticeboardSchema);
