import {
  View,
  Text,
  ActivityIndicator,
  Image,
  Pressable,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  FlatList,

} from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { getSinglePost, createNewComment } from "../../provider/userAllApi";
import { showToast } from "../../constant/showToast";
import { Heart, MessageCircle, Repeat, Send } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import imagePath from "../../constant/imagePath";
import ButtonComp from "../../constant/ButtonComp";
import { useSelector } from "react-redux";
import Comment from "../../components/postScreen/comment"; // Import the Comment component

const IconButton = ({ onPress, Icon, label }) => (
  <Pressable onPress={onPress} accessibilityLabel={label}>
    <Icon size={25} color="#6b7280" />
  </Pressable>
);

const UserPost = () => {
  const { user } = useSelector((state) => state.auth);

  const { id } = useLocalSearchParams();
  const [showMore, setShowMore] = useState(false);
  const [userItem, setUserItem] = useState({});
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState(null); // Track if we're replying to a comment

  // console.log("Login user", user?._id);
  // console.log("singlePost=>", userItem);

  // Fetch posts from the backend
  const fetchPost = async () => {
    const result = await getSinglePost({ postId: id });
    if (result.success) {
      const fetchedPost = result.data.post || {};
      setUserItem(fetchedPost); // Update state with the fetched post
    } else {
      showToast("error", `${result.message}` || "Something went wrong");
      console.error(result.message);
    }
  };

  const postComment = async () => {
    if (!content.trim()) {
      showToast("info", "Comment is required");
      return;
    }

    const result = await createNewComment({
      postId: id,
      userId: user?._id,
      content,
      commentId: replyTo ? replyTo._id : null, // Send the commentId if it's a reply replyTo._id is the id of comment user not reply user
    });
    if (result.success) {
      showToast("success", result.message || "Comment posted successfully!");
      setContent(""); // Clear content if needed
      setReplyTo(null); // Clear reply state
    } else {
      showToast("error", result.message || "Failed to post comment");
    }
  };

  // Fetch posts on initial render
  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleReply = (comment) => {
    console.log("replyTo",comment)
    // Set reply state when clicking "Reply" on a comment
    setReplyTo(comment);
    console.log("replyTo",comment)
    // setContent(`@${comment.user.username} `); // Pre-fill the content with the username of the person being replied to
  };


  // Show loading spinner until post data or user data is available
  if (!userItem._id || !user?._id) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size={30} />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <View className="p-1 mb-3 flex-1">
        <View className="border-b p-1 border-slate-400 bg-green-400">
          {/* User Info */}
          <View className="flex-row pb-1 mb-2 gap-2">
            <Image
              source={{ uri: userItem?.avatar || imagePath?.user }}
              className="h-10 w-10 rounded-full"
              resizeMode="contain"
            />
            <View className="flex-1 justify-center gap-3">
              <Text className="text-lg font-bold text-gray-800">
                {userItem?.user?.username || "Unknown"}
              </Text>

              {/* Post Content */}
              <Text className="text-gray-800">
                {showMore
                  ? userItem?.content
                  : userItem?.content?.slice(0, 100)}
                {userItem?.content?.length > 100 && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setShowMore(!showMore)}
                  >
                    <Text className="text-blue-500 font-semibold">
                      {showMore ? " Show Less" : " Show More"}
                    </Text>
                  </TouchableOpacity>
                )}
              </Text>

              {/* Action Buttons */}
              <View className="flex-row gap-10">
                <IconButton
                  onPress={() => handleMediaUpload("heart")}
                  Icon={Heart}
                  label="Like"
                />
                <IconButton
                  onPress={() => handleMediaUpload("message")}
                  Icon={MessageCircle}
                  label="Comment"
                />
                <IconButton
                  onPress={() => handleMediaUpload("repeat")}
                  Icon={Repeat}
                  label="Share"
                />
                <IconButton
                  onPress={() => handleMediaUpload("send")}
                  Icon={Send}
                  label="Send"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Display Comments */}
        <FlatList
          data={userItem?.comments}
          keyExtractor={(comment) => comment.id || comment._id}
          renderItem={({ item: comment }) => (
            <Comment comment={comment} handleReply={handleReply} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 10 }}
        />

        {/* Comment Input Section */}
        <View className="bg-amber-200">
          <KeyboardAvoidingView>
            <View>
                {/* Display the username of the person being replied to */}
                {replyTo &&
                 <View className="flex-row justify-between">
           
                 <Text className="text-gray-700">
                   Replying to {replyTo.user.username}
                 </Text>
                 
             
               <Pressable onPress={()=>setReplyTo(null)} className="mr-16" >x</Pressable>
             </View>
                
                
                }
         
           
            <View className="flex-row gap-1">
            
            
              <TextInput
                value={content}
                onChangeText={(text) => setContent(text)}
                placeholder="Enter your comment here.."
                className="p-3 border w-full text-base font-semibold border-black rounded-xl"
              />
              <ButtonComp
                title="Post"
                onPress={postComment}
                style={{
                  width: 50,
                  alignItem: "center",
                  justifyItem: "center",
                  borderRadius: 50,
                }}
              />
            </View>

            </View>
           
          </KeyboardAvoidingView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UserPost;
