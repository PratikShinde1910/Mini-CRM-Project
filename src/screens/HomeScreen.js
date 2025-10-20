import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  Text, 
  Card, 
  Title, 
  Paragraph,
  Button,
  Avatar,
  Divider,
  List,
  FAB,
  Appbar
} from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { logoutUser } from '../redux/authSlice';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const quickStats = [
    { title: 'Total Contacts', value: '124', icon: 'people-outline', color: '#6366f1' },
    { title: 'Active Leads', value: '23', icon: 'trending-up-outline', color: '#10b981' },
    { title: 'Deals Closed', value: '8', icon: 'checkmark-circle-outline', color: '#f59e0b' },
    { title: 'Revenue', value: '$12,540', icon: 'cash-outline', color: '#ef4444' },
  ];

  const recentActivities = [
    { title: 'New lead from website', subtitle: '2 hours ago', icon: 'person-add-outline' },
    { title: 'Meeting with John Doe', subtitle: '4 hours ago', icon: 'calendar-outline' },
    { title: 'Deal closed - $2,500', subtitle: '1 day ago', icon: 'checkmark-circle-outline' },
    { title: 'Email campaign sent', subtitle: '2 days ago', icon: 'mail-outline' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Dashboard" />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        <Card style={styles.welcomeCard}>
          <Card.Content style={styles.welcomeContent}>
            <View style={styles.welcomeHeader}>
              <Avatar.Text 
                size={60} 
                label={user?.name ? user.name.charAt(0).toUpperCase() : 'U'} 
                style={styles.avatar}
              />
              <View style={styles.welcomeText}>
                <Title style={styles.welcomeTitle}>
                  Welcome back, {user?.name || 'User'}!
                </Title>
                <Paragraph style={styles.welcomeSubtitle}>
                  Here&apos;s what&apos;s happening with your business today
                </Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>

       
        <View style={styles.section}>
          <Title style={styles.sectionTitle}>Quick Overview</Title>
          <View style={styles.statsGrid}>
            {quickStats.map((stat, index) => (
              <Card key={index} style={styles.statCard}>
                <Card.Content style={styles.statContent}>
                  <View style={styles.statHeader}>
                    <Ionicons 
                      name={stat.icon} 
                      size={24} 
                      color={stat.color} 
                    />
                    <Text style={[styles.statValue, { color: stat.color }]}>
                      {stat.value}
                    </Text>
                  </View>
                  <Text style={styles.statTitle}>{stat.title}</Text>
                </Card.Content>
              </Card>
            ))}
          </View>
        </View>

        
        <View style={styles.section}>
          <Title style={styles.sectionTitle}>Quick Actions</Title>
          <View style={styles.actionsRow}>
            <Button 
              mode="contained" 
              icon="person-add-outline"
              style={styles.actionButton}
              onPress={() => console.log('Add Contact')}
            >
              Add Contact
            </Button>
            <Button 
              mode="outlined" 
              icon="trending-up-outline"
              style={styles.actionButton}
              onPress={() => console.log('New Lead')}
            >
              New Lead
            </Button>
          </View>
          <View style={styles.actionsRow}>
            <Button 
              mode="outlined" 
              icon="calendar-outline"
              style={styles.actionButton}
              onPress={() => console.log('Schedule Meeting')}
            >
              Schedule Meeting
            </Button>
            <Button 
              mode="outlined" 
              icon="analytics-outline"
              style={styles.actionButton}
              onPress={() => console.log('View Reports')}
            >
              View Reports
            </Button>
          </View>
        </View>

        
        <View style={styles.section}>
          <Title style={styles.sectionTitle}>Recent Activities</Title>
          <Card style={styles.activitiesCard}>
            <Card.Content>
              {recentActivities.map((activity, index) => (
                <View key={index}>
                  <List.Item
                    title={activity.title}
                    description={activity.subtitle}
                    left={() => (
                      <List.Icon 
                        icon={() => (
                          <Ionicons 
                            name={activity.icon} 
                            size={24} 
                            color="#6366f1" 
                          />
                        )} 
                      />
                    )}
                  />
                  {index < recentActivities.length - 1 && (
                    <Divider style={styles.divider} />
                  )}
                </View>
              ))}
            </Card.Content>
          </Card>
        </View>

       
        <View style={styles.bottomSpacing} />
      </ScrollView>

      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => console.log('FAB pressed')}
        label="Add"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  welcomeCard: {
    margin: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  welcomeContent: {
    paddingVertical: 20,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#6366f1',
    marginRight: 16,
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 22,
  },
  section: {
    margin: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    marginBottom: 12,
    elevation: 2,
  },
  statContent: {
    paddingVertical: 16,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statTitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  activitiesCard: {
    elevation: 2,
  },
  divider: {
    marginVertical: 8,
  },
  bottomSpacing: {
    height: 80,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6366f1',
  },
});

export default HomeScreen;