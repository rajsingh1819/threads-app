import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";
import { url } from "./url";
import { showToast } from "../constant/showToast";

// Initial state
const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
};

// Register User
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}/api/auth/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to register user");
      }

      const data = await response.json();
      if (data.success) {
        showToast("success", "User registered successfully 🎉");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}/api/auth/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid login credentials");
      }

      const data = await response.json();
      if (data.success) {
        showToast("success", `Welcome ${data?.user?.username} 🎉`);
        await AsyncStorage.setItem("authToken", data.token); // Store the token
        return { token: data.token, user: data.user };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await AsyncStorage.removeItem("authToken");
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Check Authentication
export const checkAuth = createAsyncThunk(
  "auth/checkAuthentication",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        const decodedToken = jwtDecode(token);
        const isTokenExpired = decodedToken.exp * 1000 < Date.now();

        if (isTokenExpired) {
          await AsyncStorage.removeItem("authToken");
          throw new Error("Token expired. Please login again.");
        }

        const response = await fetch(`${url}/api/auth/profile/${decodedToken.userId}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }
        
        const data = await response.json();
        if (data.user) {
          dispatch(setUser(data.user));
          //  console.log(data?.message)
          return { token, user: data.user };
        }
      }
      throw new Error("No token found");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload; // Set isAuthenticated based on user existence
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
