import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, SafeAreaView, StyleSheet, Alert } from 'react-native';
import { TextInput, ActivityIndicator, Snackbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addCustomer, updateCustomer } from '../../redux/customersSlice';
import { modernTheme } from '../../styles/theme';

const CustomerSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Too Short!').required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  phone: Yup.string().optional(),
  company: Yup.string().optional(),
});

const CustomerFormScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { mode, customer } = route.params || { mode: 'add' };
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    company: customer?.company || '',
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const onSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      setIsSubmitting(true);
      console.log('Submitting customer data:', values);
      
      let result;
      if (mode === 'edit') {
        result = await dispatch(updateCustomer({ id: customer.id, updates: values }));
      } else {
        result = await dispatch(addCustomer(values));
      }
      
      console.log('API Result:', result);
      
      if (result.meta.requestStatus === 'fulfilled') {
        showSnackbar(
          mode === 'edit' 
            ? 'Customer updated successfully!' 
            : 'Customer created successfully!'
        );
        setTimeout(() => {
          navigation.goBack();
        }, 1000);
      } else if (result.meta.requestStatus === 'rejected') {
        const errorMessage = result.payload || 'Something went wrong';
        console.error('Submission failed:', errorMessage);
        
        if (errorMessage.toLowerCase().includes('email')) {
          setFieldError('email', 'This email is already in use');
        } else {
          showSnackbar(`Error: ${errorMessage}`);
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      showSnackbar('Network error. Please check your connection.');
    } finally {
      setSubmitting(false);
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{mode === 'edit' ? 'Edit Client' : 'New Client'}</Text>
          <View style={{ width: 60 }} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Formik initialValues={initialValues} validationSchema={CustomerSchema} onSubmit={onSubmit}>
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting: formikIsSubmitting }) => (
            <View style={styles.formContainer}>
              {/* Form Fields */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Full Name</Text>
                <View style={[styles.inputContainer, touched.name && errors.name && styles.inputError]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Client Name"
                    value={values.name}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    placeholderTextColor={modernTheme.colors.onSurfaceVariant}
                  />
                </View>
                {touched.name && errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Email</Text>
                <View style={[styles.inputContainer, touched.email && errors.email && styles.inputError]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Email Address"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor={modernTheme.colors.onSurfaceVariant}
                  />
                </View>
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Phone</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Phone Number"
                    value={values.phone}
                    onChangeText={handleChange('phone')}
                    onBlur={handleBlur('phone')}
                    keyboardType="phone-pad"
                    placeholderTextColor={modernTheme.colors.onSurfaceVariant}
                  />
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Company</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Company Name"
                    value={values.company}
                    onChangeText={handleChange('company')}
                    onBlur={handleBlur('company')}
                    placeholderTextColor={modernTheme.colors.onSurfaceVariant}
                  />
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.submitButton, (isSubmitting || formikIsSubmitting) && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting || formikIsSubmitting}
              >
                {(isSubmitting || formikIsSubmitting) ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator color={modernTheme.colors.surface} size="small" />
                    <Text style={[styles.submitButtonText, { marginLeft: 8 }]}>
                      {mode === 'edit' ? 'Updating...' : 'Creating...'}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.submitButtonText}>
                    {mode === 'edit' ? 'Update Client' : 'Create Client'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
      
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: modernTheme.colors.background,
  },
  header: {
    backgroundColor: modernTheme.colors.surface,
    paddingHorizontal: modernTheme.spacing.md,
    paddingBottom: modernTheme.spacing.md,
    ...modernTheme.shadows.sm,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: modernTheme.spacing.sm,
  },
  cancelText: {
    ...modernTheme.typography.body,
    color: modernTheme.colors.primary,
  },
  headerTitle: {
    ...modernTheme.typography.h3,
    color: modernTheme.colors.onSurface,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: modernTheme.spacing.md,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  fieldContainer: {
    marginBottom: modernTheme.spacing.md,
  },
  fieldLabel: {
    ...modernTheme.typography.h3,
    color: modernTheme.colors.onSurface,
    marginBottom: modernTheme.spacing.xs,
  },
  inputContainer: {
    backgroundColor: modernTheme.colors.surface,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: modernTheme.colors.outline,
    paddingHorizontal: modernTheme.spacing.sm,
    paddingVertical: 6,
    ...modernTheme.shadows.sm,
  },
  inputError: {
    borderColor: modernTheme.colors.error,
  },
  input: {
    ...modernTheme.typography.body,
    color: modernTheme.colors.onSurface,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  errorText: {
    ...modernTheme.typography.caption,
    color: modernTheme.colors.error,
    marginTop: modernTheme.spacing.xs,
  },
  submitButton: {
    backgroundColor: modernTheme.colors.primary,
    borderRadius: modernTheme.borderRadius.sm,
    paddingVertical: modernTheme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: modernTheme.spacing.xl,
    ...modernTheme.shadows.sm,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    ...modernTheme.typography.button,
    color: modernTheme.colors.surface,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  snackbar: {
    backgroundColor: modernTheme.colors.primary,
  },
});

export default CustomerFormScreen;
