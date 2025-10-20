import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { 
  Text, 
  TextInput, 
  Button, 
  Card, 
  Title, 
  Paragraph,
  HelperText,
  ActivityIndicator
} from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

import { loginUser, clearError } from '../../redux/authSlice';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleLogin = async (values) => {
    dispatch(clearError());
    
    try {
      const resultAction = await dispatch(loginUser(values));
      
      if (loginUser.rejected.match(resultAction)) {
        Alert.alert('Login Failed', resultAction.payload);
      }

    } catch (err) {
      Alert.alert('Login Failed', 'An unexpected error occurred');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Welcome Back</Title>
            <Paragraph style={styles.subtitle}>
              Sign in to your account
            </Paragraph>

            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={LoginSchema}
              onSubmit={handleLogin}
            >
              {({ 
                handleChange, 
                handleBlur, 
                handleSubmit, 
                values, 
                errors, 
                touched 
              }) => (
                <View style={styles.form}>
                  <TextInput
                    label="Email"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    error={touched.email && errors.email}
                    style={styles.input}
                  />
                  {touched.email && errors.email && (
                    <HelperText type="error" visible={true}>
                      {errors.email}
                    </HelperText>
                  )}

                  <TextInput
                    label="Password"
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    secureTextEntry
                    autoComplete="password"
                    error={touched.password && errors.password}
                    style={styles.input}
                  />
                  {touched.password && errors.password && (
                    <HelperText type="error" visible={true}>
                      {errors.password}
                    </HelperText>
                  )}

                  {error && (
                    <HelperText type="error" visible={true} style={styles.errorText}>
                      {error}
                    </HelperText>
                  )}

                  <Button
                    mode="contained"
                    onPress={handleSubmit}
                    loading={isLoading}
                    disabled={isLoading}
                    style={styles.loginButton}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>

                  <Button
                    mode="text"
                    onPress={() => navigation.navigate('Register')}
                    disabled={isLoading}
                    style={styles.registerButton}
                  >
                    Don&apos;t have an account? Sign Up
                  </Button>
                </View>
              )}
            </Formik>
          </Card.Content>
        </Card>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    fontSize: 16,
    opacity: 0.7,
  },
  form: {
    marginTop: 16,
  },
  input: {
    marginBottom: 8,
  },
  loginButton: {
    marginTop: 24,
    marginBottom: 16,
    paddingVertical: 8,
  },
  registerButton: {
    marginTop: 8,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default LoginScreen;