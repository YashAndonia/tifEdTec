const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const config = require("config");
const Role = require("./role.model");

const userSchema = new Schema(
  {
    first_name: { type: String, default: "" },
    last_name: { type: String, default: "" },
    email: { type: String, default: "", unique: true },
    mobile: { type: String, default: "", unique: true },
    password: { type: String, required: true },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: "Role",
    },
  },
  {
    timestamps: true,
    collection: "user",
  }
);

userSchema.methods.generateAuthToken = async function () {
  let payload = {
    _id: this._id,
    first_name: this.first_name,
    last_name: this.last_name,
    email: this.email,
    mobile: this.mobile,
    password: this.password,
    created: this.createdAt,
    updated: this.updatedAt,
    role: await Role.findById(this.roleId).select({
      _id: 1,
      name: 1,
      scopes: 1,
    }),
  };

  const token = jwt.sign(payload, config.get("jwtPrivateKey"));
  return token;
};

//example of validation
function validateUser(user) {
  const schema = {
    email: Joi.string().required(),
    mobile: Joi.string().required(),
    first_name: Joi.string(),
    last_name: Joi.string(),
    password: Joi.string(),
    roleId: Joi.string(),
  };

  return Joi.validate(user, schema);
}
const User = mongoose.model("User", userSchema);
exports.User = User;
exports.validate = validateUser;
