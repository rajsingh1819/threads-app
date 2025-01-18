import { url } from "./url";
import { showToast } from "../constant/showToast";

export const createPostApi = async ({ content, userId }) => {
  const api = `${url}/api/posts/create`;

  try {
    const response = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content, userId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Post creation error:", errorData);
      return {
        success: false,
        message: errorData.message || "Failed to create post",
      };
    }

    const data = await response.json();
    console.log("Post created successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error creating post:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
};

export const getSinglePost = async ({ postId }) => {
  // Correct API endpoint
  const api = `${url}/api/posts/${postId}/get/singlePost`;

  try {
    const response = await fetch(api, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Post fetch error:", errorData);
      return {
        success: false,
        message: errorData.message || "Failed to fetch the post",
      };
    }

    const data = await response.json();
    // console.log("Post data:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error fetching post:", error);
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
      console.error("Post creation error:", errorData);
      return {
        success: false,
        message: errorData.message || "Failed to featch the posts",
      };
    }

    const data = await response.json();
    // console.log("Post data:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error featching posts:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
};

export const checkPrivate = async ({ userId, isPrivate }) => {
  // const api = `${url}/api/auth/profile/${userId}/set-privacy`;
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
      console.error("Error updating account privacy", errorData);
      return {
        success: false,
        message: errorData.message || "Failed to change the privacy",
      };
    }

    const data = await response.json();
    // console.log("Privacy updated:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error updating account privacy:", error);
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
      console.error("Comment creation error:", errorData);
      return {
        success: false,
        message: errorData.message || "Failed to create comment",
      };
    }

    // Handle success response
    const data = await response.json();
    console.log("Comment created successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error creating comment:", error);
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
      console.error("Like entity error:", errorData);
      return {
        success: false,
        message: errorData.message || "Failed to like entity",
      };
    }

    const data = await response.json();
    console.log("Entity liked successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error liking entity:", error);
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
      console.error("Unlike entity error:", errorData);
      return {
        success: false,
        message: errorData.message || "Failed to unlike entity",
      };
    }

    const data = await response.json();
    console.log("Entity unliked successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error unliking entity:", error);
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
    console.error("Unexpected error unliking entity:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
};

export const getUsersPosts = async (userId) => {
  const api = `${url}/api/posts/all/user/${userId}`;

  try {
    const response = await fetch(api, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Failed to fetch posts",
      };
    }

    const data = await response.json(); 
    // console.log("Fetched posts successfully!:", data);
    return data; // Return the entire response object
  } catch (error) {
    console.error("Unexpected error fetching posts:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
};
