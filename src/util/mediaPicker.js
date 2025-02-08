import * as ImagePicker from "expo-image-picker";

// Function to pick an image from the gallery
export const pickImage = async (setImageUri) => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.5,
    });
    if (!result.canceled && result.assets?.length) {
      setImageUri(result.assets[0].uri); // Set selected image URI
      // console.log("Image URI:", result.assets[0].uri); // Debug log
    } else {
      console.log("Image selection canceled or failed.");
    }
  } catch (err) {
    console.error("Error picking image: " + err.message);
  }
};
