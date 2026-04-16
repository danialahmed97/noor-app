import React, { useCallback, useEffect, useState } from 'react';
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

// Keep splash screen visible until we are ready
SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();

function TabIcon({ emoji, label, focused, color }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20 }}>{emoji}</Text>
      <Text style={{ fontSize: 10, color, fontWeight: focused ? '700' : '500', marginTop: 2 }}>
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

  useEffect(() => {
    async function prepare() {
      try {
        // Wait for theme to resolve from AsyncStorage
        if (mode === null) return;
        // Small pause for aesthetic effect
        await new Promise(resolve => setTimeout(resolve, 800));
        setAppReady(true);
      } catch (e) {
        console.warn(e);
      }
    }
    prepare();
  }, [mode]);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) return null;

  return (
    <View
      style={{ flex: 1, backgroundColor: colors.bg }}
      onLayout={onLayoutRootView}
    >
      <AppContent />
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
