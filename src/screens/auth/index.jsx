import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

// import LoginUser from "../../components/login";
import RegisterUser from "../../components/userLogin/register";
import LoginUser from "../../components/userLogin/login";

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <SafeAreaView className="flex-1 mt-6 ">
      {isLogin ? (
        <LoginUser isLogin={isLogin} setIsLogin={setIsLogin} />
      ) : (
        <RegisterUser isLogin={isLogin} setIsLogin={setIsLogin} />
      )}
    </SafeAreaView>
  );
};

export default AuthScreen;
