import { showToast } from "../constant/showToast";
import { unlikeEntity, likeEntity } from "../provider/userAllApi";

export const handleLikeToggle = async (userItem, action, user, setUserItem) => {
  // Ensure likes is initialized as an array if not defined
  const currentLikes = Array.isArray(userItem.likes) ? userItem.likes : [];

  const userHasLiked = currentLikes.includes(user?._id);

  let result;
  if (userHasLiked) {
    // Unlike the post
    result = await unlikeEntity(action, userItem._id, user?._id);
    if (result.success) {
      showToast("success", "Unliked!");
      setUserItem((prev) => ({
        ...prev,
        likes: prev.likes.filter(
          (like) => like?.toString() !== user?._id?.toString()
        ), // Safely check if like and user._id are defined
      }));
    } else {
      showToast("error", result.message);
    }
  } else {
    // Like the post
    result = await likeEntity(action, userItem._id, user?._id);
    if (result.success) {
      showToast("success", "Liked!");
      setUserItem((prev) => ({
        ...prev,
        likes: [...prev.likes, user?._id], // Add user's ID to likes array
      }));
    } else {
      showToast("error", result.message);
    }
  }
};
