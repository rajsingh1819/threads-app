const Post = require("../models/Post");

const createPost = async (req, res) => {
  try {
    const { content, userId } = req.body;

    // Validate required fields
    if (!content) {
      return res.status(400).json({ 
        success: false, 
        message: "Content is required" 
      });
    }

    // Prepare and save the post data
    const newPostData = { user: userId, content };
    const newPost = new Post(newPostData);
    await newPost.save();

    res.status(201).json({ 
      success: true, 
      message: "Post saved successfully" 
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ 
      success: false, 
      message: "Post creation failed" 
    });
  }
};

const getSinglePost = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findOne({ _id: postId }).populate("user", "username");
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
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the post",
    });
  }
};



//endpoint to get all the posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.status(200).json( {  success: true, message: "All Post Data", posts});
  } catch (error) {
    res.status(500).json({  success: false,  message: "An error occurred while getting the posts" });
  }
};

// const getPosts = async (req, res) => {
//   try {
//     const posts = await Post.find()
//       .populate("user", "name")
//       .sort({ createdAt: -1 });
//     // .populate("user", "name profilePicture")

//     res.status(200).json(posts);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "An error occurred while getting the posts" });
//   }
// };

//endpoint for liking a particular post

const likePost = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.params.userId; // Assuming you have a way to get the logged-in user's ID

  try {
    const post = await Post.findById(postId).populate("user", "name");

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } }, // Add user's ID to the likes array
      { new: true } // To return the updated post
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    updatedPost.user = post.user;

    res.json(updatedPost);
  } catch (error) {
    console.error("Error liking post:", error);
    res
      .status(500)
      .json({ message: "An error occurred while liking the post" });
  }
};

//endpoint to unlike a post

const unlikePost = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.params.userId;

  try {
    const post = await Post.findById(postId).populate("user", "name");

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true }
    );

    updatedPost.user = post.user;

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error("Error unliking post:", error);
    res
      .status(500)
      .json({ message: "An error occurred while unliking the post" });
  }
};

module.exports = { createPost, getPosts, likePost, unlikePost,getSinglePost };
