import React from "react";
import { Modal, View, TouchableOpacity, Text, Image } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle } from "react-native-reanimated";
import { GestureHandlerRootView, PinchGestureHandler } from "react-native-gesture-handler";

const ZoomImageModal = ({ visible, imageUri, onClose }) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <GestureHandlerRootView className="flex-1 bg-black/90 justify-center items-center">
        <PinchGestureHandler onGestureEvent={(event) => (scale.value = event.scale)}>
          <Animated.View className="w-full h-full justify-center items-center">
            <Animated.Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="contain" style={animatedStyle} />
          </Animated.View>
        </PinchGestureHandler>
        <TouchableOpacity className="absolute top-10 right-5 bg-white h-10 w-10 rounded-full items-center justify-center" onPress={onClose}>
          <Text className="text-lg font-bold">X</Text>
        </TouchableOpacity>
      </GestureHandlerRootView>
    </Modal>
  );
};

export default ZoomImageModal;
