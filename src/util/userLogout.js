import { useDispatch } from "react-redux";
import { showToast } from "../constant/showToast";
import { router } from "expo-router";
import { logoutUser } from "../provider/auth";

const userLogout = () => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const result = await dispatch(logoutUser()).unwrap();
      if (result) {
        router.push("/(auth)");
        showToast("info", "User logged out successfully 🎉");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return handleLogout; 
};

export default userLogout;
