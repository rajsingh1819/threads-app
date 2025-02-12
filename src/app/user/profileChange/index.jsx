import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import { updateUserProfile } from "../../../provider/userAllApi";
import { router, useLocalSearchParams } from "expo-router";
import HeaderBack from "../../../constant/HeaderBack";
import { showToast } from "../../../constant/showToast";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonComp from "../../../constant/ButtonComp";
import { useSelector, useDispatch } from "react-redux";
import { checkAuth } from "../../../provider/auth";

const EditProfileScreen = () => {
  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Initialize state with user data if available
  const [name, setName] = useState(user?.name || "");
  const [github, setGithub] = useState(user?.socialLinks?.github || "");
  const [linkedin, setLinkedin] = useState(user?.socialLinks?.linkedin || "");
  const [instagram, setInstagram] = useState(
    user?.socialLinks?.instagram || ""
  );
  const [twitter, setTwitter] = useState(user?.socialLinks?.twitter || "");

  const handleUpdateProfile = async () => {
    const updateData = {};

    if (name) {
      if (!/^[A-Za-z0-9 ]+$/.test(name)) {
        showToast(
          "error",
          "Invalid name! Only letters, numbers, and spaces are allowed."
        );
        return;
      }
      updateData.name = name;
    }

    const validateAndFormatURL = (url) => {
      if (!url) return "";
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        showToast("error", "Invalid URL! Only HTTP/HTTPS format is supported.");
        return null;
      }
      return url;
    };

    const socialLinks = {};
    if (github) {
      const formattedGithub = validateAndFormatURL(github);
      if (!formattedGithub) return;
      socialLinks.github = formattedGithub;
    }
    if (linkedin) {
      const formattedLinkedin = validateAndFormatURL(linkedin);
      if (!formattedLinkedin) return;
      socialLinks.linkedin = formattedLinkedin;
    }
    if (instagram) {
      const formattedInstagram = validateAndFormatURL(instagram);
      if (!formattedInstagram) return;
      socialLinks.instagram = formattedInstagram;
    }
    if (twitter) {
      const formattedTwitter = validateAndFormatURL(twitter);
      if (!formattedTwitter) return;
      socialLinks.twitter = formattedTwitter;
    }

    if (Object.keys(socialLinks).length > 0) {
      updateData.socialLinks = socialLinks;
    }

    try {
      const result = await updateUserProfile(user?._id, updateData);

      if (result?.success) {
        showToast("success", "Profile updated successfully");
        router.replace("/profile");
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      showToast("error", error.message || "Failed to update profile");
    }
  };

  if (!user || !user._id) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size={30} />
        <Text className="text-gray-600 mt-2">Loading user profile...</Text>
      </View>
    );
  }

  const handleBackPress = () => {
    router.canGoBack() ? router.back() : router.push("/profile");
  };

  const clearInput = (setter) => setter("");

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 items-center mt-2">
        <KeyboardAvoidingView className="w-full sm:w-1/2 flex-1">
          <HeaderBack onPress={handleBackPress} />
          <View className="p-5">
            <Text className="text-xl font-bold mb-4">Edit Profile</Text>

            {/* Name Input */}
            <View className="relative mb-3">
              <TextInput
                placeholder="Enter name"
                value={name}
                onChangeText={setName}
                className="border p-3 rounded-lg"
              />
              {name !==""  && (
                <TouchableOpacity
                  style={styles.closeIcon}
                  onPress={() => clearInput(setName)}
                >
                  <Text style={styles.closeText}>X</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Twitter Input */}
            <View className="relative mb-3">
              <TextInput
                placeholder="Twitter URL"
                value={twitter}
                onChangeText={setTwitter}
                className="border p-3 rounded-lg"
              />
              {twitter !=="" && (
                <TouchableOpacity
                  style={styles.closeIcon}
                  onPress={() => clearInput(setTwitter)}
                >
                  <Text style={styles.closeText}>X</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* GitHub Input */}
            <View className="relative mb-3">
              <TextInput
                placeholder="GitHub URL"
                value={github}
                onChangeText={setGithub}
                className="border p-3 rounded-lg"
              />
              {github  !=="" && (
                <TouchableOpacity
                  style={styles.closeIcon}
                  onPress={() => clearInput(setGithub)}
                >
                  <Text style={styles.closeText}>X</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* LinkedIn Input */}
            <View className="relative mb-3">
              <TextInput
                placeholder="LinkedIn URL"
                value={linkedin}
                onChangeText={setLinkedin}
                className="border p-3 rounded-lg"
              />
              {linkedin !=="" && (
                <TouchableOpacity
                  style={styles.closeIcon}
                  onPress={() => clearInput(setLinkedin)}
                >
                  <Text style={styles.closeText}>X</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Instagram Input */}
            <View className="relative mb-3">
              <TextInput
                placeholder="Instagram URL"
                value={instagram}
                onChangeText={setInstagram}
                className="border p-3 rounded-lg"
              />
              {instagram !=="" && (
                <TouchableOpacity
                  style={styles.closeIcon}
                  onPress={() => clearInput(setInstagram)}
                >
                  <Text style={styles.closeText}>X</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Save Button */}
            <ButtonComp title="Save Changes" onPress={handleUpdateProfile} />
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  closeIcon: {
    position: "absolute",
    right: 10,
    top: 12,
  },
  closeText: {
    fontSize: 18,
    color: "red",
  },
});
