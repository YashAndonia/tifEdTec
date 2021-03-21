const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema(
  {
    first_name: { type: String },
    last_name: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
    classroom: { type: String },
  },
  {
    timestamps: true,
    collection: "profile",
  }
);

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;
