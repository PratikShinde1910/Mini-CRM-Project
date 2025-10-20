import React, { useEffect, useState, useRef } from 'react';
import { View, Dimensions, StyleSheet, ScrollView, SafeAreaView, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/api';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { modernTheme, createCardStyle } from '../styles/theme';

const screenWidth = Dimensions.get('window').width - 32; 

const DashboardScreen = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ byStatus: {}, totalValue: 0 });
  const pieAnim = useRef(new Animated.Value(0)).current;

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/dashboard/leads-stats');
      setStats(res.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    
    if (loading) return;
    pieAnim.setValue(0);
    Animated.timing(pieAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [loading, stats]);

  const statusColors = {
    New: modernTheme.colors.primary,
    Contacted: modernTheme.colors.success,
    Converted: modernTheme.colors.secondary,
    Lost: modernTheme.colors.error,
  };

  const applications = [
    {
      id: 'app-1',
      tag: 'UI/UX Design',
      title: 'Brooklyn Simmons',
      subtitle: '“I am a novice designer looking for a mentor…”',
      tagBg: '#E9E7FF',
    },
    {
      id: 'app-2',
      tag: 'JS Dev',
      title: 'Wade Warren',
      subtitle: '“Hello! I wanted to improve my skills…”',
      tagBg: '#FFF7D6',
    },
  ];

  const pieData = Object.entries(stats.byStatus).map(([status, count]) => ({
    name: status,
    count: Number(count),
    color: statusColors[status] || modernTheme.colors.primary,
    legendFontColor: modernTheme.colors.onSurface,
    legendFontSize: 12,
  }));

  const barLabels = Object.keys(stats.byStatus);
  const barCounts = Object.values(stats.byStatus).map((n) => Number(n));

  const StatCard = ({ title, value, subtitle, icon, color }) => (
    <View style={[styles.statCard, { backgroundColor: color }]}>
      <View style={styles.statCardContent}>
        <View style={styles.statCardHeader}>
          <Text style={styles.statCardTitle}>{title}</Text>
          <View style={styles.statCardIconContainer}>
            <Ionicons name={icon} size={20} color={modernTheme.colors.surface} />
          </View>
        </View>
        <Text style={styles.statCardValue}>{value}</Text>
        <Text style={styles.statCardSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );

  const totalLeads = Object.values(stats.byStatus).reduce((sum, count) => sum + Number(count), 0);
  const activeLeads = (stats.byStatus?.New || 0) + (stats.byStatus?.Contacted || 0);

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>M</Text>
            </View>
            <View>
              <Text style={styles.greeting}>Hello,</Text>
              <Text style={styles.userName}>Maria!</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="search-outline" size={24} color={modernTheme.colors.onSurface} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="notifications-outline" size={24} color={modernTheme.colors.onSurface} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Leads overview</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllButton}>See all</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.statsGrid}>
            <StatCard
              title="Total leads"
              value={totalLeads.toString()}
              subtitle="4% more than yesterday"
              icon="trending-up-outline"
              color={modernTheme.colors.primary}
            />
            <StatCard
              title="Active leads"
              value={activeLeads.toString()}
              subtitle="On average 4 hours online"
              icon="pulse-outline"
              color={modernTheme.colors.secondary}
            />
          </View>
        </View>

        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Applications</Text>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionCaption}>New</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.appsRow}
          >
            {applications.map((app) => (
              <View key={app.id} style={styles.appCard}>
                <View style={[styles.appTag, { backgroundColor: app.tagBg }]}>
                  <Text style={styles.appTagText}>{app.tag}</Text>
                </View>
                <Text style={styles.appTitle}>{app.title}</Text>
                <Text style={styles.appSubtitle}>{app.subtitle}</Text>
              </View>
            ))}
          </ScrollView>

         
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Leads by Status</Text>
            {loading ? (
              <ActivityIndicator style={{ marginTop: 16 }} color={modernTheme.colors.primary} />
            ) : pieData.length === 0 ? (
              <Text style={styles.noDataText}>No data yet</Text>
            ) : (
              <Animated.View style={{
                opacity: pieAnim,
                transform: [{
                  scale: pieAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] })
                }]
              }}>
                <PieChart
                  data={pieData.map((d) => ({
                    name: d.name,
                    population: d.count,
                    color: d.color,
                    legendFontColor: d.legendFontColor,
                    legendFontSize: d.legendFontSize,
                  }))}
                  width={screenWidth - 64}
                  height={200}
                  chartConfig={{
                    color: () => modernTheme.colors.primary,
                    labelColor: () => modernTheme.colors.onSurface,
                    backgroundGradientFrom: modernTheme.colors.surface,
                    backgroundGradientTo: modernTheme.colors.surface,
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  hasLegend
                />
              </Animated.View>
            )}
          </View>

        </View>
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: modernTheme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: modernTheme.spacing.sm,
  },
  avatarText: {
    color: modernTheme.colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  greeting: {
    ...modernTheme.typography.bodySmall,
    color: modernTheme.colors.onSurfaceVariant,
  },
  userName: {
    ...modernTheme.typography.h3,
    color: modernTheme.colors.onSurface,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: modernTheme.spacing.sm,
    marginLeft: modernTheme.spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: modernTheme.spacing.md,
    paddingTop: modernTheme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: modernTheme.spacing.md,
  },
  sectionTitle: {
    ...modernTheme.typography.h3,
    color: modernTheme.colors.onSurface,
  },
  seeAllButton: {
    ...modernTheme.typography.bodySmall,
    color: modernTheme.colors.primary,
    fontWeight: '600',
  },
  sectionCaption: {
    ...modernTheme.typography.caption,
    color: modernTheme.colors.onSurfaceVariant,
    marginBottom: modernTheme.spacing.sm,
  },
  appsRow: {
    gap: modernTheme.spacing.sm,
    paddingBottom: modernTheme.spacing.md,
  },
  appCard: {
    width: 260,
    backgroundColor: modernTheme.colors.surface,
    borderRadius: modernTheme.borderRadius.md,
    padding: modernTheme.spacing.md,
    marginRight: modernTheme.spacing.sm,
    ...modernTheme.shadows.sm,
  },
  appTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: modernTheme.spacing.sm,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: modernTheme.spacing.sm,
  },
  appTagText: {
    ...modernTheme.typography.caption,
    color: modernTheme.colors.onSurface,
    fontWeight: '600',
  },
  appTitle: {
    ...modernTheme.typography.h3,
    color: modernTheme.colors.onSurface,
    marginBottom: modernTheme.spacing.xs,
  },
  appSubtitle: {
    ...modernTheme.typography.bodySmall,
    color: modernTheme.colors.onSurfaceVariant,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: modernTheme.spacing.sm,
  },
  statCard: {
    flex: 1,
    borderRadius: modernTheme.borderRadius.md,
    ...modernTheme.shadows.sm,
  },
  statCardContent: {
    padding: modernTheme.spacing.md,
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: modernTheme.spacing.sm,
  },
  statCardTitle: {
    ...modernTheme.typography.bodySmall,
    color: modernTheme.colors.surface,
    opacity: 0.8,
    flex: 1,
  },
  statCardIconContainer: {
    width: 32,
    height: 32,
    borderRadius: modernTheme.borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statCardValue: {
    ...modernTheme.typography.h1,
    color: modernTheme.colors.surface,
    marginBottom: modernTheme.spacing.xs,
  },
  statCardSubtitle: {
    ...modernTheme.typography.caption,
    color: modernTheme.colors.surface,
    opacity: 0.7,
  },
  addButton: {
    backgroundColor: modernTheme.colors.primary,
    paddingHorizontal: modernTheme.spacing.md,
    paddingVertical: modernTheme.spacing.xs,
    borderRadius: modernTheme.borderRadius.sm,
  },
  addButtonText: {
    ...modernTheme.typography.button,
    color: modernTheme.colors.surface,
    fontSize: 14,
  },
  chartCard: {
    backgroundColor: modernTheme.colors.surface,
    borderRadius: modernTheme.borderRadius.md,
    padding: modernTheme.spacing.md,
    marginBottom: modernTheme.spacing.md,
    ...modernTheme.shadows.sm,
  },
  chartTitle: {
    ...modernTheme.typography.h3,
    color: modernTheme.colors.onSurface,
    marginBottom: modernTheme.spacing.sm,
  },
  noDataText: {
    ...modernTheme.typography.body,
    color: modernTheme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: modernTheme.spacing.md,
  },
});

export default DashboardScreen;
