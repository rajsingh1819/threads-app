const User = require("../models/User");
require("dotenv").config();

const follow = async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;

  if (!currentUserId || !selectedUserId) {
    return res.status(400).json({ message: "Both user IDs are required" });
  }

  try {
    const selectedUser = await User.findById(selectedUserId);
    if (!selectedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (selectedUser.isPrivate) {
      await User.findByIdAndUpdate(currentUserId, {
        $addToSet: { sentFollowRequests: selectedUserId },
      });
      await User.findByIdAndUpdate(selectedUserId, {
        $addToSet: { receivedFollowRequests: currentUserId },
      });
      return res
        .status(200)
        .json({ message: "Follow request sent successfully." });
    } else {
      await User.findByIdAndUpdate(currentUserId, {
        $addToSet: { following: selectedUserId },
      });
      await User.findByIdAndUpdate(selectedUserId, {
        $addToSet: { followers: currentUserId },
      });

      const updatedUser = await User.findById(currentUserId);
      return res.status(200).json({
        message: "You are now following the user.",
        user: updatedUser,
      });
    }
  } catch (error) {
    console.error("Error in follow operation:", error);
    return res.status(500).json({ message: "Error in following the user." });
  }
};

const unfollow = async (req, res) => {
  const { currentUserId, targetUserId } = req.body;

  if (!currentUserId || !targetUserId) {
    return res.status(400).json({ message: "User IDs are required" });
  }

  try {
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (targetUser?.isPrivate) {
      // If the user is private, remove the follow request instead of unfollowing
      await User.findByIdAndUpdate(targetUserId, {
        $pull: { receivedFollowRequests: currentUserId },
      });

      await User.findByIdAndUpdate(currentUserId, {
        $pull: { sentFollowRequests: targetUserId },
      });

      await User.findByIdAndUpdate(targetUserId, {
        $pull: { followers: currentUserId }, // Remove the current user from the target user's followers list
      });

      await User.findByIdAndUpdate(currentUserId, {
        $pull: { following: targetUserId }, // Remove the target user from the current user's following list
      });

      return res
        .status(200)
        .json({ message: "Unfollowed private user successfully" });

      return res
        .status(200)
        .json({ message: "Follow request canceled successfully." });
    } else {
      // If the user is public, proceed with normal unfollowing
      await User.findByIdAndUpdate(targetUserId, {
        $pull: { followers: currentUserId },
      });

      await User.findByIdAndUpdate(currentUserId, {
        $pull: { following: targetUserId },
      });

      const updatedUser = await User.findById(currentUserId);
      return res
        .status(200)
        .json({ message: "Unfollowed successfully", user: updatedUser });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in unfollowing user" });
  }
};

// Approve Follow Request
const approveFollowRequest = async (req, res) => {
  const { currentUserId, senderUserId } = req.body;

  if (!currentUserId || !senderUserId) {
    return res.status(400).json({ message: "Both user IDs are required." });
  }

  try {
    // Remove follow request
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { receivedFollowRequests: senderUserId },
      $addToSet: { followers: senderUserId },
    });

    await User.findByIdAndUpdate(senderUserId, {
      $pull: { sentFollowRequests: currentUserId },
      $addToSet: { following: currentUserId },
    });

    return res.status(200).json({ message: "Follow request approved." });
  } catch (error) {
    console.error("Error approving follow request:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Deny Follow Request
const denyFollowRequest = async (req, res) => {
  const { currentUserId, senderUserId } = req.body;

  if (!currentUserId || !senderUserId) {
    return res.status(400).json({ message: "Both user IDs are required." });
  }

  try {
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { receivedFollowRequests: senderUserId },
    });

    await User.findByIdAndUpdate(senderUserId, {
      $pull: { sentFollowRequests: currentUserId },
    });

    return res.status(200).json({ message: "Follow request denied." });
  } catch (error) {
    console.error("Error denying follow request:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// /profile/:userId
const userProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .populate("followers", "username avatar")
      .sort({ createdAt: -1 });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user: user });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error while getting the profile" });
  }
};

// /profile/:userId/set-privacy
const userPrivacy = async (req, res) => {
  // const { userId } = req.params;
  const { isPrivate, userId } = req.body;

  if (!userId || typeof isPrivate !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "Invalid input. 'userId' and 'isPrivate' are required.",
    });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.isPrivate = isPrivate;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Account privacy updated.",
    });
  } catch (error) {
    console.error("Error updating account privacy:", error);
    res.status(500).json({
      success: false,
      message: "Error updating account privacy.",
    });
  }
};

module.exports = {
  follow,
  unfollow,
  approveFollowRequest,
  denyFollowRequest,
  userProfile,
  userPrivacy,
};
