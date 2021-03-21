// https://softwareontheroad.com/nodejs-jwt-authentication-oauth/
const jwt = require("jsonwebtoken");
const config = require("config");
const errorMessage = require("../commons/errorMessage");

module.exports = function (functionScope) {
  return async function (req, res, next) {
    console.log("REQUIRED:", functionScope);
    const token = req.header("x-auth-token");
    if (!token)
      return res
        .status(401)
        .send("Please add valid authorization token in x-auth-token in header");

    try {
      const decodedUser = jwt.verify(token, config.get("jwtPrivateKey"));
      console.log("AVAILABLE:", decodedUser.role.scopes);
      //check if the scope required by our function is present in the current user
      if (decodedUser.role.scopes.includes(functionScope)) {
        next();
      } else {
        errorMessage(res, "Permissions not granted to this user as per scopes");
      }
    } catch (ex) {
      console.log(ex);
      errorMessage(res, "Something went wrong");
    }
  };
};
