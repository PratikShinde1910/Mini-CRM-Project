import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../redux/authSlice';
import { modernTheme } from '../../styles/theme';

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => dispatch(logoutUser())
        }
      ]
    );
  };

  const ProfileOption = ({ icon, title, subtitle, onPress, showChevron = true, isDestructive = false }) => (
    <TouchableOpacity style={styles.optionCard} onPress={onPress}>
      <View style={styles.optionContent}>
        <View style={[styles.iconContainer, isDestructive && styles.destructiveIcon]}>
          <Ionicons 
            name={icon} 
            size={24} 
            color={isDestructive ? modernTheme.colors.error : modernTheme.colors.primary} 
          />
        </View>
        <View style={styles.optionText}>
          <Text style={[styles.optionTitle, isDestructive && styles.destructiveText]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.optionSubtitle}>{subtitle}</Text>
          )}
        </View>
        {showChevron && (
          <Ionicons 
            name="chevron-forward-outline" 
            size={20} 
            color={modernTheme.colors.onSurfaceVariant} 
          />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

     
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase() || 'M'}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name || 'Maria'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'maria@example.com'}</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="pencil-outline" size={20} color={modernTheme.colors.primary} />
        </TouchableOpacity>
      </View>

      
      <View style={styles.optionsContainer}>
        <ProfileOption
          icon="person-outline"
          title="Account Settings"
          subtitle="Update your personal information"
          onPress={() => {/* Navigate to account settings */}}
        />
        
        <ProfileOption
          icon="notifications-outline"
          title="Notifications"
          subtitle="Manage your notification preferences"
          onPress={() => {/* Navigate to notifications settings */}}
        />
        
        <ProfileOption
          icon="shield-checkmark-outline"
          title="Privacy & Security"
          subtitle="Control your privacy settings"
          onPress={() => {/* Navigate to privacy settings */}}
        />
        
        <ProfileOption
          icon="help-circle-outline"
          title="Help & Support"
          subtitle="Get help or contact support"
          onPress={() => {/* Navigate to help */}}
        />
        
        <ProfileOption
          icon="information-circle-outline"
          title="About"
          subtitle="App version and information"
          onPress={() => {/* Navigate to about */}}
        />
        
        <ProfileOption
          icon="log-out-outline"
          title="Logout"
          subtitle="Sign out of your account"
          onPress={handleLogout}
          showChevron={false}
          isDestructive={true}
        />
      </View>

     
      <View style={styles.footer}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
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
  headerTitle: {
    ...modernTheme.typography.h2,
    color: modernTheme.colors.onSurface,
    textAlign: 'center',
  },
  userCard: {
    backgroundColor: modernTheme.colors.surface,
    margin: modernTheme.spacing.md,
    borderRadius: modernTheme.borderRadius.md,
    padding: modernTheme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...modernTheme.shadows.sm,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: modernTheme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: modernTheme.spacing.md,
  },
  avatarText: {
    color: modernTheme.colors.surface,
    fontSize: 24,
    fontWeight: '600',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...modernTheme.typography.h3,
    color: modernTheme.colors.onSurface,
    marginBottom: modernTheme.spacing.xs / 2,
  },
  userEmail: {
    ...modernTheme.typography.bodySmall,
    color: modernTheme.colors.onSurfaceVariant,
  },
  editButton: {
    padding: modernTheme.spacing.sm,
    backgroundColor: modernTheme.colors.surfaceVariant,
    borderRadius: modernTheme.borderRadius.sm,
  },
  optionsContainer: {
    paddingHorizontal: modernTheme.spacing.md,
  },
  optionCard: {
    backgroundColor: modernTheme.colors.surface,
    borderRadius: modernTheme.borderRadius.md,
    marginBottom: modernTheme.spacing.sm,
    ...modernTheme.shadows.sm,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: modernTheme.spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: modernTheme.colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: modernTheme.spacing.md,
  },
  destructiveIcon: {
    backgroundColor: modernTheme.colors.error + '20',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    ...modernTheme.typography.h3,
    color: modernTheme.colors.onSurface,
    marginBottom: modernTheme.spacing.xs / 2,
  },
  destructiveText: {
    color: modernTheme.colors.error,
  },
  optionSubtitle: {
    ...modernTheme.typography.bodySmall,
    color: modernTheme.colors.onSurfaceVariant,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: modernTheme.spacing.lg,
  },
  versionText: {
    ...modernTheme.typography.caption,
    color: modernTheme.colors.onSurfaceVariant,
  },
});

export default ProfileScreen;