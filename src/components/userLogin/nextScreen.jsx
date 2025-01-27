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
import * as ImagePicker from "expo-image-picker";

const NextScreen = ({ userData, setUserData, setShowNextPage }) => {
  const dispatch = useDispatch();
  const [avatarUri, setAvatarUri] = useState(userData.avatar || "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const goBack = () => {
    setShowNextPage(false);
    setUserData({ ...userData, username: "", password: "" });
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 0.5,
      });
      if (!result.canceled && result.assets?.length) {
        setAvatarUri(result.assets[0].uri);
        setError(""); // Clear any previous error
      } else {
        setError("Image selection canceled or failed.");
      }
    } catch (err) {
      setError("Error picking image: " + err.message);
    }
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
    <View className="flex-1 p-2">
      {isLoading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.75)",
            zIndex: 50,
          }}
        >
          <ActivityIndicator size={30} color="blue" />
          <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "bold" }}>
            Registering user...
          </Text>
        </View>
      )}

      <TouchableOpacity
        activeOpacity={0.8}
        className="flex-row items-center"
        onPress={goBack}
      >
        <ChevronLeft size={30} />
        <Text className="ml-2 text-xl">Back</Text>
      </TouchableOpacity>

      <View className="flex-1 gap-10">
        <View className="items-center gap-1">
          <TouchableOpacity onPress={pickImage}>
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
  );
};

export default NextScreen;
