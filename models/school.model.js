const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schoolSchema = new Schema(
  {
    public_id: { type: mongoose.Schema.Types.ObjectId, unique: true },
    name: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
  },
  {
    timestamps: true,
    collection: "school",
  }
);

const School = mongoose.model("School", schoolSchema);
module.exports = School;
