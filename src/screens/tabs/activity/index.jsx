import { Text ,View} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector ,useDispatch} from "react-redux";


import React, { useEffect } from "react";
import { checkAuth } from "../../../provider/auth";




export default () => {
  const {isAuthenticated, user, isLoading} = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  useEffect(() => {
  
        dispatch(checkAuth()); // Only dispatch if token is found
    
  }, [dispatch]); // Trigger once when the state is not determined yet

  


  return (
    <SafeAreaView>
    <View style={{padding:20}}>
    <Text className="text-2xl font-bold">Activity  : {user?.username}</Text>
      </View>
    </SafeAreaView>
  );
};

