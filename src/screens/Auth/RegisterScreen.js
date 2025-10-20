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

import { registerUser, clearError } from '../../redux/authSlice';
import DebugInfo from '../../components/DebugInfo';

const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

const RegisterScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleRegister = async (values) => {
    dispatch(clearError());
    
    console.log('Attempting registration with:', { ...values, password: '***', confirmPassword: '***' });
    
    try {
      const { confirmPassword, ...registerData } = values;
      console.log('Dispatching registerUser action');
      const resultAction = await dispatch(registerUser(registerData));
      
      console.log('Registration result:', resultAction);
      
      if (registerUser.rejected.match(resultAction)) {
        console.log('Registration rejected:', resultAction.payload);
        Alert.alert('Registration Failed', resultAction.payload);
      } else {
        console.log('Registration successful!');
      }

    } catch (err) {
      console.log('Registration error caught:', err);
      Alert.alert('Registration Failed', 'An unexpected error occurred');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <DebugInfo />
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Create Account</Title>
            <Paragraph style={styles.subtitle}>
              Sign up to get started
            </Paragraph>

            <Formik
              initialValues={{ 
                name: '', 
                email: '', 
                password: '', 
                confirmPassword: '' 
              }}
              validationSchema={RegisterSchema}
              onSubmit={handleRegister}
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
                    label="Full Name"
                    value={values.name}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    autoComplete="name"
                    error={touched.name && errors.name}
                    style={styles.input}
                  />
                  {touched.name && errors.name && (
                    <HelperText type="error" visible={true}>
                      {errors.name}
                    </HelperText>
                  )}

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
                    autoComplete="new-password"
                    error={touched.password && errors.password}
                    style={styles.input}
                  />
                  {touched.password && errors.password && (
                    <HelperText type="error" visible={true}>
                      {errors.password}
                    </HelperText>
                  )}

                  <TextInput
                    label="Confirm Password"
                    value={values.confirmPassword}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    secureTextEntry
                    autoComplete="new-password"
                    error={touched.confirmPassword && errors.confirmPassword}
                    style={styles.input}
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <HelperText type="error" visible={true}>
                      {errors.confirmPassword}
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
                    style={styles.registerButton}
                  >
                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                  </Button>

                  <Button
                    mode="text"
                    onPress={() => navigation.navigate('Login')}
                    disabled={isLoading}
                    style={styles.loginButton}
                  >
                    Already have an account? Sign In
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
  registerButton: {
    marginTop: 24,
    marginBottom: 16,
    paddingVertical: 8,
  },
  loginButton: {
    marginTop: 8,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default RegisterScreen;