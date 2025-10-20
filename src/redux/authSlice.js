import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import axios from 'axios';
import { getApiUrl } from '../utils/networkTest';

const API_BASE_URL = getApiUrl();

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      });
      
      const { token, user } = response.data;
      await SecureStore.setItemAsync('authToken', token);
      
      return { token, user };
    } catch (error) {
      console.log('Login error:', error);
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Login failed'
      );
    }
  }
);

// Async thunk for register
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      console.log('API URL:', API_BASE_URL);
      console.log('Registration data:', { name, email, password: '***' });
      
      const response = await axios.post(`${API_BASE_URL}/register`, {
        name,
        email,
        password,
      }, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      
      console.log('Registration response:', response.data);
      
      const { token, user } = response.data;
      await SecureStore.setItemAsync('authToken', token);
      
      return { token, user };
    } catch (error) {
      console.log('Registration error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Registration failed'
      );
    }
  }
);

export const checkStoredToken = createAsyncThunk(
  'auth/checkStoredToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) {
        return rejectWithValue('No token found');
      }
      
   
      const response = await axios.get(`${API_BASE_URL}/verify-token`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return { token, user: response.data.user };
    } catch (error) {
      await SecureStore.deleteItemAsync('authToken');
      return rejectWithValue('Token verification failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    await SecureStore.deleteItemAsync('authToken');
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isLoading: false,
    isAuthenticated: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      
      .addCase(checkStoredToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkStoredToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(checkStoredToken.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      
      
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError, setLoading } = authSlice.actions;
export default authSlice.reducer;