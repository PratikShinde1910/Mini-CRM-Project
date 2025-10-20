# Authentication Debug Instructions

## Current Issue
Registration is failing after filling out the form.

## Steps to Debug

### 1. First, make sure the mock server is running:
```bash
npm run mock-server
```
The server should show:
```
Mock API server running on http://localhost:3001
Available endpoints:
POST /register - Register a new user
POST /login - Login user
GET /verify-token - Verify authentication token
```

### 2. Test the server manually:
```bash
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

Expected response:
```json
{"message":"User registered successfully","token":"mock-jwt-token-1-1","user":{"id":1,"name":"Test User","email":"test@example.com"}}
```

### 3. Check the app platform and logs:
- Open the app and go to the Register screen
- You should see a "Debug Info" section at the top showing:
  - Platform (ios/android/web)
  - API URL being used
  - Network test result

### 4. Check console logs:
- Open the Expo/React Native debugger
- Watch the console when you attempt registration
- Look for logs like:
  - "Attempting registration with: ..."
  - "API URL: ..."
  - "Registration error details: ..."

## Common Issues and Solutions

### If you're using iOS Simulator:
- API URL should be: `http://localhost:3001`
- No additional setup needed

### If you're using Android Emulator:
- API URL should be: `http://10.0.2.2:3001`
- This maps to localhost on your development machine

### If you're using a physical device:
- You need to replace the URL with your computer's IP address
- Find your IP: `ifconfig` (Mac/Linux) or `ipconfig` (Windows)
- Update the `getApiUrl()` function to use `http://YOUR_IP:3001`

### If you're using Expo Web:
- API URL should be: `http://localhost:3001`
- CORS should be handled by the mock server

## Testing Network Connectivity

The app includes a network test that will show you:
1. What platform you're running on
2. What API URL is being used
3. Whether the connection to the mock server works

Check the Debug Info section at the top of the Register screen for this information.

## Next Steps

1. Start the mock server: `npm run mock-server`
2. Start the app: `npm start`
3. Navigate to Register screen
4. Check the Debug Info section
5. Try registering and watch the console logs
6. Report back what you see in the Debug Info and any console errors