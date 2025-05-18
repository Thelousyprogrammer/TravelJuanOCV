import React from 'react';
// Import SafeAreaView for better layout on devices with notches
import { FlatList, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Callout, Marker, Region } from 'react-native-maps';
// Make sure these types are correctly imported
import { StationList, StationMap } from '../../data/lib/stationData';

type Props = {
  visible: boolean;
  onClose: () => void;
  stationsData: StationMap;
};

// Define an approximate initial region covering Metro Manila's rail lines
const INITIAL_REGION: Region = {
    latitude: 14.58,
    longitude: 121.03,
    latitudeDelta: 0.35,
    longitudeDelta: 0.35,
};

const StationMapModal: React.FC<Props> = ({ visible, onClose, stationsData }) => {
  return (
    <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={onClose} // Handles Android back button press
    >
        {/* Use SafeAreaView to avoid content going under notches/status bars */}
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.title}>Station Map View</Text>
                <TouchableOpacity onPress={onClose}>
                <Text style={styles.close}>Close</Text>
                </TouchableOpacity>
            </View>
            <MapView
                style={styles.map}
                initialRegion={INITIAL_REGION} // Set the initial view
            >
                {/* Iterate through the lines passed via props */}
                {Object.entries(stationsData).map(([line, stationList]) =>
                // Iterate through stations in the current line
                stationList.map((station: StationList, index: number) => (
                    <Marker
                        key={`${line}-${station.name}-${index}`} // More stable key
                        // Use the coordinates directly from the station data
                        coordinate={{
                            latitude: station.latitude,
                            longitude: station.longitude,
                        }}
                        title={station.name} // Shows on long press/hover on some platforms
                        description={`Line: ${line}`}
                        pinColor={ // Assign color based on line
                            line === 'MRT3' ? '#FFD700' // Gold
                            : line === 'LRT1' ? '#50C878' // Emerald Green
                            : '#4682B4' // Steel Blue (LRT2)
                        }
                    >
                        {/* Callout shown on marker tap */}
                        <Callout tooltip={false} style={styles.calloutContainer}>
                            <View style={styles.calloutView}>
                                <Text style={styles.calloutTitle}>{station.name}</Text>
                                {/* Check if landmarks array exists and is not empty */}
                                {station.landmarks && station.landmarks.length > 0 ? (
                                    <>
                                        <Text style={styles.calloutSubTitle}>Nearby Landmarks:</Text>
                                        {/* Use FlatList for potentially long lists */}
                                        <FlatList
                                            data={station.landmarks}
                                            keyExtractor={(item, idx) => `${station.name}-landmark-${idx}`}
                                            renderItem={({ item }) => (
                                                // Ensure landmark text is wrapped
                                                <Text style={styles.landmarkItem}>• {item}</Text>
                                            )}
                                            style={styles.landmarkList} // Style for the list container
                                            nestedScrollEnabled // Helps if callout needs scrolling
                                        />
                                    </>
                                ) : (
                                    // Displayed if no landmarks are provided
                                    <Text style={styles.noLandmarksText}>No landmarks listed.</Text>
                                )}
                            </View>
                        </Callout>
                    </Marker>
                ))
                )}
            </MapView>
        </SafeAreaView>
    </Modal>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
    safeArea: {
        flex: 1, // Ensure SafeAreaView takes full space
        backgroundColor: '#fff', // Match header background or use theme
    },
    header: {
        backgroundColor: '#F8F8F8',
        paddingVertical: 12,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth, // Thinner border
        borderColor: '#D1D1D1', // Lighter border
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1C1C1E', // Slightly off-black
    },
    close: {
        color: '#007AFF', // Standard iOS blue
        fontSize: 17,
    },
    map: {
        flex: 1 // Map should fill the remaining space
    },
    calloutContainer: {
        // Necessary on iOS to prevent default styling overrides sometimes
        // You might adjust padding/margins here if needed globally for callouts
    },
    calloutView: {
        width: 240, // Increased width for better text flow
        paddingHorizontal: 10, // Horizontal padding
        paddingVertical: 8,   // Vertical padding
        // Removed background color here - let the default bubble show
        borderRadius: 8,     // Match bubble style
    },
    calloutTitle: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#000', // Black title
        marginBottom: 5, // Space below title
    },
    calloutSubTitle: {
        fontSize: 13,
        color: '#333333', // Dark grey subtitle
        marginBottom: 4,
        fontWeight: '500',
    },
    landmarkList: {
        maxHeight: 100, // Limit the height to prevent overly tall callouts
        marginTop: 2, // Add slight space above the list
    },
    landmarkItem: {
        fontSize: 12,
        color: '#1C1C1E', // Match title color or use slightly lighter
        marginBottom: 2, // Space between list items
    },
    noLandmarksText: {
        fontSize: 12,
        color: '#8E8E93', // iOS secondary label color
        fontStyle: 'italic',
        marginTop: 4,
    },
});

export default StationMapModal;