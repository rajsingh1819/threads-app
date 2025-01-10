import Toast from "react-native-toast-message";
// npm i npm install react-native-toast-message
/**
 * Show a toast notification.
 * @param {string} type - Type of toast ("success" or "error").
 * @param {string} message - The message to display in the toast.
 */
export const showToast = (type, message) => {
  Toast.show({
    type: type, // "success" or "error"
    text1: type === "success" ? "Success!" : "Error!",
    text2: message,
    position: "top",
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 30, // Adjust as needed for your UI
    text1Style: {
      fontSize: 16,
      fontWeight: "bold",
    },
    text2Style: {
      fontSize: 14,
      color: "#555",
    },
  });
};
