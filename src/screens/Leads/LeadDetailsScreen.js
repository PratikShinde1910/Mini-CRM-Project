import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { deleteLead } from '../../redux/leadsSlice';
import { modernTheme } from '../../styles/theme';

const LeadDetailsScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { lead, customer } = route.params;

  const handleEdit = () => {
    navigation.navigate('LeadForm', { 
      mode: 'edit', 
      lead,
      customerId: lead.customerId 
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Lead',
      'Are you sure you want to delete this lead? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteLead(lead.id));
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting lead:', error);
            }
          }
        }
      ]
    );
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const DetailCard = ({ title, children }) => (
    <View style={styles.detailCard}>
      <Text style={styles.detailCardTitle}>{title}</Text>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={modernTheme.colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lead Details</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerActionButton} onPress={handleEdit}>
              <Ionicons name="pencil-outline" size={24} color={modernTheme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerActionButton} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={24} color={modernTheme.colors.error} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Lead Title and Status */}
        <View style={styles.titleSection}>
          <Text style={styles.leadTitle}>{lead.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(lead.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(lead.status) }]}>
              {lead.status}
            </Text>
          </View>
        </View>

        {/* Customer Info */}
        {customer && (
          <DetailCard title="Customer">
            <View style={styles.customerInfo}>
              <View style={styles.customerAvatar}>
                <Text style={styles.customerAvatarText}>
                  {customer.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.customerDetails}>
                <Text style={styles.customerName}>{customer.name}</Text>
                <Text style={styles.customerEmail}>{customer.email}</Text>
                {customer.company && (
                  <Text style={styles.customerCompany}>{customer.company}</Text>
                )}
              </View>
            </View>
          </DetailCard>
        )}

        {/* Lead Value */}
        <DetailCard title="Lead Value">
          <Text style={styles.leadValue}>${lead.value?.toLocaleString() || '0'}</Text>
        </DetailCard>

        {/* Description */}
        <DetailCard title="Description">
          <Text style={styles.description}>
            {lead.description || 'No description provided'}
          </Text>
        </DetailCard>

        {/* Timestamps */}
        <DetailCard title="Timeline">
          <View style={styles.timelineItem}>
            <Ionicons name="calendar-outline" size={16} color={modernTheme.colors.onSurfaceVariant} />
            <Text style={styles.timelineText}>
              Created: {formatDate(lead.createdAt)}
            </Text>
          </View>
          {lead.updatedAt && lead.updatedAt !== lead.createdAt && (
            <View style={styles.timelineItem}>
              <Ionicons name="time-outline" size={16} color={modernTheme.colors.onSurfaceVariant} />
              <Text style={styles.timelineText}>
                Updated: {formatDate(lead.updatedAt)}
              </Text>
            </View>
          )}
        </DetailCard>
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
    marginLeft: -modernTheme.spacing.sm,
  },
  headerTitle: {
    ...modernTheme.typography.h3,
    color: modernTheme.colors.onSurface,
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerActionButton: {
    padding: modernTheme.spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  titleSection: {
    padding: modernTheme.spacing.md,
    alignItems: 'center',
  },
  leadTitle: {
    ...modernTheme.typography.h1,
    color: modernTheme.colors.onSurface,
    textAlign: 'center',
    marginBottom: modernTheme.spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: modernTheme.spacing.md,
    paddingVertical: modernTheme.spacing.xs,
    borderRadius: modernTheme.borderRadius.full,
  },
  statusText: {
    ...modernTheme.typography.bodySmall,
    fontWeight: '600',
  },
  detailCard: {
    backgroundColor: modernTheme.colors.surface,
    margin: modernTheme.spacing.md,
    marginTop: 0,
    borderRadius: modernTheme.borderRadius.md,
    padding: modernTheme.spacing.md,
    ...modernTheme.shadows.sm,
  },
  detailCardTitle: {
    ...modernTheme.typography.h3,
    color: modernTheme.colors.onSurface,
    marginBottom: modernTheme.spacing.sm,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: modernTheme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: modernTheme.spacing.md,
  },
  customerAvatarText: {
    color: modernTheme.colors.surface,
    fontSize: 18,
    fontWeight: '600',
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    ...modernTheme.typography.h3,
    color: modernTheme.colors.onSurface,
    marginBottom: modernTheme.spacing.xs / 2,
  },
  customerEmail: {
    ...modernTheme.typography.bodySmall,
    color: modernTheme.colors.onSurfaceVariant,
    marginBottom: modernTheme.spacing.xs / 2,
  },
  customerCompany: {
    ...modernTheme.typography.caption,
    color: modernTheme.colors.primary,
    fontWeight: '500',
  },
  leadValue: {
    ...modernTheme.typography.h1,
    color: modernTheme.colors.success,
    fontWeight: '700',
  },
  description: {
    ...modernTheme.typography.body,
    color: modernTheme.colors.onSurface,
    lineHeight: 24,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: modernTheme.spacing.xs,
  },
  timelineText: {
    ...modernTheme.typography.bodySmall,
    color: modernTheme.colors.onSurfaceVariant,
    marginLeft: modernTheme.spacing.sm,
  },
});

export default LeadDetailsScreen;