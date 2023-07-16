const express = require("express");
const authMiddleware = require("../controler/authMiddleware.js");

const router = express.Router();

const {
  getAllUsers,
  addNewUser,
  login,
  deleteUser,
  updateUser,
  getOneUser,
} = require("../controler/users");

router.get(
  "/getallusers",
  authMiddleware(["Admin", "manager_users"]),
  getAllUsers
);
router.get("/:id_user", authMiddleware(["Admin", "manager_users"]), getOneUser);
router.post("/adduser", addNewUser);
router.post("/login", login);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);

module.exports = router;
