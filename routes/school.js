const router = require("express").Router();

const errorMessage = require("../commons/errorMessage");
const scopeCheck = require("../middleware/scopeCheck");
const Profile = require("../models/profile.model");

//get model
const School = require("../models/school.model");

//get all schools
router.route("/").get(scopeCheck("school-get"), async (req, res) => {
  School.find()
    .then((schools) => {
      res.json({
        status: true,
        content: {
          data: schools,
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

//get all students in this school
router
  .route("/:_id/students")
  .get(scopeCheck("school-get"), async (req, res) => {
    getAllStudents(req)
      .then((toSend) => res.json(toSend))
      .catch((err) => errorMessage(res, err.message));
  });

//add school:
router.route("/").post(scopeCheck("school-create"), async (req, res) => {
  let school = new School(req.body);
  school.save().then(() =>
    res.json({ status: true }).catch((err) =>
      res.json({
        status: false,
        errors: [{ message: "Something went wrong" }],
      })
    )
  );
});

//patch
router.route("/:_id").patch(scopeCheck("school-edit"), async (req, res) => {
  patchSchool()
    .then((school) => res.json({ status: true }))
    .catch((err) => errorMessage(res, err.message));
});

async function patchSchool(req) {
  let _id = req.params._id;

  let school = await School.findById(_id);
  if (!school) {
    throw new Error("Something went wrong");
  } else {
    school.set(req.body);
  }

  return await school.save();
}

async function getAllStudents(req) {
  let schoolId = req.params._id;
  let currentSchool = await School.findById(schoolId);
  let allProfiles = await Profile.find({ schoolId: schoolId });

  if (currentSchool && allProfiles) {
    return {
      status: true,
      content: {
        data: [{ ...currentSchool._doc, students: allProfiles }],
      },
    };
  } else {
    throw new Error("Something went wrong");
  }
}
module.exports = router;
