import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Line } from '../../data/lib/fares';
import { GeneratedTicketData, useTicketStore } from '../stores/ticketStore';

interface SingleJourneyTicketCardProps {
  id: string;
  originStationName: string;
  destinationStationName: string;
  generatedAt: string;
  line: Line;
  onPress: () => void;
}

const SingleJourneyTicketCard: React.FC<SingleJourneyTicketCardProps> = ({
  originStationName,
  destinationStationName,
  generatedAt,
  line,
  onPress,
}) => {
  const displayDate = new Date(generatedAt).toLocaleDateString();
  const displayOrigin = originStationName.replace(/ Station$/i, '');
  const displayDestination = destinationStationName.replace(/ Station$/i, '');

  return (
    <TouchableOpacity style={styles.cardBase} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.cardBackground, styles.sjCardBackground]}>
        <View style={styles.cardContent}>
          <View style={styles.sjHeader}>
            <Text style={styles.sjTitle}>
              {line} Single Journey <Text style={styles.sjTitleHighlight}>Ticket</Text>
            </Text>
            <Text style={styles.sjDate}>{displayDate}</Text>
          </View>
          <Text style={styles.sjRoute}>{`${displayOrigin} - ${displayDestination}`}</Text>
          <View style={styles.trainGraphicPlaceholder} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ActiveTicketsScreen = () => {
  const insets = useSafeAreaInsets();
  const activeTickets = useTicketStore((state) => state.activeTickets);
  const router = useRouter();

  const storedValueBalance = '150.00';

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/home');
    }
  };

  const handleNotificationPress = () => console.log('Notifications Pressed');
  const handleStoredValuePress = () => console.log('Stored Value Card Pressed');

  const handleSJTicketPress = (ticket: GeneratedTicketData) => {
    const screen = ticket.ticketType === 'SJT' ? 'digitalTicket' : 'claimPhysicalTicket';
    router.push({
      pathname: `/${screen}`,
      params: {
        origin: ticket.departureStationName,
        destination: ticket.arrivalStationName,
        date: ticket.generatedAt,
        ticketNumber: ticket.id,
        ticketType: ticket.ticketType,
        line: ticket.departureStationLine,
        fare: ticket.fare.toString(),
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={handleBackPress} style={styles.iconButton}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Active <Text style={styles.headerTitleHighlight}>Tickets</Text>
        </Text>
        <TouchableOpacity onPress={handleNotificationPress} style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={26} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Stored Value Card</Text>
        <TouchableOpacity style={styles.cardBase} onPress={handleStoredValuePress} activeOpacity={0.8}>
          <View style={[styles.cardBackground, styles.svCardBackground]}>
            <View style={styles.cardContent}>
              <Text style={styles.svLabel}>Card Balance</Text>
              <Text style={styles.svBalance}>₱{storedValueBalance}</Text>
              <View style={styles.trainGraphicPlaceholder} />
            </View>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Single Journey Tickets</Text>
        {activeTickets.length === 0 ? (
          <Text style={styles.noTicketsText}>You have no active single journey tickets.</Text>
        ) : (
          activeTickets.map((ticket) => (
            <SingleJourneyTicketCard
              key={ticket.id}
              id={ticket.id}
              originStationName={ticket.departureStationName}
              destinationStationName={ticket.arrivalStationName}
              generatedAt={ticket.generatedAt}
              line={ticket.departureStationLine}
              onPress={() => handleSJTicketPress(ticket)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F4F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 15,
    backgroundColor: '#F0F4F7',
  },
  iconButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerTitleHighlight: {
    color: '#FF4500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 25,
    marginBottom: 15,
  },
  cardBase: {
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardBackground: {
    borderRadius: 12,
    overflow: 'hidden',
    minHeight: 130,
  },
  svCardBackground: {
    backgroundColor: '#E0E8EC',
  },
  sjCardBackground: {
    backgroundColor: '#E0E8EC',
  },
  cardContent: {
    padding: 15,
    position: 'relative',
    flex: 1,
    justifyContent: 'space-between',
  },
  svLabel: {
    fontSize: 16,
    color: '#FF4500',
    fontWeight: '500',
    marginBottom: 5,
  },
  svBalance: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  sjHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  sjTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    flexShrink: 1,
    marginRight: 5,
  },
  sjTitleHighlight: {
    color: '#FF4500',
  },
  sjDate: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
    textAlign: 'right',
  },
  sjRoute: {
    fontSize: 15,
    color: '#444',
    fontWeight: '500',
    marginBottom: 10,
  },
  trainGraphicPlaceholder: {
    height: 35,
    backgroundColor: 'rgba(0, 100, 150, 0.1)',
    borderRadius: 4,
    marginTop: 'auto',
  },
  noTicketsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
    marginBottom: 20,
  },
});

export default ActiveTicketsScreen;