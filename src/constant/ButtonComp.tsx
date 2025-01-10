import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";

const ButtonComp = ({ title, onPress, style, icon: Icon, iconStyle }: any) => {
  return (
    <TouchableOpacity
      style={[styles.button_container, style]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text style={styles.button_text}>{title}</Text>
      {Icon && <Icon size={24} style={[styles.icon_right, iconStyle]} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button_container: {
    backgroundColor: "black",
    width: "100%",
    padding: 15,
    // paddingVertical: 12,
    // paddingHorizontal: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", 
    position: "relative", 
  },
  button_text: {
    fontSize: 16,
    color: "white",
    flex: 1, // Ensures the text occupies the center
    textAlign: "center",
    // justifyContent:'center'
  },
  icon_right: {
    position: "absolute",
    right: 10, // Aligns icon to the right
    color: "white",
  },
});

export default ButtonComp;
