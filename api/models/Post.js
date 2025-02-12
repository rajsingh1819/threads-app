const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const commentSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  images: { 
    cloudinary: { type: String }, // Cloudinary URL
    local: { type: String }, // Local image path
  },
  content: { 
    type: String, 
    required: true 
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
    }
  ],


  replies: [replySchema], // Nested replies for each comment
  createdAt: {
    type: Date, 
    default: Date.now,
  },
  
});

const postSchema = new mongoose.Schema({
  content: { 
    type: String, 
    required: true 
  },
  images: { 
    cloudinary: { type: String }, // Cloudinary URL
    local: { type: String }, // Local image path
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
    }
  ],
  comments: [commentSchema], // Nested comments and replies
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
