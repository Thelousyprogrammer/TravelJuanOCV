// Suggested file path: app/(tabs)/profile.tsx

import { Href, useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { auth } from '../../data/config/firebase';

const ThemedProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const currentUser = auth.currentUser;

  const menuItems = [
    { icon: '\uF023', title: 'Change Pin', route: '/profile/change-pin' },
    { icon: '\uF2C2', title: 'Change Name', route: '/profile/change-name' },
    { icon: '\uF3CD', title: 'Update Number', route: '/profile/update-number' },
    { icon: '\uF059', title: 'FAQs', route: '/faqs' },
    { icon: '\uF05A', title: 'About', route: '/about' },
    { icon: '\uF879', title: 'Contact Us', route: '/contact-us' },
  ];

  const navItems = [
    { icon: '\uF015', label: 'Home', route: '/(tabs)/home' },
    { icon: '\uF207', label: 'Ride', route: '/(tabs)/ride' },
    { icon: '\uF796', label: 'Tickets', route: '/(tabs)/tickets' },
    { icon: '\uF406', label: 'Profile', route: '/(tabs)/profile', active: true },
  ];

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Logout Error', 'An error occurred while logging out. Please try again.');
    }
  };

  const handleMenuItemPress = (route: string) => {
    router.push(route as Href);
  };

  const handleBottomNavPress = (route: string) => {
    router.replace(route as Href);
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/home');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <Image
            source={
              currentUser?.photoURL
                ? { uri: currentUser.photoURL }
                : require('../../assets/images/default-profile.jpg')
            }
            style={styles.profileImage}
          />
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>
              {currentUser?.displayName || 'User Name'}
            </Text>
            <Text style={styles.profileDetail}>
              {currentUser?.email || currentUser?.phoneNumber || 'No Contact Info'}
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.title}
            style={styles.menuItem}
            onPress={() => handleMenuItemPress(item.route)}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuText}>{item.title}</Text>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8eff3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#dde3ea',
  },
  backButton: {
    padding: 5,
  },
  backIcon: {
    fontFamily: 'FontAwesome',
    fontSize: 24,
    color: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A202C',
    marginLeft: 10,
  },
  scrollContent: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#ff4500',
  },
  profileTextContainer: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 4,
  },
  profileDetail: {
    fontSize: 14,
    color: '#4A5568',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#edf2f7',
  },
  menuIcon: {
    fontFamily: 'FontAwesome',
    fontSize: 20,
    color: '#4A5568',
    marginRight: 20,
    width: 24,
    textAlign: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
  },
  arrowIcon: {
    fontFamily: 'FontAwesome',
    fontSize: 18,
    color: '#A0AEC0',
  },
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#ff4500',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff4500',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#dde3ea',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navIcon: {
    fontFamily: 'FontAwesome',
    fontSize: 22,
    color: '#718096',
    marginBottom: 3,
  },
  navIconActive: {
    color: '#ff4500',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#718096',
  },
  navLabelActive: {
    color: '#ff4500',
  },
});

export default ThemedProfileScreen;