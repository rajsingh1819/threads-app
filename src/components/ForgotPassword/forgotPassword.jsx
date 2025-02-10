import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import {
  sendOTP,
  verifyUserOtp,
  resetUserPassword,
} from "../../provider/userAllApi";

import HeaderBack from "../../constant/HeaderBack";
import ButtonComp from "../../constant/ButtonComp";
import { router } from "expo-router";
import { showToast } from "../../constant/showToast";
import { SafeAreaView } from "react-native-safe-area-context";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [emailOrPhone, setEmailOrPhone] = useState(""); // Changed to emailOrPhone
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Function to remove spaces from OTP input
  const handleOtpChange = (text) => {
    setOtp(text.replace(/\s+/g, "")); // Removes all spaces from the OTP
  };

  const handleSendOtp = async () => {
    if (!emailOrPhone)
      return showToast("info", "Please enter your email or phone");

    setIsLoading(true);

    const response = await sendOTP(emailOrPhone); // Pass emailOrPhone

    if (!response.success) {
      setIsLoading(false);
      showToast("error", response.message || "User not available");
    }
    if (response.success) {
      setIsLoading(false);

      setStep(2);
      showToast("success", "OTP sent to your email or phone");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return showToast("error", "Please enter the OTP");

    const response = await verifyUserOtp(emailOrPhone, otp); // Pass emailOrPhone and OTP

    if (response.success) {
      setStep(3);
    } else {
      // Alert.alert("Error", response.message);
      showToast("error", response.message || "Somthing went wrong");
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword)
      return showToast("error", "Passwords do not match");

    const response = await resetUserPassword(emailOrPhone, otp, newPassword); // Pass emailOrPhone, OTP, and newPassword

    if (response.success) {
      showToast("success", "Password reset successful");
      setStep(1);
      setEmailOrPhone(""); // Reset emailOrPhone
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      router.replace("/"); // Redirect to the home page or appropriate route
    } else {
      Alert.alert("Error", response.message);
    }
  };

  const goBack = () => {
    router.replace("/");
  };

  return (
    <SafeAreaView className="flex-1">
      {isLoading && (
        <View className="absolute inset-0 flex items-center  mt-10  bg-white/10 z-50">
          <ActivityIndicator size={30} color="blue" />
          <Text className="mt-2 text-lg font-bold"> Sending OTP...</Text>
        </View>
      )}

      <KeyboardAvoidingView className="flex-1 items-center">
        <View className=" w-full sm:w-1/2 flex-1  ">
          <HeaderBack onPress={goBack} />
          <View className="flex-1 justify-center items-center p-2">
            {step === 1 && (
              <View className="w-full gap-2">
                <Text className="text-lg font-semibold">
                  Enter your email or phone:
                </Text>
                <TextInput
                  placeholder="Email or Phone"
                  value={emailOrPhone}
                  onChangeText={setEmailOrPhone}
                  className="border p-3 w-full mt-2 rounded-md"
                />

                <ButtonComp title="Send OTP" onPress={handleSendOtp} />

                <View className="flex-row gap-1 items-center">
                  <Text className=" font-semibold">
                    <Text className=" text-lg font-semibold text-red-500">
                      Note:
                    </Text>{" "}
                    Only email-based password recovery is supported.
                  </Text>
                </View>
              </View>
            )}

            {step === 2 && (
              <View className="w-full  gap-2">
                <Text className="text-lg font-semibold">Enter OTP:</Text>
                <TextInput
                  placeholder="OTP"
                  value={otp}
                  onChangeText={handleOtpChange} // Use handleOtpChange here
                  className="border p-3 w-full mt-2 rounded-md"
                />

                <ButtonComp title="Verify OTP" onPress={handleVerifyOtp} />
              </View>
            )}

            {step === 3 && (
              <View className="w-full  gap-2">
                <Text className="text-lg font-semibold">
                  Enter New Password:
                </Text>
                <TextInput
                  placeholder="New Password"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                  className="border p-3 w-full mt-2 rounded-md"
                />
                <TextInput
                  placeholder="Confirm Password"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  className="border p-3 w-full mt-2 rounded-md"
                />

                <ButtonComp
                  title="Reset Password"
                  onPress={handleResetPassword}
                />
                {newPassword &&
                confirmPassword &&
                newPassword === confirmPassword ? (
                  <Text className="text-green-500">Password Match!</Text>
                ) : newPassword && confirmPassword ? (
                  <Text className="text-red-500">Passwords do not match.</Text>
                ) : null}
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPassword;
