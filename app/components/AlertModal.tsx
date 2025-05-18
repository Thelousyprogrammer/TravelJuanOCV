// app/components/AlertModal.tsx
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AlertModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
  onButtonPress?: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  onClose,
  title = "Alert!",
  message = "Something important happened.",
  buttonText = "OK",
  onButtonPress,
}) => {
  if (!visible) return null;

  const handleButtonPress = () => {
    if (onButtonPress) {
      onButtonPress();
    }
    onClose();
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
    >
      <View style={modalStyles.modalContainer}>
        <View style={modalStyles.alertBox}>
          <Text style={modalStyles.warningIcon}>⚠️</Text>
          <Text style={modalStyles.title}>{title}</Text>
          <Text style={modalStyles.message}>{message}</Text>
          <TouchableOpacity style={modalStyles.button} onPress={handleButtonPress}>
            <Text style={modalStyles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({ // Renamed to avoid conflict
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  alertBox: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 12,
    alignItems: 'center',
    width: '85%',
    maxWidth: 400,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  warningIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#3C3C43',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AlertModal;