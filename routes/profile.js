const router = require("express").Router();

const errorMessage = require("../commons/errorMessage");
const scopeCheck = require("../middleware/scopeCheck");
//get model

const Profile = require("../models/profile.model");
const School = require("../models/school.model");
const { User } = require("../models/user.model");

//get all profiles
router.route("/getList").get(scopeCheck("profile-get"), async (req, res) => {
  Profile.find()
    .then((profiles) => {
      res.json({
        status: true,
        content: {
          data: profiles,
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

//add profile (requires schoolId,userId,classroom)
router.route("/create").post(scopeCheck("profile-create"), async (req, res) => {
  //we need to make a User object and match the school id

  createProfile(req)
    .then((profile) => res.json({ status: true }))
    .catch((err) => errorMessage(res, err));
});

//patch
router.route("/:_id").patch(scopeCheck("profile-edit"), async (req, res) => {
  patchProfile(req)
    .then((profile) => res.json({ status: true }))
    .catch((err) => errorMessage(res, err));
});

async function patchProfile(req) {
  let _id = req.params._id;
  let profile = await Profile.findById(_id);

  if (!profile) {
    throw new Error("Something went wrong");
  } else {
    profile.set(req.body);
  }

  return await profile.save();
}

async function createProfile(req) {
  let school = await School.findById(req.body.schoolId);
  if (!school) {
    throw new Error("Something went wrong");
  } else {
    let user = await User.findById(req.body.userId);
    if (!user) {
      throw new Error("Something went wrong");
    } else {
      //we can make the profile
      let profileObject = {
        first_name: user.first_name,
        last_name: user.last_name,
        schoolId: req.body.schoolId,
        userId: req.body.userId,
        classroom: req.body.classroom,
      };
      let profile = new Profile(profileObject);
      return await profile.save();
    }
  }
}

module.exports = router;
