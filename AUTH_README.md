# Authentication System Setup

This project now includes a complete authentication system with login and register functionality.

## Features

✅ **Redux Authentication State Management**
- Login/Register actions with AsyncStorage persistence
- Token-based authentication
- Automatic token verification on app launch

✅ **React Native Paper UI**
- Beautiful login and register forms
- Form validation with Formik + Yup
- Loading states and error handling

✅ **Navigation**
- Conditional navigation based on auth state
- Auth stack (Login/Register screens)
- Main app stack (Dashboard and other screens)

✅ **API Integration**
- Axios setup with automatic token attachment
- Token refresh handling
- Mock API server for testing

## File Structure

```
src/
├── redux/
│   ├── authSlice.js     # Authentication state management
│   └── store.js         # Redux store configuration
├── api/
│   └── api.js           # Axios configuration with interceptors
├── navigation/
│   └── AppNavigator.js  # Navigation setup with auth flow
└── screens/
    └── Auth/
        ├── LoginScreen.js    # Login form with validation
        └── RegisterScreen.js # Register form with validation
```

## Getting Started

### 1. Start the Mock API Server

In one terminal, run the mock server:

```bash
npm run mock-server
```

The server will run on `http://localhost:3001` with these endpoints:
- `POST /register` - Register a new user
- `POST /login` - Login user
- `GET /verify-token` - Verify authentication token

### 2. Start the React Native App

In another terminal, start the Expo app:

```bash
npm start
```

### 3. Test the Authentication Flow

1. **Register a new user:**
   - Fill in name, email, password, and confirm password
   - Form validation will ensure all fields are properly filled
   - Successful registration will automatically log you in

2. **Login with existing credentials:**
   - Use the email/password from registration
   - Token will be stored in AsyncStorage
   - App will navigate to the main dashboard

3. **Persistent Login:**
   - Close and reopen the app
   - You should remain logged in (token persists)

4. **Test Error Handling:**
   - Try registering with an existing email
   - Try logging in with wrong credentials
   - Error messages will be displayed appropriately

## Validation Rules

### Login Form
- Email: Must be a valid email format
- Password: Minimum 6 characters

### Register Form
- Name: Minimum 2 characters
- Email: Must be a valid email format
- Password: Minimum 6 characters
- Confirm Password: Must match the password

## API Configuration

To connect to your real API, update the `API_BASE_URL` in:
- `src/redux/authSlice.js`
- `src/api/api.js`

The API should return responses in this format:

**Register/Login Response:**
```json
{
  "token": "your-jwt-token",
  "user": {
    "id": 1,
    "name": "John Doe", 
    "email": "john@example.com"
  }
}
```

**Token Verification Response:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

## Next Steps

1. **Add Dashboard Screen:** Replace the placeholder dashboard with actual content
2. **Add Logout Functionality:** Add logout button in the main app
3. **Error Boundary:** Add error boundaries for better error handling
4. **Loading States:** Improve loading states throughout the app
5. **Real API Integration:** Connect to your actual backend API

## Troubleshooting

**App not loading screens:**
- Make sure all dependencies are installed
- Check that the navigation structure is properly set up

**Authentication not working:**
- Ensure the mock server is running on port 3001
- Check network connectivity between device/simulator and localhost
- For physical devices, use your computer's IP address instead of localhost

**Form validation errors:**
- Check that all required fields are filled
- Ensure password meets minimum length requirements
- Verify email format is correct