import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  KeyboardAvoidingView,
  TextInput,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { getSinglePost, createNewComment } from "../../provider/userAllApi";
import { showToast } from "../../constant/showToast";

import { SafeAreaView } from "react-native-safe-area-context";

import ButtonComp from "../../constant/ButtonComp";
import { useDispatch, useSelector } from "react-redux";
import Comment from "../../components/postScreen/comment";
import { checkAuth } from "../../provider/auth";
import PostList from "../../components/postList";

const UserPost = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { id } = useLocalSearchParams();

  const [showMore, setShowMore] = useState(false);

  const [userItem, setUserItem] = useState({});
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    dispatch(checkAuth());
  }, [id]);

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
    // console.log(comment)
    setContent(`@${comment?.user?.username} `);
  };

  if (!userItem._id || !user?._id) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size={30} />
      </View>
    );
  }

  const handleMediaUpload = (type, item) => {
    switch (type) {
      case "message":
        showToast("success", "message");
        break;
      case "heart":
        showToast("success", "Liked!");
        break;
      case "repeat":
        showToast("success", "Post shared!");
        break;
      case "send":
        showToast("success", "Post sent!");
        break;
      default:
        showToast("error", "Something went wrong!");
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="p-1 mb-3 mt-3 flex-1 ">
        <PostList item={userItem} handleMediaUpload={handleMediaUpload} />
        <View className=" pt-3 pb-3 border-b-2 border-slate-400">
          <Text className="font-bold text-xl">Replies</Text>
        </View>

        {/* Comments Section */}
        <FlatList
          data={userItem?.comments}
          keyExtractor={(comment) => comment.id || comment._id}
          renderItem={({ item: comment }) => (
            <Comment
              comment={comment}
              handleReply={handleReply}
              handleMediaUpload={handleMediaUpload}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 10 }}
        />

        {/* Comment Input Section */}

        <KeyboardAvoidingView>
          {replyTo && (
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-700">
                Replying to {replyTo?.user?.username}
              </Text>
              <Pressable
                onPress={() => {
                  setReplyTo(null), setContent("");
                }}
              >
                <Text className="text-red-500 text-lg mr-10">x</Text>
              </Pressable>
            </View>
          )}
          <View className="flex-row gap-1">
            <TextInput
              value={content}
              onChangeText={(text) => setContent(text)}
              placeholder="Enter your comment here.."
              className="p-3 border w-full text-base font-semibold border-black rounded-xl bg-amber-200 "
            />
            <ButtonComp
              title="Post"
              onPress={postComment}
              style={{
                width: 50,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 50,
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default UserPost;
