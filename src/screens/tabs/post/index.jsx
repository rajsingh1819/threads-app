import {
    Image,
    View,
    Text,
    Pressable,
    KeyboardAvoidingView,
    TextInput,
  } from "react-native";
  import {
    Images,
    Camera,
    ImagePlay,
    Frame,
    Mic,
    MapPin,
    Hash
  } from "lucide-react-native";
  import { router } from "expo-router";
  import { SafeAreaView } from "react-native-safe-area-context";
  import imagePath from "../../../constant/imagePath";
  import ButtonComp from "../../../constant/ButtonComp";
  import { useEffect, useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { checkAuth } from "../../../provider/auth";
  import { createPostApi } from "../../../provider/userAllApi";
  import { showToast } from "../../../constant/showToast";
  
  const post = () => {
    const [content, setContent] = useState("");
    const dispatch = useDispatch();
    const {  isAuthenticated, user } = useSelector((state) => state.auth);
    console.log("isAuthenticated post",isAuthenticated);

  
    const handleMediaUpload = (type) => {
      console.log(`Upload ${type}`);
    };
  
    const createPost = async () => {
      if (!content.trim()) {
        showToast("error", "Content is required");
        return;
      }
  
      const result = await createPostApi({ content, userId: user._id });
      if (result.success) {
        showToast("success", "Post created successfully 🎉");
  
        setContent("");
        router.push("/(tabs)")
      } else {
        showToast("error", result.message);
      }
    };
  
   useEffect(() => {
       const checkAuthentication = async () => {
         const token = await AsyncStorage.getItem("authToken");
         if (token) {
           dispatch(checkAuth()); // Only dispatch if token is found
         }
       };
   
       if (isAuthenticated === null) {
         checkAuthentication(); // Only call when the state is not set
       }
     }, [dispatch, isAuthenticated]); // Trigger once when the state is not determined yet
   
     
  
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <KeyboardAvoidingView
          behavior="padding"
          className="flex-1 p-2 justify-between"
        >
          {/* User Info and Input */}
          <View className="bg-white shadow-md rounded-lg p-4">
            <View className="flex-row mb-4 ">
              {/* User Avatar */}
              <Image
                source={{ uri: imagePath?.user }}
                className="h-10 w-10 rounded-full"
                resizeMode="contain"
              />
              {/* Username */}
              <View className="flex-1 gap-3 justify-center ">
                <Text className="ml-3 text-lg font-semibold text-gray-800">
                  {user?.username || "Unknown"}
                </Text>
                {/* Text Input */}
                <TextInput
                  placeholder="What's on your mind?"
                  value={content}
                  className="w-full border border-gray-300 rounded-lg p-4 text-base text-gray-800"
                  onChangeText={(text) => setContent(text)}
                  multiline
                  textAlignVertical="top"
                  numberOfLines={5}
                />
  
                {/* Media Upload Icons */}
                <View className="flex-row justify-between mt-4">
                  {[
                    { Icon: Images, label: "Image" },
                    { Icon: Camera, label: "Camera" },
                    { Icon: ImagePlay, label: "GIF" },
                    { Icon: Mic, label: "Audio" },
                    { Icon:  Hash, label: " Hash" },
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
          <View className="w-full">
            <ButtonComp title="Post" onPress={createPost} />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };
  
  export default post;
  