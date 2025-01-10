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
      // Send follow request
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
      // Direct follow
      await User.findByIdAndUpdate(currentUserId, {
        $addToSet: { following: selectedUserId },
      });
      await User.findByIdAndUpdate(selectedUserId, {
        $addToSet: { followers: currentUserId },
      });
      return res
        .status(200)
        .json({ message: "You are now following the user." });
    }
  } catch (error) {
    console.error("Error in follow operation:", error);
    return res.status(500).json({ message: "Error in following the user." });
  }
};

const unfollow = async (req, res) => {
  const { loggedInUserId, targetUserId } = req.body;

  if (!loggedInUserId || !targetUserId) {
    return res.status(400).json({ message: "User IDs are required" });
  }

  try {
    // Remove loggedInUserId from targetUserId's followers
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: loggedInUserId },
    });

    // Remove targetUserId from loggedInUserId's following
    await User.findByIdAndUpdate(loggedInUserId, {
      $pull: { following: targetUserId },
    });

    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in unfollowing user" });
  }
};

const approveFollowRequest = async (req, res) => {
  const { currentUserId, senderUserId } = req.body;

  try {
    // Remove from receivedFollowRequests
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { receivedFollowRequests: senderUserId },
    });

    // Remove from sentFollowRequests
    await User.findByIdAndUpdate(senderUserId, {
      $pull: { sentFollowRequests: currentUserId },
    });

    // Add to followers and following
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { followers: senderUserId },
    });

    await User.findByIdAndUpdate(senderUserId, {
      $addToSet: { following: currentUserId },
    });

    res.status(200).json({ message: "Follow request approved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in approving follow request" });
  }
};

const denyFollowRequest = async (req, res) => {
  const { currentUserId, senderUserId } = req.body;

  try {
    // Remove from receivedFollowRequests
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { receivedFollowRequests: senderUserId },
    });

    // Remove from sentFollowRequests
    await User.findByIdAndUpdate(senderUserId, {
      $pull: { sentFollowRequests: currentUserId },
    });

    res.status(200).json({ message: "Follow request denied" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in denying follow request" });
  }
};

// /profile/:userId
const userProfile =  async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({  success: false ,message: "User not found" });
    }

    return res.status(200).json({success: true , user:user });
  } catch (error) {
    res.status(500).json({ success: false , message: "Error while getting the profile" });
  }
};


// /profile/:userId/set-privacy
const userPrivacy = async (req, res) => {
  // const { userId } = req.params;
  const { isPrivate,userId  } = req.body;

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






module.exports = { follow, unfollow, approveFollowRequest, denyFollowRequest,userProfile  ,userPrivacy};
