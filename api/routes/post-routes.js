const express = require("express");
const router = express.Router();
const { createPost, getPosts,likeEntity, unlikeEntity,getSinglePost,createCommentOrReply,deletePost} = require("../controller/post-Controller");

router.post("/create", createPost);
router.get("/gets", getPosts); 
router.get("/:postId/get/singlePost", getSinglePost);
router.post("/user/:postId/comment",createCommentOrReply);


router.post("/:type/:entityId/like", likeEntity);
router.post("/:type/:entityId/unlike", unlikeEntity);
router.delete("/delete/:userId", deletePost);





module.exports = router;
