import { Stack, router} from "expo-router";


export default function Layout() {
   
  return (
    <Stack   screenOptions={{headerShown:false}}>
      <Stack.Screen name="index"  />
         {/* <Stack.Screen
        name="modal"
        options={{
          presentation: 'modal',
          headerTitle: "User",
          headerLeft: () => (
          
             <Ionicons name="arrow-back" size={24} color="black" 
            onPress={() => router.push("/activity")}
            style={{ marginLeft: 15,marginRight:10}}
            />
        
          
           
          ),
        }}
      /> */}
    </Stack>
  );
}
