import { url } from "./url";
import { showToast } from "../constant/showToast";

export const createPostApi = async ({ content, userId, image }) => {
  const api = `${url}/api/posts/create`;

  try {
    const response = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content, userId, image }), // Include image in request
    });

    if (!response.ok) {
      const errorData = await response.json();
      // console.error("Post creation error:", errorData);
      return {
        success: false,
        message: errorData.message || "Failed to create post",
      };
    }

    const data = await response.json();
    // console.log("Post created successfully:", data);
    return { success: true, data };
  } catch (error) {
    // console.error("Unexpected error creating post:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
};

export const getSinglePost = async (postId) => {
  // Correct API endpoint
  const api = `${url}/api/posts/${postId}/get/singlePost`;

  try {
    const response = await fetch(api, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();
      // console.error("Post fetch error:", errorData);
      return {
        success: false,
        message: errorData.message || "Failed to fetch the post",
      };
    }

    const data = await response.json();
    // console.log("Post data:", data);
    return { success: true, data };
  } catch (error) {
    // console.error("Unexpected error fetching post:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
};

export const getAllPost = async () => {
  const api = `${url}/api/posts/gets`;

  try {
    const response = await fetch(api, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();
      // console.error("Post creation error:", errorData);
      return {
        success: false,
        message: errorData.message || "Failed to featch the posts",
      };
    }

    const data = await response.json();
    // console.log("Post data:", data);
    return { success: true, data };
  } catch (error) {
    // console.error("Unexpected error featching posts:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
};

export const checkPrivate = async ({ userId, isPrivate }) => {
  const api = `${url}/api/auth/profile/set-privacy`;

  try {
    const response = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isPrivate, userId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      // console.error("Error updating account privacy", errorData);
      return {
        success: false,
        message: errorData.message || "Failed to change the privacy",
      };
    }

    const data = await response.json();
    // console.log("Privacy updated:", data);
    return { success: true, data };
  } catch (error) {
    // console.error("Error updating account privacy:", error);
    return { success: false, message: "Error updating account privacy" };
  }
};

export const createNewComment = async ({
  postId,
  userId,
  content,
  commentId,
}) => {
  // Updated API endpoint to include postId
  const api = `${url}/api/posts/user/${postId}/comment`; // Single endpoint

  try {
    const response = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, content, commentId }), // Include commentId is optional comment
    });

    if (!response.ok) {
      const errorData = await response.json();
      // console.error("Comment creation error:", errorData);
      return {
        success: false,
        message: errorData.message || "Failed to create comment",
      };
    }

    // Handle success response
    const data = await response.json();
    // console.log("Comment created successfully:", data);
    return { success: true, data };
  } catch (error) {
    // console.error("Unexpected error creating comment:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
};

export const likeEntity = async (type, entityId, userId) => {
  const api = `${url}/api/posts/${type}/${entityId}/like`; // Fixed the incorrect ':' in the URL

  try {
    const response = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }), // Removed unnecessary `content` in the body
    });

    if (!response.ok) {
      const errorData = await response.json();
      // console.error("Like entity error:", errorData);
      return {
        success: false,
        message: errorData.message || "Failed to like entity",
      };
    }

    const data = await response.json();
    // console.log("Entity liked successfully:", data);
    return { success: true, data };
  } catch (error) {
    // console.error("Unexpected error liking entity:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
};

export const unlikeEntity = async (type, entityId, userId) => {
  const api = `${url}/api/posts/${type}/${entityId}/unlike`;

  try {
    const response = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      // console.error("Unlike entity error:", errorData);
      return {
        success: false,
        message: errorData.message || "Failed to unlike entity",
      };
    }

    const data = await response.json();
    // console.log("Entity unliked successfully:", data);
    return { success: true, data };
  } catch (error) {
    // console.error("Unexpected error unliking entity:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
};

export const singleUser = async (userId) => {
  const api = `${url}/api/auth/profile/${userId}`;

  try {
    const response = await fetch(api, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();

      return {
        success: false,
        message: errorData.message || "Failed to fetch user",
      };
    }

    const data = await response.json();
    // console.log(" user comming successfully:", data);
    return data;
  } catch (error) {
    // console.error("Unexpected error unliking entity:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
};

export const deleteUserPost = async (postId) => {
  const api = `${url}/api/posts/delete/${postId}`;

  try {
    const response = await fetch(api, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      // console.error("Deletation error:", errorData);
      return {
        success: false,
        message: errorData.message || "Failed to delete",
      };
    }

    // Handle success response
    const data = await response.json();
    // console.log("delete successfully:", data);
    return data;
  } catch (error) {
    // console.error("Unexpected error:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
};

export const getAllUsers = async (userId) => {
  const api = `${url}/api/auth/users/${userId}`;
  try {
    const response = await fetch(api, { method: "GET" });
    if (!response.ok) {
      const errorData = await response.json();

      return {
        success: false,
        message: errorData.message || "Failed to fetch users",
      };
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    // console.error("Unexpected error:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
};

export const FollowUser = async (currentUserId, selectedUserId) => {
  const api = `${url}/api/auth/user/follow`;

  try {
    const response = await fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentUserId, selectedUserId }),
    });

    const data = await response.json(); // Parse response

    if (!response.ok) {
      throw new Error(data.message || "Follow request failed");
    }

    return data; // Return API response
  } catch (error) {
    // console.error("Error sending follow request:", error.message);
    return null;
  }
};

export const UnfollowUser = async (currentUserId, targetUserId) => {
  const api = `${url}/api/auth/user/unfollow`;

  try {
    const response = await fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentUserId, targetUserId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unfollow request failed");
    }

    return data;
  } catch (error) {
    // console.error("Error unfollowing user:", error.message);
    return null;
  }
};

// Handle user request to approve or reject follow request

export const handleAccept = async (currentUserId, senderUserId) => {
  const api = `${url}/api/auth/user/approveFollowRequest`;
  try {
    const response = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentUserId,
        senderUserId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error approving follow request");
    }

    return data;
  } catch (error) {
    // console.error("Error accepting request:", error);
    showToast("error", "Failed to approve request");
  }
};

export const handleReject = async (currentUserId, senderUserId) => {
  const api = `${url}/api/auth/user/denyFollowRequest`;
  try {
    const response = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentUserId,
        senderUserId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error rejecting follow request");
    }

    return data;
  } catch (error) {
    // console.error("Error rejecting request:", error);
    showToast("error", "Failed to deny request");
  }
};

// In your handleAvatar function
export const handleAvatar = async ({ userId, image }) => {
  const api = `${url}/api/auth/avatar/update`;

  try {
    const response = await fetch(api, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, image }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error updating avatar request");
    }

    showToast("success", "Avatar updated successfully!");
    return data;
  } catch (error) {
    // console.error("Error updating avatar:", error);
    showToast("error", error.message || "Failed to update avatar");
  }
};







// Forgot Password
const BASE_URL = `${url}/api/forgot`;

export const sendOTP = async (emailOrPhone) => {
  const response = await fetch(`${BASE_URL}/request-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emailOrPhone }),
  });
  return response.json();
};

export const verifyUserOtp = async (emailOrPhone, otp) => {
  const response = await fetch(`${BASE_URL}/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emailOrPhone, otp }),
  });
  return response.json();
};

export const resetUserPassword = async (emailOrPhone, otp, newPassword) => {
  const response = await fetch(`${BASE_URL}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emailOrPhone, otp, newPassword }),
  });
  return response.json();
};
