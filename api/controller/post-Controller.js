const Post = require("../models/Post");
const User = require("../models/User");

const createPost = async (req, res) => {
  try {
    const { content, userId } = req.body;

    // Validate input
    if (!content || !userId) {
      return res.status(400).json({
        success: false,
        message: "Content and User ID are required",
      });
    }

    // Validate user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Save post to the database
    const newPost = new Post({ user: userId, content });
    await newPost.save();

    res.status(201).json({
      success: true,
      message: "Post created successfully",
    });
  } catch (error) {
    console.error("Error creating post:", error.message || error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getSinglePost = async (req, res) => {
  const { postId } = req.params;

  try {
    // Fetch the post and populate user info for the post, comments, and replies
    const post = await Post.findById(postId)
      .populate("user", "username avatar")
      .populate("comments.user", "username avatar")
      .populate("comments.replies.user", "username avatar");
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fetched the post successfully!",
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the post",
    });
  }
};




// Create a new comment or reply to an existing comment
const createCommentOrReply = async (req, res) => {
  const { postId } = req.params;
  const { userId, content, commentId } = req.body; // commentId is optional

  try {
    const post = await Post.findById(postId); // Find the post by its ID
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    if (commentId) {
      // If a commentId is provided, it means the user is replying to an existing comment
      const comment = post.comments.id(commentId); // Find the specific comment by its _id
      if (!comment) {
        return res
          .status(404)
          .json({ success: false, message: "Comment not found" });
      }

      // Create the reply (nested under the specific comment)
      const newReply = {
        user: userId,
        content,
      };

      // Push the new reply to the comment's replies array
      comment.replies.push(newReply);

      await post.save(); // Save the updated post with the new reply

      res.status(201).json({
        success: true,
        message: "Reply added successfully!",
        reply: newReply, // Return the newly added reply
      });
    } else {
      // If no commentId is provided, this means the user is creating a new comment
      const newComment = {
        user: userId,
        content,
      };

      // Add the new comment to the post's comments array
      post.comments.push(newComment);

      await post.save(); // Save the updated post with the new comment

      res.status(201).json({
        success: true,
        message: "Comment added successfully!",
        comment: newComment, // Return the newly added comment
      });
    }
  } catch (error) {
    console.error("Error creating comment/reply:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while adding the comment/reply",
    });
  }
};

//endpoint to get all the posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
    .populate("user", "username avatar")
    .populate("comments.user", "username avatar")
    .populate("comments.replies.user", "username avatar")
    .sort({ createdAt: -1 });

    res.status(200).json({ success: true, message: "All Post Data", posts });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while getting the posts",
    });
  }
};

const likeEntity = async (req, res) => {
  const { type, entityId } = req.params;
  const { userId } = req.body;

  try {
    let updateQuery;

    switch (type) {
      case "post":
        updateQuery = { _id: entityId, likes: { $ne: userId } };
        await Post.updateOne(updateQuery, { $addToSet: { likes: userId } });
        break;

      case "comment":
        updateQuery = {
          "comments._id": entityId,
          "comments.likes": { $ne: userId },
        };
        await Post.updateOne(updateQuery, {
          $addToSet: { "comments.$.likes": userId },
        });
        break;

      case "reply":
        updateQuery = {
          "comments.replies._id": entityId,
          "comments.replies.likes": { $ne: userId },
        };
        await Post.updateOne(
          updateQuery,
          {
            $addToSet: { "comments.$[].replies.$[reply].likes": userId },
          },
          { arrayFilters: [{ "reply._id": entityId }] }
        );
        break;

      default:
        return res.status(400).json({ message: "Invalid type" });
    }

    res.status(200).json({ message: "Liked successfully!" });
  } catch (error) {
    console.error("Error liking entity:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const unlikeEntity = async (req, res) => {
  const { type, entityId } = req.params;
  const { userId } = req.body;

  try {
    let updateQuery;

    switch (type) {
      case "post":
        updateQuery = { _id: entityId };
        await Post.updateOne(updateQuery, { $pull: { likes: userId } });
        break;

      case "comment":
        updateQuery = { "comments._id": entityId };
        await Post.updateOne(updateQuery, {
          $pull: { "comments.$.likes": userId },
        });
        break;

      case "reply":
        updateQuery = { "comments.replies._id": entityId };
        await Post.updateOne(
          updateQuery,
          {
            $pull: { "comments.$[].replies.$[reply].likes": userId },
          },
          { arrayFilters: [{ "reply._id": entityId }] }
        );
        break;

      default:
        return res.status(400).json({ message: "Invalid type" });
    }

    res.status(200).json({ message: "Unliked successfully!" });
  } catch (error) {
    console.error("Error unliking entity:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const deletePost = async (req,res)=>{
   const {userId} = req.params;
   try{
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

   return res.status(200).json({success:true, message:"Post Delete Successfully!"})

   }
   catch(error){
       return  res.status(500).json({success:false, message:"somthing went wrong!"})
   }
 

 

}

module.exports = {
  createPost,
  getSinglePost,
  getPosts,
  likeEntity,
  unlikeEntity,
createCommentOrReply,
deletePost
};
