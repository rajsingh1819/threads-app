import { useEffect, useState } from "react";
import {
  Image,
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  Images,
  Camera,
  ImagePlay,
  Mic,
  MapPin,
  Hash,
  BadgeX,
} from "lucide-react-native";
import { useLocalSearchParams, router, Link } from "expo-router";
import PostSingleList from "../../../components/postSingleScreen/SingleList";
import { showToast } from "../../../constant/showToast";
import { createNewComment } from "../../../provider/userAllApi";
import imagePath from "../../../constant/imagePath";
import ButtonComp from "../../../constant/ButtonComp";
import HeaderBack from "../../../constant/HeaderBack";

const Reply = () => {
  const { postId, user, item, action, replyTo } = useLocalSearchParams();


  const parsedUser = user ? JSON.parse(user) : null;
  const parsedItem = item ? JSON.parse(item) : null;
  const parsedReplyTo = replyTo ? JSON.parse(replyTo) : null;

  const [content, setContent] = useState("");
  const [replyToState, setReplyToState] = useState(parsedReplyTo || null);

  const handleMediaUpload = (type) => {
    console.log(`Upload ${type}`);
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/home")
    }
  };

  const postComment = async () => {
    if (!content.trim()) {
      showToast("info", "Comment is required");
      return;
    }

    const commentData = {
      postId,
      userId: parsedUser?._id,
      content,
      commentId: replyToState ? replyToState._id : null,
    };

    const result = await createNewComment(commentData);

    if (result.success) {
      showToast("success", result.message || "Comment posted successfully!");
      setContent("");
      setReplyToState(null);
      handleBackPress();
    } else {
      showToast("error", result.message || "Failed to post comment");
    }
  };

  return (
    <View className="flex-1">
      <HeaderBack title="Reply" cancel="Cancel" onPress={handleBackPress} />

      <View className="p-1 flex-1">
        <PostSingleList item={parsedItem} action={action} />
        <KeyboardAvoidingView
          behavior="padding"
          className="flex-1 justify-between"
        >
          <View className="p-3">
            <View className="flex-row mb-4">
              {/* User Avatar */}
              <Image
                source={{ uri: parsedUser?.avatar?.cloudinary  || imagePath?.user }}
                className="h-10 w-10 rounded-full"
                resizeMode="contain"
              />
              {/* Username and Input Section */}
              <View className="flex-1 gap-3 justify-center">
                <View className="flex-row justify-between">
                  <Link href="/profile"  className="ml-3 text-lg font-semibold text-gray-800">
                    {parsedUser?.username || "Unknown"}
                  </Link>
                  <TouchableOpacity onPress={handleBackPress}>
                    <BadgeX size={28} />
                  </TouchableOpacity>
                </View>

                {/* Text Input */}
                <TextInput
                  placeholder="Reply to thread"
                  value={content}
                  className="w-full border border-gray-300 rounded-lg p-3 text-base text-gray-700"
                  onChangeText={setContent}
                  textAlignVertical="top"
                />

                {/* Media Upload Icons */}
                <View className="flex-row justify-between mt-4">
                  {[
                    { Icon: Images, label: "Image" },
                    { Icon: Camera, label: "Camera" },
                    { Icon: ImagePlay, label: "GIF" },
                    { Icon: Mic, label: "Audio" },
                    { Icon: Hash, label: "Hash" },
                    { Icon: MapPin, label: "Location" },
                  ].map(({ Icon, label }, index) => (
                    <Pressable
                      key={index}
                      onPress={() => handleMediaUpload(label)}
                    >
                      <Icon size={28} color="#6b7280" />
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* Post Button */}
          <View className="flex-row items-center justify-between bg-slate-200 rounded-xl p-1">
            <Text className="text-center flex-1 text-gray-700">
              Everyone can reply and quote
            </Text>
            <ButtonComp
              title="Post"
              onPress={postComment}
              style={{ width: 80, height: 40, borderRadius: 20 }}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default Reply;
