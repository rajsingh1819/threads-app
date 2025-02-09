import { Image, Pressable, View } from "react-native";
import { useState } from "react";
import ZoomImageModal from "./ZoomImageModal";


const AvatarView = ({ avatarUri, size = "md" ,currentUserId}) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Define different size classes
  const sizeClasses = {
    sm: "h-8 w-8",  // Small size (32x32)
    md: "h-12 w-12", // Medium size (48x48)
    lg: "h-16 w-16", // Large size (64x64)
    xl: "h-20 w-20", // Extra large (80x80)
  };

  return (
    <>
      <Pressable onPress={() => setModalVisible(true)}>
        <View>
          <Image
            source={{ uri: avatarUri }}
            className={`${sizeClasses[size] || sizeClasses.md} rounded-full`}
            resizeMode="cover"
          />
        </View>
      </Pressable>

      {modalVisible && (
        <ZoomImageModal
          visible={modalVisible}
          imageUri={avatarUri}
          onClose={() => setModalVisible(false)}
          currentUserId={currentUserId}
        />
      )}
    </>
  );
};

export default AvatarView;








