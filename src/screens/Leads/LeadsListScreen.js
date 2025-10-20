import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, RefreshControl, Text, TouchableOpacity, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { TextInput, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { fetchLeads, setSearch, setStatusFilter, resetLeads } from '../../redux/leadsSlice';
import { modernTheme } from '../../styles/theme';

const statusOptions = ['All', 'New', 'Contacted', 'Converted', 'Lost'];

const LeadsListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items: leads, loading, search, statusFilter, page, limit, total } = useSelector(state => state.leads);
  const customers = useSelector(state => state.customers);
  const [showFilters, setShowFilters] = useState(false);

  useFocusEffect(
    useCallback(() => {

      dispatch(resetLeads());
      dispatch(fetchLeads({ page: 1, limit, search, status: statusFilter }));
    }, [dispatch, limit, search, statusFilter])
  );

  const onRefresh = () => {
    dispatch(resetLeads());
    dispatch(fetchLeads({ page: 1, limit, search, status: statusFilter }));
  };

  const loadMore = () => {
    if (!loading && leads.length < total) {
      dispatch(fetchLeads({ page: page + 1, limit, search, status: statusFilter }));
    }
  };

  const onSearchChange = (text) => {
    dispatch(setSearch(text));
  };

  const onStatusFilterChange = (status) => {
    const filterValue = status === 'All' ? '' : status;
    dispatch(setStatusFilter(filterValue));
    setShowFilters(false);
  };

  const getCustomerName = (customerId) => {
    const customer = customers?.items?.find(c => c.id === customerId);
    return customer?.name || 'Unknown Customer';
  };

  const getCustomer = (customerId) => {
    return customers?.items?.find(c => c.id === customerId);
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

  const renderItem = ({ item }) => {
    const customer = getCustomer(item.customerId);
    return (
      <TouchableOpacity 
        style={styles.leadCard}
        onPress={() => navigation.navigate('LeadDetails', { 
          lead: item, 
          customer 
        })}
      >
        <View style={styles.leadCardContent}>
          <View style={styles.leadHeader}>
            <View style={styles.leadInfo}>
              <Text style={styles.leadTitle}>{item.title}</Text>
              <Text style={styles.leadCustomer}>{getCustomerName(item.customerId)}</Text>
              <Text style={styles.leadDescription} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
            <View style={styles.leadMeta}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                  {item.status}
                </Text>
              </View>
              <Text style={styles.leadValue}>${item.value?.toLocaleString() || '0'}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilterButton = (status) => {
    const isActive = (status === 'All' && !statusFilter) || statusFilter === status;
    return (
      <TouchableOpacity
        key={status}
        style={[styles.filterButton, isActive && styles.filterButtonActive]}
        onPress={() => onStatusFilterChange(status)}
      >
        <Text style={[styles.filterButtonText, isActive && styles.filterButtonTextActive]}>
          {status}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Leads</Text>
          <TouchableOpacity 
            style={styles.headerFilterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons name="funnel-outline" size={24} color={modernTheme.colors.onSurface} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color={modernTheme.colors.onSurfaceVariant} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search leads..."
            value={search}
            onChangeText={onSearchChange}
            placeholderTextColor={modernTheme.colors.onSurfaceVariant}
          />
        </View>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContent}
          >
            {statusOptions.map(renderFilterButton)}
          </ScrollView>
        </View>
      )}

      {loading && leads.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={modernTheme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={leads}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl 
              refreshing={loading && leads.length > 0} 
              onRefresh={onRefresh}
              colors={[modernTheme.colors.primary]}
            />
          }
          ListFooterComponent={
            loading && leads.length > 0 ? (
              <View style={styles.footerLoading}>
                <ActivityIndicator color={modernTheme.colors.primary} />
              </View>
            ) : null
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('LeadForm', { mode: 'add' })}
      >
        <Ionicons name="add" size={24} color={modernTheme.colors.surface} />
      </TouchableOpacity>
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
  headerTitle: {
    ...modernTheme.typography.h2,
    color: modernTheme.colors.onSurface,
  },
  headerFilterButton: {
    padding: modernTheme.spacing.sm,
  },
  filtersContainer: {
    backgroundColor: modernTheme.colors.surface,
    paddingVertical: modernTheme.spacing.sm,
    ...modernTheme.shadows.sm,
  },
  filtersContent: {
    paddingHorizontal: modernTheme.spacing.md,
    gap: modernTheme.spacing.sm,
  },
  filterButton: {
    paddingHorizontal: modernTheme.spacing.md,
    paddingVertical: modernTheme.spacing.sm,
    borderRadius: modernTheme.borderRadius.full,
    backgroundColor: modernTheme.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: modernTheme.colors.outline,
  },
  filterButtonActive: {
    backgroundColor: modernTheme.colors.primary,
    borderColor: modernTheme.colors.primary,
  },
  filterButtonText: {
    ...modernTheme.typography.bodySmall,
    color: modernTheme.colors.onSurfaceVariant,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: modernTheme.colors.surface,
  },
  footerLoading: {
    paddingVertical: modernTheme.spacing.md,
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: modernTheme.spacing.md,
    paddingVertical: modernTheme.spacing.sm,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: modernTheme.colors.surface,
    borderRadius: modernTheme.borderRadius.md,
    paddingHorizontal: modernTheme.spacing.md,
    ...modernTheme.shadows.sm,
  },
  searchIcon: {
    marginRight: modernTheme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: modernTheme.spacing.md,
    ...modernTheme.typography.body,
    color: modernTheme.colors.onSurface,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: modernTheme.spacing.md,
    paddingBottom: 100,
  },
  leadCard: {
    backgroundColor: modernTheme.colors.surface,
    borderRadius: modernTheme.borderRadius.md,
    marginBottom: modernTheme.spacing.sm,
    ...modernTheme.shadows.sm,
  },
  leadCardContent: {
    padding: modernTheme.spacing.md,
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
  leadCustomer: {
    ...modernTheme.typography.bodySmall,
    color: modernTheme.colors.primary,
    fontWeight: '500',
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

export default LeadsListScreen;