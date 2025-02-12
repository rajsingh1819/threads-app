import { useEffect, useState } from "react";
import {
  Image,
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  Images,
  Camera,
  ImagePlay,
  Mic,
  MapPin,
  Hash,
} from "lucide-react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import imagePath from "../../constant/imagePath";
import ButtonComp from "../../constant/ButtonComp";
import HeaderBack from "../../constant/HeaderBack";
import { checkAuth } from "../../provider/auth";
import { createPostApi } from "../../provider/userAllApi";
import { showToast } from "../../constant/showToast";
import { pickImage } from "../../util/mediaPicker";
import ImageView from "../../util/ImageView";
import AvatarView from "../../util/AvatarView";

const Post = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [postData, setPostData] = useState({ content: "", imageUri: "" });

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const handleMediaUpload = (type) => {
    switch (type) {
      case "Image":
        pickImage((uri) => setPostData((prev) => ({ ...prev, imageUri: uri })));
        break;
      default:
        console.log("Invalid upload type");
    }
  };

  const createPost = async () => {
    if (!postData.content && !postData.imageUri) {
      showToast("error", "Content or image is required");
      return;
    }

    setIsLoading(true);

    try {
      const imageToSend = postData.imageUri?.startsWith("data:image")
        ? postData.imageUri
        : null;

      const result = await createPostApi({
        content: postData.content,
        userId: user._id,
        image: imageToSend,
      });

      if (result.success) {
        setPostData({ content: "", imageUri: "" });
        router.push("/home");
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackPress = () => {
    router.canGoBack() ? router.back() : router.push("/home");
  };

  return (
    <SafeAreaView className="flex-1 items-center">
      <View className="flex-1 w-full sm:w-1/2 p-1">
        <HeaderBack title="Threads" onPress={handleBackPress} />

        {isLoading && (
          <View className="absolute inset-0 flex items-center justify-center bg-white/75 z-50">
            <ActivityIndicator size={30} color="blue" />
            <Text className="mt-2 text-lg font-bold">Posting...</Text>
          </View>
        )}

        <KeyboardAvoidingView
          behavior="padding"
          className="flex-1 p-1 justify-between"
        >
          <View className="rounded-lg p-2">
            <View className="flex-row mb-4">
              <AvatarView
                avatarUri={user?.avatar?.cloudinary || imagePath?.user}
                size="md"
              />

              <View className="flex-1 gap-3 justify-center">
                <Text className="ml-3 text-lg font-semibold text-gray-800">
                  {user?.username || "Unknown"}
                </Text>

                {postData.imageUri !== "" && (
                  <View className="relative">
                    <ImageView imageUri={postData?.imageUri} />
                    <TouchableOpacity
                      className="absolute -top-5 right-5 bg-gray-500 h-8 w-8 rounded-full items-center justify-center shadow-md"
                      onPress={() =>
                        setPostData((prev) => ({ ...prev, imageUri: "" }))
                      }
                    >
                      <Text className="text-lg font-bold">X</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <TextInput
                  placeholder="What's on your mind?"
                  value={postData.content}
                  className="w-full border border-gray-300 rounded-lg p-4 text-base text-gray-800"
                  onChangeText={(content) =>
                    setPostData((prev) => ({ ...prev, content }))
                  }
                  textAlignVertical="top"
                />

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

          <View className="w-full">
            <ButtonComp title="Post" onPress={createPost} />
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default Post;
