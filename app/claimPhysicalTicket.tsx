import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TicketDetailParams = {
  origin?: string;
  destination?: string;
  date?: string;
  ticketNumber?: string;
  ticketType?: string;
  line?: string;
  fare?: string;
};

const ClaimPhysicalTicketScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    origin = 'N/A',
    destination = 'N/A',
    date = new Date().toISOString(),
    ticketNumber = `UNKNOWN-${Date.now()}`,
    ticketType = 'N/A',
    line = 'N/A',
    fare = '0.00',
  } = useLocalSearchParams<TicketDetailParams>();

  const formattedDate = new Date(date).toLocaleString();
  const useBefore = new Date(date).toLocaleDateString();

  const handleBack = () => {
    router.canGoBack() ? router.back() : router.replace('/(tabs)/tickets');
  };

  const goToDigitalTicket = () => {
    router.push({
      pathname: '/digitalTicket',
      params: {
        origin,
        destination,
        date,
        ticketNumber,
        ticketType,
        line,
        fare,
      },
    });
  };

  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: '#E8EFF3' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ticket Details</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Instruction */}
        <View style={styles.instructionContainer}>
          <Text style={styles.instruction}>This is your ticket information.</Text>
        </View>

        {/* Visual Area */}
        <View style={styles.qrContainer}>
          <View style={styles.visualPlaceholder}>
            <Ionicons name="ticket-outline" size={80} color="#FF4500" />
          </View>
          <Text style={styles.qrText}>TRAVEL JUAN</Text>
          <Text style={styles.ticketNumberLabel}>Ticket ID:</Text>
          <Text style={styles.ticketNumberValue}>{ticketNumber}</Text>
        </View>

        {/* Journey Info */}
        <View style={styles.journeyInfo}>
          <Text style={styles.sectionTitle}>Journey Info</Text>

          <InfoRow label="Type:" value={`${ticketType} (${line})`} />
          <InfoRow label="Origin Station:" value={origin} />
          <InfoRow label="Destination:" value={destination} />
          <InfoRow label="Fare:" value={`₱${parseFloat(fare).toFixed(2)}`} />
          <InfoRow label="Generated At:" value={formattedDate} />
          <InfoRow label="Use Before:" value={useBefore} />

          <Text style={styles.note}>
            Single journey tickets are only valid within the day of purchase and
            must be used within 2 hours upon entry. Tickets not used within the
            specified time period are not subject for refund.
          </Text>
        </View>

        {/* Digital Ticket Button */}
        <TouchableOpacity onPress={goToDigitalTicket} style={styles.useDigitalButton}>
          <Text style={styles.useDigitalText}>Use Digital Ticket</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// Reusable row component
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8EFF3' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#E8EFF3',
  },
  backButton: { padding: 5 },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF4500',
    textAlign: 'center',
  },
  placeholder: { width: 38 },
  instructionContainer: {
    padding: 20,
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  instruction: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  qrContainer: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    marginBottom: 20,
  },
  visualPlaceholder: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 15,
  },
  qrText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF4500',
    marginVertical: 10,
  },
  ticketNumberLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  ticketNumberValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  journeyInfo: {
    marginHorizontal: 20,
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    marginRight: 10,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF4500',
    textAlign: 'right',
    flexShrink: 1,
  },
  note: {
    fontSize: 13,
    color: '#666',
    marginTop: 15,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  useDigitalButton: {
    backgroundColor: '#1A1A1A',
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  useDigitalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    textTransform: 'uppercase',
  },
});

export default ClaimPhysicalTicketScreen;