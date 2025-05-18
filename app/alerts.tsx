import { Ionicons } from '@expo/vector-icons'; // For icons
import { useRouter } from 'expo-router'; // For navigation
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'; // Import from safe-area-context

// --- Data Structures ---
type AlertCategory = 'MAINTENANCE' | 'CROWD' | 'DELAY' | 'INFO';

interface AlertItem {
  id: string;
  category: AlertCategory;
  title: string;
  station: string; // Or multiple stations if applicable
  timestamp: string; // e.g., "10:34 AM", "Just Now"
  line: 'LRT1' | 'LRT2' | 'MRT3';
}

interface LineAlerts {
  lineName: string;
  alerts: AlertItem[];
}

// --- Mock Data (Replace with actual data source) ---
const mockAlertsData: LineAlerts[] = [
  {
    lineName: 'LRT 1',
    alerts: [
      { id: 'l1a1', category: 'MAINTENANCE', title: 'Under Maintenance', station: 'Antipolo Station', timestamp: '10:34 AM', line: 'LRT1' },
      { id: 'l1a2', category: 'CROWD', title: 'High Crowd Density', station: 'Araneta Center - Cubao Station', timestamp: '10:34 AM', line: 'LRT1' },
    ],
  },
  {
    lineName: 'LRT 2',
    alerts: [
      { id: 'l2a1', category: 'DELAY', title: 'Train Delayed', station: 'Recto Station', timestamp: 'Just Now', line: 'LRT2' },
    ],
  },
  {
    lineName: 'MRT 3',
    alerts: [
      { id: 'l3a1', category: 'DELAY', title: 'Train Delayed', station: 'Shaw Boulevard Station', timestamp: '8:01 AM', line: 'MRT3' },
    ],
  },
];
// ----------------------------------------------------

// --- Helper to get icon and color based on category ---
const getAlertIconAndColor = (category: AlertCategory) => {
  switch (category) {
    case 'MAINTENANCE':
      return { icon: 'warning-outline', color: '#FF4500' }; // OrangeRed
    case 'CROWD':
      return { icon: 'people-outline', color: '#DC143C' }; // Crimson
    case 'DELAY':
      return { icon: 'time-outline', color: '#FFD700' }; // Gold
    case 'INFO':
      return { icon: 'information-circle-outline', color: '#1E90FF' }; // DodgerBlue
    default:
      return { icon: 'alert-circle-outline', color: '#666' }; // Default grey
  }
};

const AlertCard: React.FC<AlertItem> = (alert) => {
  const { icon, color } = getAlertIconAndColor(alert.category);
  return (
    <TouchableOpacity style={styles.alertCard} activeOpacity={0.7}>
      <View style={styles.alertIconContainer}>
        <Ionicons name={icon as any} size={28} color={color} />
      </View>
      <View style={styles.alertTextContainer}>
        <Text style={[styles.alertTitle, { color: color }]}>{alert.title}</Text>
        <Text style={styles.alertStation}>{alert.station}</Text>
      </View>
      <Text style={styles.alertTimestamp}>{alert.timestamp}</Text>
    </TouchableOpacity>
  );
};

const SystemAlertsScreen = () => {
  const router = useRouter();
  const [alertsByLine, setAlertsByLine] = React.useState<LineAlerts[]>(mockAlertsData);
  const insets = useSafeAreaInsets(); // Hook to get safe area insets

  // In a real app, fetch alerts here:
  // useEffect(() => {
  //   fetchSystemAlerts().then(data => setAlertsByLine(data));
  // }, []);

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // Fallback if no back history (e.g., deep linked here)
      router.replace('/(tabs)/home');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}> {/* Apply safe area insets */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alerts</Text>
        <View style={styles.headerPlaceholder} /> {/* For symmetry */}
      </View>

      <ScrollView style={styles.scrollView}>
        {alertsByLine.map((lineGroup) => (
          <View key={lineGroup.lineName} style={styles.lineSection}>
            <Text style={styles.lineTitle}>From {lineGroup.lineName}</Text>
            {lineGroup.alerts.map((alert) => (
              <AlertCard key={alert.id} {...alert} />
            ))}
          </View>
        ))}
        {alertsByLine.length === 0 && (
            <View style={styles.noAlertsContainer}>
                <Ionicons name="checkmark-circle-outline" size={60} color="#4CAF50" />
                <Text style={styles.noAlertsText}>No active alerts at the moment.</Text>
                <Text style={styles.noAlertsSubText}>Enjoy your journey!</Text>
            </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E8EFF1', // Light grayish blue
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#E8EFF1',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333D47', // Darker text
    textAlign: 'center',
  },
  headerPlaceholder: {
    width: 28 + 10, // Match back button size for balance
  },
  scrollView: {
    flex: 1,
  },
  lineSection: {
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  lineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333D47',
    marginBottom: 12,
    marginLeft: 5, // Slight indent
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2, // Android shadow
    shadowColor: '#000000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  alertIconContainer: {
    marginRight: 15,
    padding: 5, // Add padding around icon if needed
  },
  alertTextContainer: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  alertStation: {
    fontSize: 14,
    color: '#555E68',
  },
  alertTimestamp: {
    fontSize: 12,
    color: '#777F88',
    marginLeft: 10, // Space from text to timestamp
  },
  noAlertsContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 30,
      marginTop: 50,
  },
  noAlertsText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#333D47',
      marginTop: 15,
      textAlign: 'center',
  },
  noAlertsSubText: {
      fontSize: 14,
      color: '#555E68',
      marginTop: 5,
      textAlign: 'center',
  }
});

export default SystemAlertsScreen;
