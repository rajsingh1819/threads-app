import { Image, Pressable } from "react-native";
import { useState } from "react";
import ZoomImageModal from "./ZoomImageModal";

const ImageView = ({ imageUri, className = "w-full h-44 rounded-lg" }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Pressable onPress={() => setModalVisible(true)}>
        <Image
          source={{ uri: imageUri }}
          className={className}
          resizeMode="contain"
        />
      </Pressable>

      <ZoomImageModal
        visible={modalVisible}
        imageUri={imageUri}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};

export default ImageView;
