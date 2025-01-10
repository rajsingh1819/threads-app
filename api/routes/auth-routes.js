const express = require("express");

const router = express.Router();

const {
  registerUser,
  verifyUserToken,
  loginUser,
  getUsers,
} = require("../controller/auth-controller");

const {
  follow,
  unfollow,
  approveFollowRequest,
  denyFollowRequest,
  userProfile,
  userPrivacy,
} = require("../controller/user-controller");

router.post("/user/register", registerUser);
router.get("/user/verify/:token", verifyUserToken);
router.post("/user/login", loginUser);
router.get("/users/:userId", getUsers);

router.post("/user/follow", follow);
router.post("/user/unfollow", unfollow);
router.post("/user/approveFollowRequest", approveFollowRequest);
router.post("/user/denyFollowRequest", denyFollowRequest);
router.post("/profile/set-privacy", userPrivacy);
router.get("/profile/:userId", userProfile);

module.exports = router;

/*
POST /user/follow → POST /users/:userId/follow
POST /profile/set-privacy → PATCH /users/:userId/privacy
*/
