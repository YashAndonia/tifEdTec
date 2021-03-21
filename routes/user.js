const router = require("express").Router();
const bcrypt = require("bcrypt");
const phone = require("phone");
const errorMessage = require("../commons/errorMessage");
const scopeCheck = require("../middleware/scopeCheck");

//get model
const { User } = require("../models/user.model");

router.route("/").get(scopeCheck("user-get"), async (req, res) => {
  User.find()
    .then((users) => {
      res.json({
        status: true,
        content: {
          data: users,
        },
      });
    })
    .catch((err) => {
      res.json({
        status: false,
        errors: [{ message: "Something went wrong" }],
      });
    });
});

//patch
router.route("/:_id").patch(scopeCheck("user-edit"), async (req, res) => {
  let _id = req.params._id;

  patchUser(_id, req)
    .then((user) => {
      console.log(user);
      res.json({ status: true });
    })
    .catch((err) => {
      errorMessage(res, err);
    });
});
//sign up User
router.route("/signup").post(async (req, res) => {
  signUpUser(req)
    .then(async (user) => {
      const token = await user.generateAuthToken();
      res.header("x-auth-token", token).json({ status: true });
    })
    .catch((err) => {
      console.log(err);
      errorMessage(res, err);
    });
});

//signin user:
router.post("/signin", async (req, res) => {
  signInUser(req)
    .then((toSend) => res.json(toSend))
    .catch((err) => errorMessage(res, err));
});

async function signInUser(req) {
  let user = await User.findOne({ email: req.body.email });
  if (!user) throw new Error("User already exists");

  //compare hashed passwords
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) throw new Error("Passwords not matched");

  const token = await user.generateAuthToken();
  let toSend = {
    status: false,
    content: {
      data: {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        mobile: user.mobile,
        roleId: user.roleId,
        created: user.createdAt,
        updated: user.updatedAt,
      },
      token: token,
    },
  };
  return toSend;
}

async function patchUser(_id, req) {
  let user = await User.findById(_id);
  if (!user) {
    throw new Error("User does not exist");
  } else {
    user.set(req.body);
  }

  return await user.save();
}

async function signUpUser(req) {
  //checking if user already exists
  let user = await User.findOne({ email: req.body.email });
  if (user) throw new Error("User already registered");

  let toSend = req.body;
  toSend.mobile = phone(req.body.mobile)[0];

  //hash password
  let salt = await bcrypt.genSalt(10);
  toSend.password = await bcrypt.hash(req.body.password, salt);

  user = new User(toSend);
  console.log(user);

  return await user.save();
}

module.exports = router;
