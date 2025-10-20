import React from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';

import { store } from '../src/redux/store';
import AppNavigator from '../src/navigation/AppNavigator';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </PaperProvider>
    </Provider>
  );
}
