import { Text ,View} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector ,useDispatch} from "react-redux";


import React, { useEffect } from "react";
import { checkAuth } from "../../../provider/auth";




export default () => {
  const {isAuthenticated, user, isLoading} = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  useEffect(() => {
    const checkAuthentication = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        dispatch(checkAuth()); // Only dispatch if token is found
      }
    };

    if (isAuthenticated === null) {
      checkAuthentication(); // Only call when the state is not set
    }
  }, [dispatch, isAuthenticated]); // Trigger once when the state is not determined yet

  


  return (
    <SafeAreaView>
    <View style={{padding:20}}>
    <Text className="text-2xl font-bold">Activity  : {user?.username}</Text>
      </View>
    </SafeAreaView>
  );
};

