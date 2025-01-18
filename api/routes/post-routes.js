const express = require("express");
const router = express.Router();
const { createPost, getPosts,likeEntity,getUserPosts, unlikeEntity,getSinglePost,createCommentOrReply} = require("../controller/post-Controller");

router.post("/create", createPost);
router.get("/gets", getPosts); // Ensure this matches exactly
// router.post("/:postId/:userId/like", likePost);
// router.post("/:postId/:userId/unlike", unlikePost);
router.get("/:postId/get/singlePost", getSinglePost);
router.post("/user/:postId/comment",createCommentOrReply);


router.post("/:type/:entityId/like", likeEntity);
router.post("/:type/:entityId/unlike", unlikeEntity);
router.get("/all/user/:userId", getUserPosts);




module.exports = router;
