import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Reply from "./reply";
import PostSingleList from "./singleList";

const Comment = ({ comment, handleReply }) => {
  const [showReplies, setShowReplies] = useState(false); // Track if replies are shown

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  return (
    <View key={comment._id} className="mb-3">
      {/* Pass toggleReplies to PostSingleList */}
      <PostSingleList
        item={comment}
        action="comment"
        onMessageIconPress={toggleReplies} // Handle MessageCircle icon click
      />
      <TouchableOpacity onPress={() => handleReply(comment)}>
        <Text className="text-blue-500">
          Reply
          {comment?.replies?.length > 0 && ` (${comment.replies.length})`}
        </Text>
      </TouchableOpacity>

      {/* Display Replies */}
      {showReplies &&
        comment?.replies?.map((reply) => (
          <Reply key={reply._id} reply={reply} handleReply={handleReply} />
        ))}
    </View>
  );
};

export default Comment;
