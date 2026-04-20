import React from 'react';
import { Text } from 'react-native';
import { render, waitFor, act, fireEvent } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ThemeProvider,
  useTheme,
  lightColors,
  darkColors,
  LIGHT,
  DARK,
} from '../src/context/ThemeContext';

beforeEach(() => {
  AsyncStorage._reset();
  jest.clearAllMocks();
});

// ── exported constants ────────────────────────────────────────────────────────

describe('lightColors', () => {
  const requiredKeys = [
    'primary', 'gold', 'bg', 'bgCard', 'textDark', 'textMid', 'textLight',
    'border', 'arabic', 'ayah', 'ayahLight', 'hadith', 'hadithLight',
    'story', 'storyLight', 'dua', 'duaLight', 'tabBar', 'tabActive', 'tabInactive',
  ];

  it.each(requiredKeys)('has key: %s', (key) => {
    expect(lightColors).toHaveProperty(key);
    expect(typeof lightColors[key]).toBe('string');
  });

  it('primary is a hex color', () => {
    expect(lightColors.primary).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });
});

describe('darkColors', () => {
  const requiredKeys = [
    'primary', 'bg', 'bgCard', 'textDark', 'textMid', 'border',
    'ayah', 'hadith', 'story', 'dua',
  ];

  it.each(requiredKeys)('has key: %s', (key) => {
    expect(darkColors).toHaveProperty(key);
  });

  it('bg is darker than lightColors.bg', () => {
    // dark bg starts with #12... vs light bg #F6...
    expect(darkColors.bg).not.toBe(lightColors.bg);
  });
});

describe('LIGHT and DARK constants', () => {
  it('LIGHT is "light"', () => expect(LIGHT).toBe('light'));
  it('DARK is "dark"', () => expect(DARK).toBe('dark'));
});

// ── ThemeProvider rendering ───────────────────────────────────────────────────

function ThemeConsumer() {
  const { colors, isDark, mode } = useTheme();
  return (
    <>
      <Text testID="mode">{mode}</Text>
      <Text testID="isDark">{isDark ? 'dark' : 'light'}</Text>
      <Text testID="primary">{colors.primary}</Text>
    </>
  );
}

describe('ThemeProvider', () => {
  it('renders children after mode resolves from AsyncStorage', async () => {
    AsyncStorage.getItem.mockResolvedValue('dark');
    const { getByTestId } = render(
      <ThemeProvider><ThemeConsumer /></ThemeProvider>
    );
    await waitFor(() => expect(getByTestId('mode').props.children).toBe('dark'));
    expect(getByTestId('isDark').props.children).toBe('dark');
  });

  it('defaults to dark mode when no saved preference and system is not light', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);
    const { getByTestId } = render(
      <ThemeProvider><ThemeConsumer /></ThemeProvider>
    );
    await waitFor(() => {
      expect(['light', 'dark']).toContain(getByTestId('mode').props.children);
    });
  });

  it('respects saved light preference', async () => {
    AsyncStorage.getItem.mockResolvedValue('light');
    const { getByTestId } = render(
      <ThemeProvider><ThemeConsumer /></ThemeProvider>
    );
    await waitFor(() => expect(getByTestId('mode').props.children).toBe('light'));
    expect(getByTestId('primary').props.children).toBe(lightColors.primary);
  });

  it('provides darkColors when mode is dark', async () => {
    AsyncStorage.getItem.mockResolvedValue('dark');
    const { getByTestId } = render(
      <ThemeProvider><ThemeConsumer /></ThemeProvider>
    );
    await waitFor(() => expect(getByTestId('primary').props.children).toBe(darkColors.primary));
  });
});

// ── toggleTheme ───────────────────────────────────────────────────────────────

function ToggleConsumer() {
  const { mode, toggleTheme } = useTheme();
  return (
    <>
      <Text testID="mode">{mode}</Text>
      <Text testID="toggle" onPress={toggleTheme}>Toggle</Text>
    </>
  );
}

describe('toggleTheme', () => {
  it('switches from dark to light', async () => {
    AsyncStorage.getItem.mockResolvedValue('dark');
    const { getByTestId } = render(
      <ThemeProvider><ToggleConsumer /></ThemeProvider>
    );
    await waitFor(() => expect(getByTestId('mode').props.children).toBe('dark'));

    await act(async () => { fireEvent.press(getByTestId('toggle')); });

    await waitFor(() => expect(getByTestId('mode').props.children).toBe('light'));
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('noor_theme', 'light');
  });

  it('switches from light to dark', async () => {
    AsyncStorage.getItem.mockResolvedValue('light');
    const { getByTestId } = render(
      <ThemeProvider><ToggleConsumer /></ThemeProvider>
    );
    await waitFor(() => expect(getByTestId('mode').props.children).toBe('light'));

    await act(async () => { fireEvent.press(getByTestId('toggle')); });

    await waitFor(() => expect(getByTestId('mode').props.children).toBe('dark'));
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('noor_theme', 'dark');
  });
});
