const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const roleSchema = new Schema(
  {
    name: { type: String },
    scopes: { type: [String], default: [] },
  },
  {
    timestamps: true,
    collection: "role",
  }
);

const Role = mongoose.model("Role", roleSchema);
module.exports = Role;
