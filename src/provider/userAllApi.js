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
  const api = `${url}/api/posts/${postId}/get/singlePost`;


  try {
    const response = await fetch(api, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Post creation error:", errorData);
      return {
        success: false,
        message: errorData.message || "Failed to featch the post",
      };
    }

    const data = await response.json();
    console.log("Post data:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error featching posts:", error);
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
    console.log("Post data:", data);
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
      body: JSON.stringify({ isPrivate,userId }),
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

