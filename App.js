// ─────────────────────────────────────────────────────────
//  Noor — Islamic Dawah App
//  Inshorts-style swipeable Islamic content cards
//  React Native + Expo
// ─────────────────────────────────────────────────────────
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';

import HomeScreen     from './src/screens/HomeScreen';
import SavedScreen    from './src/screens/SavedScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

// Keep splash screen visible while we prepare
SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();

function TabIcon({ emoji, label, focused }) {
  const { colors } = useTheme();
  return (
    <View style={tabIconStyles.container}>
      <Text style={tabIconStyles.emoji}>{emoji}</Text>
      <Text style={[
        tabIconStyles.label,
        { color: focused ? colors.tabActive : colors.tabInactive },
        focused && tabIconStyles.labelActive,
      ]}>
        {label}
      </Text>
    </View>
  );
}

const tabIconStyles = StyleSheet.create({
  container:   { alignItems: 'center', justifyContent: 'center', paddingTop: 4 },
  emoji:       { fontSize: 20 },
  label:       { fontSize: 10, marginTop: 2, fontWeight: '500' },
  labelActive: { fontWeight: '700' },
});

function AppContent() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <NavigationContainer>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.bg} />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.tabBar,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom || 8,
            paddingTop: 8,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.06,
            shadowRadius: 6,
          },
          tabBarActiveTintColor:   colors.tabActive,
          tabBarInactiveTintColor: colors.tabInactive,
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="🏠" label="Discover" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Saved"
          component={SavedScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="🤍" label="Saved" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="☪️" label="About" focused={focused} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      // Aesthetic pause — 2 seconds on splash screen
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAppReady(true);
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <AppContent />
        </View>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
