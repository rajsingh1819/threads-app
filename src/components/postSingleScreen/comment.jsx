import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import UserReply from "./UserReply";
import PostSingleList from "./SingleList";
import { router } from "expo-router";

const Comment = ({ comment, postId, user }) => {
  // console.log(" comment, postId", comment, postId)
  const [showReplies, setShowReplies] = useState(false); 
  const action = "comment";
  const [replyTo, setReplyTo] = useState(null);

  const handleReply = () => {
    setReplyTo(comment);
    user  &&  router.push({
      pathname: "/reply",
      params: {
        postId,
        user: JSON.stringify(user), // Pass the user object
        action: action,
        item: JSON.stringify(comment), // Pass the comment object
        replyTo: JSON.stringify(comment), // Pass the replyTo comment object
      },
    });
  };
  

  return (
    <View key={comment._id} className="mb-3">
      <PostSingleList
        item={comment}
        action="comment"
        onMessageIconPress={handleReply}
      />

      {/* Show/Hide Reply Buttons if there are replies */}
      {comment?.replies?.length > 0 && !showReplies && (
        <TouchableOpacity onPress={() => setShowReplies(!showReplies)}>
          <Text className="text-blue-500">
            Show Reply ({comment.replies.length})
          </Text>
        </TouchableOpacity>
      )}

      {/* Display Replies */}
      {showReplies && (
        <View>
          {comment?.replies?.map((reply) => (
            <UserReply key={reply._id} reply={reply} />
          ))}
          <TouchableOpacity onPress={() => setShowReplies(!showReplies)}>
            <Text className="text-blue-500 mt-2">Hide Reply</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Comment;


