import React, { useState, useEffect } from "react";
import { View, FlatList, ActivityIndicator, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { createNewComment, getSinglePost } from "../../provider/userAllApi";
import { showToast } from "../../constant/showToast";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../../provider/auth";

import Comment from "../../components/postSingleScreen/comment";
import InputSection from "../../components/postSingleScreen/inputSection";
import PostSingleList from "../../components/postSingleScreen/singleList";

const UserPost = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { id } = useLocalSearchParams();
  const [userItem, setUserItem] = useState(null); // Initial state is null
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    const fetchPost = async () => {
      const result = await getSinglePost({ postId: id });

      if (result.success) {
        setUserItem(result.data.post || {});
      } else {
        showToast("error", result.message || "Something went wrong");
        console.error(result.message);
      }
    };
    fetchPost();
  }, [id]);

  const postComment = async () => {
    if (!content.trim()) {
      showToast("info", "Comment is required");
      return;
    }

    const result = await createNewComment({
      postId: id,
      userId: user?._id,
      content,
      commentId: replyTo ? replyTo._id : null,
    });

    if (result.success) {
      showToast("success", result.message || "Comment posted successfully!");
      setContent("");
      setReplyTo(null);
    } else {
      showToast("error", result.message || "Failed to post comment");
    }
  };

  const handleReply = (comment) => {
    setReplyTo(comment);
    setContent(`@${comment?.user?.username} `);
  };

  if (!user?._id || !id || !userItem) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size={30} />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <View className="p-1 mb-3 mt-3 flex-1">
        <PostSingleList item={userItem} action={"post"} user={user} />
        <View className="pt-3 pb-3 border-b-2 border-slate-400">
          <Text className="font-bold text-xl">Replies</Text>
        </View>
        <FlatList
          data={userItem?.comments || []}
          keyExtractor={(comment) => comment._id}
          renderItem={({ item }) => (
            <Comment comment={item} handleReply={handleReply} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 10 }}
        />
        <InputSection
          content={content}
          setContent={setContent}
          replyTo={replyTo}
          postComment={postComment}
          setReplyTo={setReplyTo}
        />
      </View>
    </SafeAreaView>
  );
};

export default UserPost;
