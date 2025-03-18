const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mouSchema = new Schema({
  title: String,
  content: [
    {
      section: String,
      text: String,
      clauses: [{ text: String }],
    },
  ],
});

const MouModel = mongoose.model('moudocument', mouSchema);
module.exports = MouModel;


