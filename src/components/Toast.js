import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';

// type: 'success' | 'error' | 'warning'
export default function Toast({ visible, message, type = 'success', onHide }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    if (visible) {
      // Apparition
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();

      // Disparition après 2.5s
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: -20, duration: 300, useNativeDriver: true }),
        ]).start(() => onHide && onHide());
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [visible, message]);

  if (!visible) return null;

  const config = {
    success: { bg: '#2e7d32', icon: '✅', border: '#43a047' },
    error:   { bg: '#c62828', icon: '❌', border: '#e53935' },
    warning: { bg: '#e65100', icon: '⚠️', border: '#FB8C00' },
    info:    { bg: '#1565c0', icon: 'ℹ️', border: '#1976D2' },
  }[type] || { bg: '#2e7d32', icon: '✅', border: '#43a047' };

  return (
    <Animated.View style={[
      styles.toast,
      { backgroundColor: config.bg, borderLeftColor: config.border, opacity, transform: [{ translateY }] }
    ]}>
      <Text style={styles.icon}>{config.icon}</Text>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 4,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  icon: { fontSize: 18, marginRight: 10 },
  message: { flex: 1, color: '#fff', fontSize: 14, fontWeight: '600' },
});
