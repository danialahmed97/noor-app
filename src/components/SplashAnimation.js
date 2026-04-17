import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

export default function SplashAnimation({ onFinish }) {
  const arabicOpacity  = useRef(new Animated.Value(0)).current;
  const arabicScale    = useRef(new Animated.Value(0.8)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const screenOpacity  = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      // Small pause
      Animated.delay(200),

      // Arabic نور fades + scales in
      Animated.parallel([
        Animated.timing(arabicOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.spring(arabicScale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),

      // Subtitle fades in after arabic
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),

      // Hold for a moment
      Animated.delay(800),

      // Entire screen fades out
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onFinish();
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <Animated.Text
        style={[
          styles.arabic,
          {
            opacity: arabicOpacity,
            transform: [{ scale: arabicScale }],
          },
        ]}
      >
        نور
      </Animated.Text>
      <Animated.Text
        style={[styles.subtitle, { opacity: subtitleOpacity }]}
      >
        Islamic Dawah
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0D5016',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    elevation: 9999,
  },
  arabic: {
    fontSize: 80,
    fontWeight: '700',
    color: '#C9A84C',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(201, 168, 76, 0.8)',
    letterSpacing: 4,
    marginTop: 12,
    textTransform: 'uppercase',
  },
});
