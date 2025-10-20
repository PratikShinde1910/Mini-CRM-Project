import { Platform, NativeModules } from 'react-native';

export const getApiUrl = () => {
  // Allow explicit override via env var in Expo
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) return envUrl;

  if (!__DEV__) {
    return 'https://your-production-api.com';
  }

  // In dev, derive the host running Metro to build a reachable API URL
  let host = null;
  try {
    const scriptURL = NativeModules?.SourceCode?.scriptURL;
    if (scriptURL) {
      host = new URL(scriptURL).hostname; // e.g., 192.168.31.18, localhost, 10.0.2.2
    }
  } catch {}

  // Android emulator special-case: always use 10.0.2.2 to reach host machine
  if (Platform.OS === 'android') {
    if (!host || host === 'localhost' || host === '127.0.0.1') {
      return 'http://10.0.2.2:3001';
    }
  }

  // If we have a LAN host (physical device), use it
  if (host && host !== 'localhost' && host !== '127.0.0.1') {
    return `http://${host}:3001`;
  }

  // iOS simulator and web can use localhost
  if (Platform.OS === 'ios' || Platform.OS === 'web') {
    return 'http://localhost:3001';
  }

  // Fallback for any other case
  return 'http://10.0.2.2:3001';
};

export const testConnection = async () => {
  const baseURL = getApiUrl();
  console.log(`Testing connection to: ${baseURL}`);
  
  try {
    const response = await fetch(`${baseURL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: `test-${Date.now()}@example.com`,
        password: 'test123456'
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Response data:', data);
      return { success: true, data };
    } else {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }
  } catch (error) {
    console.log('Network error:', error);
    return { success: false, error: error.message };
  }
};
