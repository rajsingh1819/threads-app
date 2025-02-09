import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { getSinglePost } from "../../../../provider/userAllApi";
import { showToast } from "../../../../constant/showToast";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../../../../provider/auth";
import Comment from "../../../../components/postSingleScreen/Comment";
import PostSingleList from "../../../../components/postSingleScreen/SingleList";
import HeaderBack from "../../../../constant/HeaderBack";
import imagePath from "../../../../constant/imagePath";

const UserComments = () => {
  const { postId } = useLocalSearchParams();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const action = "post";

  const [userItem, setUserItem] = useState(null);
  const [replyTo, setReplyTo] = useState(null);

  // Handle authentication check on mount
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Fetch the post when the postId changes
  useEffect(() => {
    const fetchPost = async () => {
      if (postId) {
        const result = await getSinglePost(postId);

        if (result.success) {
          setUserItem(result.data.post || {});
        } else {
          showToast("error", result.message || "Something went wrong");
          console.error(result.message);
        }
      }
    };
    fetchPost();
  }, [postId]);

  // Handle early return if user or post is missing
  if (!user?._id || !postId || !userItem) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size={30} />
      </View>
    );
  }

  // Handle the back button press
  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/home");
    }
  };

  // Handle the comment reply
  const handleComment = () => {
    router.push({
      pathname: "/reply",
      params: {
        postId,
        user: JSON.stringify(user), // Stringify the user object
        action: action,
        item: JSON.stringify(userItem), // Stringify the userItem object
        replyTo: replyTo ? JSON.stringify(replyTo) : null, // Conditionally include replyTo
      },
    });
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 items-center">
        <View className="w-full sm:w-1/2 flex-1">
          <HeaderBack title="Threads" onPress={handleBackPress} />

          <View className="flex-1">
            <View className="p-1 mb-3 mt-3 flex-1">
              <PostSingleList item={userItem} action={"post"} />

              <View className="border-t-2 border-b-2 p-2 border-stone-400">
                <Text className="text-base font-semibold">Replies</Text>
              </View>

              <FlatList
                data={userItem?.comments || []}
                keyExtractor={(comment) => comment._id}
                renderItem={({ item }) => (
                  <Comment comment={item} postId={postId} user={user} />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 10 }}
              />

              <View className="flex-row gap-1 border border-slate-400 rounded-full p-2">
                <Image
                  source={{ uri: imagePath?.user }}
                  className="h-8 w-8 rounded-full"
                  resizeMode="contain"
                />
                <TouchableOpacity
                  className="flex-1 justify-center bg-slate-200"
                  onPress={handleComment}
                >
                  <Text className="ml-2">
                    Reply To {userItem?.user?.username}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UserComments;
