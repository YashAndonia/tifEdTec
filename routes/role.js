const router = require("express").Router();

const errorMessage = require("../commons/errorMessage");
const scopeCheck = require("../middleware/scopeCheck");
//get model

const Role = require("../models/role.model");

router.route("/create").post(scopeCheck("role-create"), async (req, res) => {
  createRole(req)
    .then((role) => res.json({ status: true }))
    .catch((err) => errorMessage(res, err));
});

router.route("/getList").get(scopeCheck("role-get"), async (req, res) => {
  try {
    let role = await Role.find();
    res.json({ data: role });
  } catch (error) {
    errorMessage(res, error);
  }
});

//update role by name
router
  .route("/updateSingle")
  .post(scopeCheck("role-edit"), async (req, res) => {
    updateRole(req)
      .then((role) => res.json({ status: true }))
      .catch((err) => errorMessage(res, err));
  });

router
  .route("/removeSingle")
  .post(scopeCheck("role-remove"), async (req, res) => {
    Role.deleteOne({ name: req.body.name })
      .then(() => res.json({ status: true }))
      .catch((err) =>
        res.status(400).json({
          status: false,
          errors: [{ message: err }],
        })
      );
  });

async function updateRole(req) {
  let role = await Role.findOne({ name: req.body.name });
  role.scopes = req.body.scopes;
  return await role.save();
}

async function createRole(req) {
  let role = await Role.findOne({ name: req.body.name });
  if (role) throw new Error("role already registered");
  let toSend = req.body;
  role = new Role(toSend);
  return await role.save();
}

module.exports = router;
