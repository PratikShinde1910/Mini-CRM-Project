import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Card } from 'react-native-paper';
import { getApiUrl } from '../utils/networkTest';

const DebugInfo = () => {
  const [networkInfo, setNetworkInfo] = useState(null);

  useEffect(() => {
    const checkNetwork = async () => {
      try {
        const baseURL = getApiUrl();
        const response = await fetch(`${baseURL}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Test',
            email: 'test@test.com',
            password: 'test123'
          }),
        });
        
        setNetworkInfo(`Network test: ${response.status} - ${response.statusText}`);
      } catch (error) {
        setNetworkInfo(`Network error: ${error.message}`);
      }
    };

    checkNetwork();
  }, []);

  const baseURL = getApiUrl();

  return (
    <Card style={styles.container}>
      <Card.Content>
        <Text style={styles.title}>Debug Info</Text>
        <Text>Platform: {Platform.OS}</Text>
        <Text>Version: {Platform.Version}</Text>
        <Text>Dev Mode: {__DEV__ ? 'Yes' : 'No'}</Text>
        <Text>API URL: {baseURL}</Text>
        <Text>{networkInfo || 'Testing network...'}</Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default DebugInfo;