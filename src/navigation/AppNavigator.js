/* eslint-disable import/namespace, import/no-named-as-default, import/no-named-as-default-member */
import React, { useEffect } from 'react';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector, useDispatch } from 'react-redux';
import { ActivityIndicator, View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { checkStoredToken } from '../redux/authSlice';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import LeadsListScreen from '../screens/Leads/LeadsListScreen';
import LeadFormScreen from '../screens/Leads/LeadFormScreen';
import LeadDetailsScreen from '../screens/Leads/LeadDetailsScreen';
import CustomerListScreen from '../screens/Customers/CustomerListScreen';
import CustomerDetailsScreen from '../screens/Customers/CustomerDetailsScreen';
import CustomerFormScreen from '../screens/Customers/CustomerFormScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { modernTheme } from '../styles/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const LeadsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="LeadsList" component={LeadsListScreen} />
    <Stack.Screen name="LeadDetails" component={LeadDetailsScreen} />
    <Stack.Screen name="LeadForm" component={LeadFormScreen} />
  </Stack.Navigator>
);

const CustomersStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="CustomerList" component={CustomerListScreen} />
    <Stack.Screen name="CustomerDetails" component={CustomerDetailsScreen} />
    <Stack.Screen name="CustomerForm" component={CustomerFormScreen} />
    <Stack.Screen name="LeadForm" component={LeadFormScreen} />
  </Stack.Navigator>
);

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: modernTheme.colors.surface,
      paddingBottom: 34, // Safe area for home indicator
      paddingTop: 12,
      paddingHorizontal: 16,
      ...modernTheme.shadows.lg,
    }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;
        
        const isFocused = state.index === index;
        
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });
          
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };
        
        const getIconName = (routeName) => {
          switch (routeName) {
            case 'Dashboard': return 'analytics-outline';
            case 'Leads': return 'trending-up-outline';
            case 'Customers': return 'people-outline';
            case 'Profile': return 'person-outline';
            default: return 'circle-outline';
          }
        };
        
        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: 8,
            }}
          >
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: isFocused ? modernTheme.colors.primary : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 4,
            }}>
              <Ionicons
                name={getIconName(route.name)}
                size={24}
                color={isFocused ? modernTheme.colors.surface : modernTheme.colors.onSurfaceVariant}
              />
            </View>
            <Text style={{
              fontSize: 12,
              color: isFocused ? modernTheme.colors.primary : modernTheme.colors.onSurfaceVariant,
              fontWeight: isFocused ? '600' : '400',
            }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const MainTabs = () => (
  <Tab.Navigator 
    screenOptions={{ headerShown: false }}
    tabBar={(props) => <CustomTabBar {...props} />}
  >
    <Tab.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{ tabBarLabel: 'Home' }}
    />
    <Tab.Screen
      name="Leads"
      component={LeadsStack}
      options={{ tabBarLabel: 'Leads' }}
    />
    <Tab.Screen
      name="Customers"
      component={CustomersStack}
      options={{ tabBarLabel: 'Clients' }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ tabBarLabel: 'Profile' }}
    />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkStoredToken());
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        {isAuthenticated ? <MainTabs /> : <AuthStack />}
      </NavigationContainer>
    </NavigationIndependentTree>
  );
};

export default AppNavigator;
