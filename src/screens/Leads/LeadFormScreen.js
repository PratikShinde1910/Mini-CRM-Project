import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { TextInput, ActivityIndicator } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addLead, updateLead } from '../../redux/leadsSlice';
import { modernTheme } from '../../styles/theme';

const LeadSchema = Yup.object().shape({
  title: Yup.string().min(2, 'Too Short!').required('Required'),
  description: Yup.string().min(10, 'Description should be at least 10 characters').required('Required'),
  status: Yup.string().oneOf(['New', 'Contacted', 'Converted', 'Lost'], 'Invalid status').required('Required'),
  value: Yup.number().min(0, 'Value must be positive').required('Required'),
  customerId: Yup.string().required('Please select a customer'),
});

const LeadFormScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { mode, lead, customerId } = route.params || { mode: 'add' };
  const customers = useSelector(state => state.customers);

  const getDefaultCustomerId = () => {
    if (lead?.customerId) return lead.customerId.toString();
    if (customerId) return customerId.toString();
    if (customers?.items && customers.items.length > 0) {
      return customers.items[0].id.toString();
    }
    return '';
  };

  const initialValues = {
    title: lead?.title || '',
    description: lead?.description || '',
    status: lead?.status || 'New',
    value: lead?.value?.toString() || '',
    customerId: getDefaultCustomerId(),
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return modernTheme.colors.primary;
      case 'Contacted': return modernTheme.colors.secondary;
      case 'Converted': return modernTheme.colors.success;
      case 'Lost': return modernTheme.colors.error;
      default: return modernTheme.colors.onSurfaceVariant;
    }
  };

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const leadData = {
        title: values.title,
        description: values.description,
        status: values.status,
        value: parseFloat(values.value),
      };

      console.log('Form values:', values);
      console.log('Lead data:', leadData);
      console.log('Customer ID:', values.customerId);

      if (mode === 'edit') {
        const result = await dispatch(updateLead({ 
          leadId: lead.id, 
          updates: leadData 
        }));
        console.log('Update result:', result);
        if (result.meta.requestStatus === 'fulfilled') {
          navigation.goBack();
        }
      } else {
        if (!values.customerId) {
          console.error('No customer ID provided');
          return;
        }
        
        const result = await dispatch(addLead({ 
          customerId: parseInt(values.customerId), 
          payload: leadData 
        }));
        
        console.log('Add lead result:', result);
        console.log('Result type:', result.type);
        console.log('Result meta:', result.meta);
        console.log('Result payload:', result.payload);
        console.log('Result error:', result.error);
        
        if (result.type === 'leads/add/fulfilled') {
          console.log('Lead created successfully:', result.payload);
          navigation.goBack();
        } else if (result.type === 'leads/add/rejected') {
          console.error('Lead creation rejected:', {
            error: result.error,
            payload: result.payload,
            meta: result.meta
          });
        } else {
          console.error('Unexpected result type:', result.type);
        }
      }
    } catch (error) {
      console.error('Lead form submission error:', error);
    } finally {
      setSubmitting(false);
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
          <Text style={styles.headerTitle}>{mode === 'edit' ? 'Edit Lead' : 'New Lead'}</Text>
          <View style={{ width: 60 }} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Formik initialValues={initialValues} validationSchema={LeadSchema} onSubmit={onSubmit}>
          {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched, isSubmitting }) => (
            <View style={styles.formContainer}>

              {mode === 'add' && (
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Customer *</Text>
                  {customers?.items && customers.items.length > 0 ? (
                    <Picker
                      selectedValue={values.customerId}
                      onValueChange={(value) => setFieldValue('customerId', value)}
                    >
                      <Picker.Item label="Select a customer" value="" />
                      {(customers.items || []).map((customer) => (
                        <Picker.Item
                          key={customer.id}
                          label={customer.name}
                          value={customer.id.toString()}
                        />
                      ))}
                    </Picker>
                  ) : (
                    <View style={styles.noCustomersContainer}>
                      <Text style={styles.noCustomersText}>No customers available. Please add a customer first.</Text>
                    </View>
                  )}
                  {!values.customerId && touched.customerId && (
                    <Text style={styles.errorText}>Please select a customer</Text>
                  )}
                </View>
              )}

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Lead Title</Text>
                <View style={[styles.inputContainer, touched.title && errors.title && styles.inputError]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter lead title"
                    value={values.title}
                    onChangeText={handleChange('title')}
                    onBlur={handleBlur('title')}
                    placeholderTextColor={modernTheme.colors.onSurfaceVariant}
                  />
                </View>
                {touched.title && errors.title && (
                  <Text style={styles.errorText}>{errors.title}</Text>
                )}
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Description</Text>
                <View style={[styles.inputContainer, styles.textAreaContainer, touched.description && errors.description && styles.inputError]}>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Enter lead description"
                    value={values.description}
                    onChangeText={handleChange('description')}
                    onBlur={handleBlur('description')}
                    multiline
                    numberOfLines={4}
                    placeholderTextColor={modernTheme.colors.onSurfaceVariant}
                  />
                </View>
                {touched.description && errors.description && (
                  <Text style={styles.errorText}>{errors.description}</Text>
                )}
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Status</Text>
                <View style={styles.statusButtonsContainer}>
                  {['New', 'Contacted', 'Converted', 'Lost'].map((status) => {
                    const isSelected = values.status === status;
                    const statusColor = getStatusColor(status);
                    return (
                      <TouchableOpacity
                        key={status}
                        style={[
                          styles.statusButton,
                          isSelected && {
                            backgroundColor: statusColor,
                            borderColor: statusColor,
                          }
                        ]}
                        onPress={() => setFieldValue('status', status)}
                      >
                        <Text style={[
                          styles.statusButtonText,
                          isSelected && { color: modernTheme.colors.surface }
                        ]}>
                          {status}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                {touched.status && errors.status && (
                  <Text style={styles.errorText}>{errors.status}</Text>
                )}
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Lead Value</Text>
                <View style={[styles.inputContainer, touched.value && errors.value && styles.inputError]}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={[styles.input, styles.valueInput]}
                    placeholder="0.00"
                    value={values.value}
                    onChangeText={handleChange('value')}
                    onBlur={handleBlur('value')}
                    keyboardType="numeric"
                    placeholderTextColor={modernTheme.colors.onSurfaceVariant}
                  />
                </View>
                {touched.value && errors.value && (
                  <Text style={styles.errorText}>{errors.value}</Text>
                )}
              </View>

              <TouchableOpacity 
                style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={modernTheme.colors.surface} />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {mode === 'edit' ? 'Update Lead' : 'Create Lead'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
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
  },
  fieldContainer: {
    marginBottom: modernTheme.spacing.lg,
  },
  fieldLabel: {
    ...modernTheme.typography.h3,
    color: modernTheme.colors.onSurface,
    marginBottom: modernTheme.spacing.sm,
  },
  inputContainer: {
    backgroundColor: modernTheme.colors.surface,
    borderRadius: modernTheme.borderRadius.sm,
    borderWidth: 1,
    borderColor: modernTheme.colors.outline,
    paddingHorizontal: modernTheme.spacing.md,
    paddingVertical: modernTheme.spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    ...modernTheme.shadows.sm,
  },
  textAreaContainer: {
    minHeight: 100,
    alignItems: 'flex-start',
    paddingVertical: modernTheme.spacing.sm,
  },
  inputError: {
    borderColor: modernTheme.colors.error,
  },
  input: {
    flex: 1,
    ...modernTheme.typography.body,
    color: modernTheme.colors.onSurface,
    paddingVertical: modernTheme.spacing.sm,
    backgroundColor: 'transparent',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  valueInput: {
    textAlign: 'right',
  },
  currencySymbol: {
    ...modernTheme.typography.body,
    color: modernTheme.colors.onSurfaceVariant,
    marginRight: modernTheme.spacing.xs,
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: modernTheme.spacing.sm,
  },
  statusButton: {
    paddingHorizontal: modernTheme.spacing.md,
    paddingVertical: modernTheme.spacing.sm,
    borderRadius: modernTheme.borderRadius.sm,
    backgroundColor: modernTheme.colors.surfaceVariant,
    borderWidth: 1.5,
    borderColor: modernTheme.colors.outline,
    minWidth: 80,
    alignItems: 'center',
  },
  statusButtonText: {
    ...modernTheme.typography.bodySmall,
    color: modernTheme.colors.onSurfaceVariant,
    fontWeight: '600',
  },
  pickerContainer: {
    backgroundColor: modernTheme.colors.surface,
    borderRadius: modernTheme.borderRadius.sm,
    borderWidth: 1,
    borderColor: modernTheme.colors.outline,
    paddingHorizontal: modernTheme.spacing.sm,
    paddingVertical: 4,
    ...modernTheme.shadows.sm,
  },
  picker: {
    height: 50,
    color: modernTheme.colors.onSurface,
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
});

export default LeadFormScreen;
