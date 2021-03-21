const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//look at .env file of this folder
const uri = process.env.ATLAS_URI;

//connect to te mongo atlas dashboard
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Connection to mongo db established succesfully");
});

//routes:
const usersRouter = require("./routes/user");
const rolesRouter = require("./routes/role");
const schoolRouter = require("./routes/school");
const profileRouter = require("./routes/profile");
app.use("/user", usersRouter);
app.use("/role", rolesRouter);
app.use("/school", schoolRouter);
app.use("/profile", profileRouter);

//app listn
app.listen(port, () => {
  console.log("Server running on port ", port);
});

//when closing the app
process.on("SIGINT", function () {
  mongoose.connection.close(function () {
    console.log("Mongoose disconnected on app termination");
    process.exit(0);
  });
});
