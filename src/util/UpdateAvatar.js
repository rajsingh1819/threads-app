import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { handleAvatar } from "../provider/userAllApi";
import { pickImage } from "./mediaPicker";

const UpdateAvatar = ({ currentUserId, imageUri, setImageView, onClose }) => {
  const [imageSelected, setImageSelected] = useState(false); // Track if an image is selected
  const [newImageUri, setNewImageUri] = useState(imageUri); // Track new image URI
  const [isLoading, setIsLoading] = useState(false);

  // Function to trigger image picker when user wants to change avatar
  const handleChangeAvatar = () => {
    pickImage((uri) => {
      setNewImageUri(uri);
      setImageView(uri); // Now set the image view directly with the updated URI
      setImageSelected(true); // Mark the image as selected
    });

    // console.log("Change avatar for user ID:", currentUserId);
  };

  // Function to handle updating the avatar
  const handleUpdateAvatar = async () => {
    if (imageSelected) {
      // Call the API to update avatar
      setIsLoading(true);
      try {
        const imageUriToUpdate = newImageUri?.startsWith("data:image") ? newImageUri : null;
        const result = await handleAvatar({ userId: currentUserId, image: imageUriToUpdate });
        // console.log("Avatar updated successfully:", result);
        if(result){
          setIsLoading(false);
          onClose();

        }
      
      } catch (error) {
        console.error("Error updating avatar:", error);
        setIsLoading(false);
      }
    }
  };

  return (
    <View>
      {isLoading && (
        <View className="absolute inset-0 flex items-center justify-center bg-white/10 z-50">
          <ActivityIndicator size={30} color="white" />
        </View>
      )}

      {/* If no image is selected, show the "Change Avatar" button */}
      {!imageSelected ? (
        <TouchableOpacity onPress={handleChangeAvatar} className="mt-2 bg-black p-4 rounded-lg">
          <Text className="text-blue-500">Change Avatar</Text>
        </TouchableOpacity>
      ) : (
        // After selecting an image, show "Confirm Update"
        <TouchableOpacity onPress={handleUpdateAvatar} className="mt-2 bg-black p-4 rounded-lg">
          <Text className="text-green-500">Confirm Update</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default UpdateAvatar;
