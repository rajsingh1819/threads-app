import { useEffect } from "react";
import { Redirect } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../provider/auth";


export default function middleware() {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading: authLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth()); // Check authentication when the app loads
  }, [dispatch]);

  // Handle the authentication state logic
  if (authLoading) {
    return null; }

  if (!isAuthenticated) {
       return <Redirect href="/(auth)" />;
  }

  // Allow access to the requested route if the user is authenticated
  return null;
}
