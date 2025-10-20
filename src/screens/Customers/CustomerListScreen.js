import React, { useState, useCallback } from 'react';
import { View, FlatList, RefreshControl, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { TextInput, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers, setSearch, resetCustomers, deleteCustomer } from '../../redux/customersSlice';
import { logoutUser } from '../../redux/authSlice';
import { useFocusEffect } from '@react-navigation/native';
import { modernTheme } from '../../styles/theme';

const CustomerListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items, page, limit, total, search, loading } = useSelector((s) => s.customers);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (items.length === 0) {
        dispatch(fetchCustomers({ page: 1, limit, search }));
      }
    }, [dispatch, limit, search, items.length])
  );

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      dispatch(resetCustomers());
      await dispatch(fetchCustomers({ page: 1, limit, search }));
    } finally {
      setRefreshing(false);
    }
  };

  const loadMore = () => {
    if (!loading && items.length < total) {
      dispatch(fetchCustomers({ page: page + 1, limit, search }));
    }
  };

  const onSearchChange = (text) => {
    dispatch(setSearch(text));
    dispatch(fetchCustomers({ page: 1, limit, search: text }));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.customerCard}
      onPress={() => navigation.navigate('CustomerDetails', { customer: item })}
    >
      <View style={styles.customerCardContent}>
        <View style={styles.customerAvatar}>
          <Text style={styles.customerAvatarText}>{item.name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{item.name}</Text>
          <Text style={styles.customerDetails}>{item.email}</Text>
          {item.company && <Text style={styles.customerCompany}>{item.company}</Text>}
        </View>
        <View style={styles.customerActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('CustomerForm', { mode: 'edit', customer: item })}
          >
            <Ionicons name="pencil-outline" size={18} color={modernTheme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => dispatch(deleteCustomer(item.id))}
          >
            <Ionicons name="trash-outline" size={18} color={modernTheme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Customers</Text>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={() => dispatch(logoutUser())}
          >
            <Ionicons name="log-out-outline" size={24} color={modernTheme.colors.onSurface} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color={modernTheme.colors.onSurfaceVariant} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or email"
            value={search}
            onChangeText={onSearchChange}
            placeholderTextColor={modernTheme.colors.onSurfaceVariant}
          />
        </View>
      </View>

      {loading && items.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={modernTheme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          ItemSeparatorComponent={() => <View style={{ height: modernTheme.spacing.sm }} />}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[modernTheme.colors.primary]}
            />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={!loading ? (
            <View style={{ alignItems: 'center', marginTop: 48 }}>
              <Text style={{ color: modernTheme.colors.onSurfaceVariant }}>No customers found</Text>
            </View>
          ) : null}
        />
      )}

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('CustomerForm', { mode: 'add' })}
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
  logoutButton: {
    padding: modernTheme.spacing.sm,
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
  customerCard: {
    backgroundColor: modernTheme.colors.surface,
    borderRadius: modernTheme.borderRadius.md,
    marginBottom: modernTheme.spacing.sm,
    ...modernTheme.shadows.sm,
  },
  customerCardContent: {
    flexDirection: 'row',
    padding: modernTheme.spacing.md,
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
  customerInfo: {
    flex: 1,
  },
  customerName: {
    ...modernTheme.typography.h3,
    color: modernTheme.colors.onSurface,
    marginBottom: modernTheme.spacing.xs / 2,
  },
  customerDetails: {
    ...modernTheme.typography.bodySmall,
    color: modernTheme.colors.onSurfaceVariant,
    marginBottom: modernTheme.spacing.xs / 2,
  },
  customerCompany: {
    ...modernTheme.typography.caption,
    color: modernTheme.colors.primary,
    fontWeight: '500',
  },
  customerActions: {
    flexDirection: 'row',
    gap: modernTheme.spacing.xs,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: modernTheme.colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: modernTheme.colors.error + '20',
  },
  footerLoading: {
    paddingVertical: modernTheme.spacing.md,
    alignItems: 'center',
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

export default CustomerListScreen;
