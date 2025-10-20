import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, SafeAreaView, StyleSheet, Alert } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { fetchLeadsByCustomer, deleteLead } from '../../redux/leadsSlice';
import { modernTheme } from '../../styles/theme';

const STATUSES = ['All', 'New', 'Contacted', 'Converted', 'Lost'];

const CustomerDetailsScreen = ({ route, navigation }) => {
  const { customer } = route.params;
  const dispatch = useDispatch();
  const [statusFilter, setStatusFilter] = useState('All');
  const leads = useSelector((s) => s.leads.byCustomer[customer.id] || []);
  const loading = useSelector((s) => s.leads.loading);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchLeadsByCustomer({ customerId: customer.id }));
    }, [dispatch, customer.id])
  );

  const filteredLeads = statusFilter === 'All' ? leads : leads.filter((l) => l.status === statusFilter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return modernTheme.colors.primary;
      case 'Contacted': return modernTheme.colors.secondary;
      case 'Converted': return modernTheme.colors.success;
      case 'Lost': return modernTheme.colors.error;
      default: return modernTheme.colors.onSurfaceVariant;
    }
  };

  const handleDeleteLead = (leadId, leadTitle) => {
    Alert.alert(
      'Delete Lead',
      `Are you sure you want to delete "${leadTitle}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => dispatch(deleteLead(leadId))
        }
      ]
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const DetailCard = ({ title, children }) => (
    <View style={styles.detailCard}>
      <Text style={styles.detailCardTitle}>{title}</Text>
      {children}
    </View>
  );

  const FilterChip = ({ status, isActive, onPress }) => (
    <TouchableOpacity 
      style={[styles.filterChip, isActive && styles.filterChipActive]} 
      onPress={onPress}
    >
      <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
        {status}
      </Text>
    </TouchableOpacity>
  );

  const LeadCard = ({ lead }) => (
    <TouchableOpacity 
      style={styles.leadCard}
      onPress={() => navigation.navigate('LeadDetails', { lead, customer })}
    >
      <View style={styles.leadCardContent}>
        <View style={styles.leadHeader}>
          <View style={styles.leadInfo}>
            <Text style={styles.leadTitle}>{lead.title}</Text>
            <Text style={styles.leadDate}>{formatDate(lead.createdAt)}</Text>
            {lead.description && (
              <Text style={styles.leadDescription} numberOfLines={2}>
                {lead.description}
              </Text>
            )}
          </View>
          <View style={styles.leadMeta}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(lead.status) + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(lead.status) }]}>
                {lead.status}
              </Text>
            </View>
            <Text style={styles.leadValue}>${lead.value?.toLocaleString() || '0'}</Text>
          </View>
        </View>
        <View style={styles.leadActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('LeadForm', { mode: 'edit', lead, customerId: customer.id })}
          >
            <Ionicons name="pencil-outline" size={16} color={modernTheme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteLead(lead.id, lead.title)}
          >
            <Ionicons name="trash-outline" size={16} color={modernTheme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={modernTheme.colors.onSurface} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.customerName}>{customer.name}</Text>
            {customer.company && (
              <Text style={styles.customerCompany}>{customer.company}</Text>
            )}
          </View>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => navigation.navigate('CustomerForm', { mode: 'edit', customer })}
          >
            <Ionicons name="pencil-outline" size={24} color={modernTheme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        <DetailCard title="Contact Information">
          <View style={styles.contactItem}>
            <Ionicons name="mail-outline" size={20} color={modernTheme.colors.primary} />
            <Text style={styles.contactText}>{customer.email}</Text>
          </View>
          {customer.phone && (
            <View style={styles.contactItem}>
              <Ionicons name="call-outline" size={20} color={modernTheme.colors.primary} />
              <Text style={styles.contactText}>{customer.phone}</Text>
            </View>
          )}
        </DetailCard>

       
        <DetailCard title="Leads">
          
        
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filtersContainer}
            contentContainerStyle={styles.filtersContent}
          >
            {STATUSES.map((status) => (
              <FilterChip
                key={status}
                status={status}
                isActive={statusFilter === status}
                onPress={() => setStatusFilter(status)}
              />
            ))}
          </ScrollView>

          
          {loading && leads.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={modernTheme.colors.primary} />
              <Text style={styles.loadingText}>Loading leads...</Text>
            </View>
          ) : filteredLeads.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-outline" size={48} color={modernTheme.colors.onSurfaceVariant} />
              <Text style={styles.emptyText}>
                {statusFilter === 'All' ? 'No leads yet' : `No ${statusFilter.toLowerCase()} leads`}
              </Text>
              <TouchableOpacity 
                style={styles.addFirstLeadButton}
                onPress={() => navigation.navigate('LeadForm', { mode: 'add', customerId: customer.id })}
              >
                <Text style={styles.addFirstLeadButtonText}>Add First Lead</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredLeads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))
          )}
        </DetailCard>
      </ScrollView>

     
      {filteredLeads.length > 0 && (
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('LeadForm', { mode: 'add', customerId: customer.id })}
        >
          <Ionicons name="add" size={24} color={modernTheme.colors.surface} />
        </TouchableOpacity>
      )}
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: modernTheme.spacing.sm,
    marginLeft: -modernTheme.spacing.sm,
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  customerName: {
    ...modernTheme.typography.h2,
    color: modernTheme.colors.onSurface,
    textAlign: 'center',
  },
  customerCompany: {
    ...modernTheme.typography.bodySmall,
    color: modernTheme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
  editButton: {
    padding: modernTheme.spacing.sm,
  },
  scrollView: {
    flex: 1,
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
    marginBottom: modernTheme.spacing.md,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: modernTheme.spacing.sm,
  },
  contactText: {
    ...modernTheme.typography.body,
    color: modernTheme.colors.onSurface,
    marginLeft: modernTheme.spacing.sm,
  },
  filtersContainer: {
    marginBottom: modernTheme.spacing.md,
  },
  filtersContent: {
    gap: modernTheme.spacing.sm,
  },
  filterChip: {
    paddingHorizontal: modernTheme.spacing.md,
    paddingVertical: modernTheme.spacing.sm,
    borderRadius: modernTheme.borderRadius.full,
    backgroundColor: modernTheme.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: modernTheme.colors.outline,
  },
  filterChipActive: {
    backgroundColor: modernTheme.colors.primary,
    borderColor: modernTheme.colors.primary,
  },
  filterChipText: {
    ...modernTheme.typography.bodySmall,
    color: modernTheme.colors.onSurfaceVariant,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: modernTheme.colors.surface,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: modernTheme.spacing.xl,
  },
  loadingText: {
    ...modernTheme.typography.bodySmall,
    color: modernTheme.colors.onSurfaceVariant,
    marginTop: modernTheme.spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: modernTheme.spacing.xl,
  },
  emptyText: {
    ...modernTheme.typography.body,
    color: modernTheme.colors.onSurfaceVariant,
    marginTop: modernTheme.spacing.sm,
    marginBottom: modernTheme.spacing.md,
  },
  addFirstLeadButton: {
    backgroundColor: modernTheme.colors.primary,
    paddingHorizontal: modernTheme.spacing.md,
    paddingVertical: modernTheme.spacing.sm,
    borderRadius: modernTheme.borderRadius.sm,
  },
  addFirstLeadButtonText: {
    ...modernTheme.typography.button,
    color: modernTheme.colors.surface,
  },
  leadCard: {
    backgroundColor: modernTheme.colors.surfaceVariant,
    borderRadius: modernTheme.borderRadius.sm,
    padding: modernTheme.spacing.sm,
    marginBottom: modernTheme.spacing.sm,
  },
  leadCardContent: {
    gap: modernTheme.spacing.sm,
  },
  leadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leadInfo: {
    flex: 1,
    marginRight: modernTheme.spacing.md,
  },
  leadTitle: {
    ...modernTheme.typography.h3,
    color: modernTheme.colors.onSurface,
    marginBottom: modernTheme.spacing.xs / 2,
  },
  leadDate: {
    ...modernTheme.typography.caption,
    color: modernTheme.colors.onSurfaceVariant,
    marginBottom: modernTheme.spacing.xs,
  },
  leadDescription: {
    ...modernTheme.typography.bodySmall,
    color: modernTheme.colors.onSurfaceVariant,
    lineHeight: 18,
  },
  leadMeta: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: modernTheme.spacing.sm,
    paddingVertical: modernTheme.spacing.xs / 2,
    borderRadius: modernTheme.borderRadius.sm,
    marginBottom: modernTheme.spacing.xs,
  },
  statusText: {
    ...modernTheme.typography.caption,
    fontWeight: '600',
  },
  leadValue: {
    ...modernTheme.typography.h3,
    color: modernTheme.colors.onSurface,
    fontWeight: '700',
  },
  leadActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: modernTheme.spacing.xs,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: modernTheme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: modernTheme.colors.error + '20',
  },
  addButton: {
    position: 'absolute',
    right: modernTheme.spacing.md,
    bottom: modernTheme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: modernTheme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...modernTheme.shadows.lg,
  },
});

export default CustomerDetailsScreen;
