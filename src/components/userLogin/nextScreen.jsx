import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import { ChevronLeft, AtSign } from "lucide-react-native";
import ButtonComp from "../../constant/ButtonComp";
import { showToast } from "../../constant/showToast";
import { useDispatch } from "react-redux";
import { registerUser } from "../../provider/auth";
import { router } from "expo-router";
import { pickImage } from "../../util/mediaPicker";
import HeaderBack from "../../constant/HeaderBack";
// import * as ImagePicker from "expo-image-picker";

const NextScreen = ({ userData, setUserData, setShowNextPage }) => {
  const dispatch = useDispatch();
  const [avatarUri, setAvatarUri] = useState(userData.avatar || "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const goBack = () => {
    setShowNextPage(false);
    setUserData({ ...userData, username: "", password: "" });
  };

  const pickAvatarImage = () => {
    pickImage(setAvatarUri);
  };

  const handleSaveUsername = async () => {
    if (!userData.username || !userData.emailorphone || !userData.password) {
      showToast("error", "Please fill all fields!");
      return;
    }
    setIsLoading(true);

    try {
      let formData = { ...userData };

      // Process the avatar only if the avatar URI is available
      if (avatarUri) {
        try {
          const imageResponse = await fetch(avatarUri);
          const imageBlob = await imageResponse.blob();
          const reader = new FileReader();

          // Convert the image to base64
          const avatarBase64 = await new Promise((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(imageBlob);
          });

          formData.avatar = avatarBase64; // Add the avatar to formData
        } catch (err) {
          setError("Error processing avatar: " + err.message);
          setIsLoading(false);
          return;
        }
      }

      // Dispatch the registration action
      const result = await dispatch(registerUser(formData));
      if (result?.payload?.success) {
        showToast("success", "User registered successfully!");
        setUserData({
          username: "",
          emailorphone: "",
          password: "",
          avatar: "",
        });
        setAvatarUri("");
        router.replace("/");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Error during registration: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1">
      {isLoading && (
        <View className="absolute inset-0 flex items-center justify-center bg-white/10 z-50">
          <ActivityIndicator size={30} color="blue" />
          <Text className="mt-2 text-lg font-bold"> Registering user...</Text>
        </View>
      )}

      <HeaderBack onPress={goBack} />

      <View className="flex-1 p-2">
        <View className="flex-1 gap-10 ">
          <View className="items-center gap-1">
            <TouchableOpacity onPress={pickAvatarImage}>
              {avatarUri ? (
                <Image
                  source={{ uri: avatarUri }}
                  className="w-32 h-32 rounded-full"
                />
              ) : (
                <View className="w-32 h-32 rounded-full bg-slate-500 border flex items-center justify-center">
                  <Text className="text-white">No Avatar Selected</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View className="border p-2 w-full rounded-lg bg-white">
            <View className="flex-row items-center gap-3">
              <AtSign size={30} />
              <TextInput
                placeholder="Enter your username here..."
                className="flex-1 p-2 rounded-lg text-base font-semibold"
                placeholderTextColor="gray"
                value={userData.username}
                onChangeText={(username) =>
                  setUserData((prevState) => ({ ...prevState, username }))
                }
              />
            </View>
          </View>
          {error ? (
            <Text className="text-red-500 mt-2">Info : {error} </Text>
          ) : null}
        </View>

        <ButtonComp title="Save & Print" onPress={handleSaveUsername} />
      </View>
    </View>
  );
};

export default NextScreen;
