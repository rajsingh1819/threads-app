const express = require("express");
const router = express.Router();
const { createPost, getPosts, likePost, unlikePost ,getSinglePost} = require("../controller/post-Controller");

router.post("/create", createPost);
router.get("/gets", getPosts); // Ensure this matches exactly
router.post("/:postId/:userId/like", likePost);
router.post("/:postId/:userId/unlike", unlikePost);
router.get("/:postId/get/singlePost", getSinglePost);




module.exports = router;
