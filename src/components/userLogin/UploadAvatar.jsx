import React, { useState } from "react";
import { View, Text, Button, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";

const UploadAvatar = ({onUploadSuccess }) => {
  const [imageUri, setImageUri] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        console.log("Selected image URI:", uri); // Debug log
        setImageUri(uri);
        setError(""); // Clear error
      } else {
        setError("Image selection was canceled or failed.");
      }
    } catch (err) {
      setError("Error picking image: " + err.message);
    }
  };

  const uploadImage = async () => {
    if (!imageUri) {
      setError("Please select an image first.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: imageUri.split("/").pop(),
    });
  
    // You can fetch the Cloudinary URL after upload
    const uploadUrl = `http://127.0.0.1:3000/api/user/upload-avatar`;
  
    setIsUploading(true);
  
    try {
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
  
      const data = await response.json();
      console.log("Upload successful:", data);
  
      // Assuming `data.avatar` contains the Cloudinary URL
      onUploadSuccess(data.avatar);
      setImageUri(null); // Reset image after upload
      setError(""); // Clear any error
    } catch (err) {
      setError("Error uploading avatar: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };
  

  return (
    <View className="items-center gap-4">
      <TouchableOpacity onPress={pickImage}>
      {imageUri ? (
  <Image source={{ uri: imageUri }} className="w-32 h-32 rounded-full" />
) : (
  <View className="w-32 h-32 rounded-full bg-slate-500 border flex items-center justify-center">
    <View>
      <Text className="text-white">Pick Image</Text>
    </View>
  </View>
)}

      </TouchableOpacity>

      {isUploading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Upload Avatar" onPress={uploadImage} />
      )}

      {error && <Text className="text-red-500 mt-2">{error}</Text>}
    </View>
  );
};

export default UploadAvatar;
