import React,{useState} from "react";
import { Modal, View, TouchableOpacity, Text, Image } from "react-native";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
} from "react-native-reanimated";
import {
  GestureHandlerRootView,
  PinchGestureHandler,
} from "react-native-gesture-handler";
import UpdateAvatar from "./UpdateAvatar";

const ZoomImageModal = ({ visible, imageUri, onClose, currentUserId }) => {
  const [imageView,setImageView] = useState(imageUri || "")
  const scale = useSharedValue(1);
  
  // Gesture handler to scale the image during pinch gestures
  const pinchHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      scale.value = event.scale;
    },
    onEnd: () => {
      scale.value = 1; // Reset scale after pinch ends
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <GestureHandlerRootView className="flex-1 bg-black/90 justify-center items-center">
        {/* Pinch Gesture Handler for zooming image */}
        <PinchGestureHandler onGestureEvent={pinchHandler}>
          <Animated.View className="w-full h-full justify-center items-center">
            {/* Display image with pinch-to-zoom */}
            <Animated.Image
              source={{ uri: imageView }}
              className="w-full h-full"
              resizeMode="contain"
              style={animatedStyle}
            />
          </Animated.View>
        </PinchGestureHandler>

        {/* Update Avatar option inside modal */}
        {currentUserId && (
          <View className="absolute bottom-24">
            <UpdateAvatar currentUserId={currentUserId} imageUri={imageView} setImageView={setImageView} onClose={onClose}/>
          </View>
        )}

        {/* Close button */}
        <TouchableOpacity
          className="absolute top-10 right-5 bg-white h-10 w-10 rounded-full items-center justify-center"
          onPress={onClose}
        >
          <Text className="text-lg font-bold">X</Text>
        </TouchableOpacity>
      </GestureHandlerRootView>
    </Modal>
  );
};

export default ZoomImageModal;
