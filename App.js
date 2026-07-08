import React, { useEffect, useState } from 'react';
import { View, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import HomeScreen from './src/screens/HomeScreen';
import SavedScreen from './src/screens/SavedScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { Text } from 'react-native';
import SplashAnimation from './src/components/SplashAnimation';

// Keep splash screen visible until we are ready
SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();

function TabIcon({ emoji, label, focused, color }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', minWidth: 60 }}>
      <Text style={{ fontSize: 20, minWidth: 24 }}>{emoji}</Text>
      <Text numberOfLines={1} style={{ fontSize: 10, color, fontWeight: focused ? '700' : '500', marginTop: 2 }}>
        {label}
      </Text>
    </View>
  );
}

function AppContent() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.tabBar,
            borderTopColor: colors.border,
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom || 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: colors.tabActive,
          tabBarInactiveTintColor: colors.tabInactive,
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <TabIcon emoji="🏠" label="Discover" focused={focused} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Saved"
          component={SavedScreen}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <TabIcon emoji="🤍" label="Saved" focused={focused} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="About"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <TabIcon emoji="☪️" label="About" focused={focused} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function Root() {
  const { colors, mode } = useTheme();
  const [appReady, setAppReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        if (mode === null) return;
        setAppReady(true);
        // Hide native splash immediately — JS splash takes over
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn(e);
      }
    }
    prepare();
  }, [mode]);

  if (!appReady) return (
    <View style={{ flex: 1, backgroundColor: '#0D5016' }} />
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppContent />
      {showSplash && (
        <SplashAnimation onFinish={() => setShowSplash(false)} />
      )}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Root />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
