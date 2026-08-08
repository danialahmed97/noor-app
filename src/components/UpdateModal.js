import React from 'react';
import { Modal, View, Text, TouchableOpacity, Linking, StyleSheet, Platform } from 'react-native';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.noor.islamic.dawah';

export default function UpdateModal({ visible, onDismiss }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.emoji}>🌙</Text>
          <Text style={styles.title}>New Version Available</Text>
          <Text style={styles.body}>
            A better Noor is here — smoother cards, tablet support, and weekly notifications. Please update to continue receiving new content.
          </Text>
          <TouchableOpacity
            style={styles.updateBtn}
            onPress={() => Linking.openURL(PLAY_STORE_URL)}
            activeOpacity={0.8}
          >
            <Text style={styles.updateBtnText}>Update Now</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDismiss} activeOpacity={0.7}>
            <Text style={styles.laterText}>Maybe later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#1A1F1A',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: '#2D5A2D',
  },
  emoji: { fontSize: 48, marginBottom: 16 },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  body: {
    fontSize: 15,
    color: '#B0B8B0',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  updateBtn: {
    backgroundColor: '#2D5A2D',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  updateBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  laterText: {
    color: '#6B7B6B',
    fontSize: 14,
  },
});
