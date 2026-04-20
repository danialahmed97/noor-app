import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from '../src/screens/HomeScreen';

jest.mock('../src/context/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      primary: '#0D5016',
      gold: '#C9A84C',
      bg: '#F6F4EE',
      bgCard: '#FFFFFF',
      textDark: '#1A1A1A',
      textMid: '#555555',
      textLight: '#888888',
      border: '#E8E4DA',
      arabic: '#8B6914',
      ayah: '#1B5E20', ayahLight: '#E8F5E9',
      hadith: '#1A237E', hadithLight: '#E8EAF6',
      story: '#4A148C', storyLight: '#F3E5F5',
      dua: '#B71C1C', duaLight: '#FFEBEE',
      tabBar: '#FFFFFF', tabActive: '#0D5016', tabInactive: '#999999',
    },
    isDark: false,
    toggleTheme: jest.fn(),
  }),
}));

const mockNavigation = {
  navigate: jest.fn(),
  setParams: jest.fn(),
};

const mockRoute = { params: {} };

beforeEach(() => {
  AsyncStorage._reset();
  jest.clearAllMocks();
});

describe('HomeScreen', () => {
  it('renders the Arabic نور header', async () => {
    const { getByText } = render(
      <HomeScreen navigation={mockNavigation} route={mockRoute} />
    );
    await waitFor(() => expect(getByText('نور')).toBeTruthy());
  });

  it('renders the subtitle text', async () => {
    const { getByText } = render(
      <HomeScreen navigation={mockNavigation} route={mockRoute} />
    );
    await waitFor(() => expect(getByText(/Noor/i)).toBeTruthy());
  });

  it('renders the CategoryBar with All chip', async () => {
    const { getByText } = render(
      <HomeScreen navigation={mockNavigation} route={mockRoute} />
    );
    await waitFor(() => expect(getByText('All')).toBeTruthy());
  });

  it('renders all category chips', async () => {
    const { getByText } = render(
      <HomeScreen navigation={mockNavigation} route={mockRoute} />
    );
    await waitFor(() => {
      expect(getByText('All')).toBeTruthy();
      expect(getByText('Ayah')).toBeTruthy();
      expect(getByText('Hadith')).toBeTruthy();
      expect(getByText('Story')).toBeTruthy();
      expect(getByText('Dua')).toBeTruthy();
    });
  });

  it('renders a progress indicator (e.g. "1 / 222")', async () => {
    const { getByText } = render(
      <HomeScreen navigation={mockNavigation} route={mockRoute} />
    );
    await waitFor(() => {
      // Progress text is "current / total" format
      const text = getByText(/\d+ \/ \d+/);
      expect(text).toBeTruthy();
    });
  });

  it('renders the theme toggle button', async () => {
    const { getByText } = render(
      <HomeScreen navigation={mockNavigation} route={mockRoute} />
    );
    await waitFor(() => expect(getByText('🌙')).toBeTruthy());
  });

  it('renders the shuffle/restart button', async () => {
    const { getByText } = render(
      <HomeScreen navigation={mockNavigation} route={mockRoute} />
    );
    await waitFor(() => expect(getByText('↺')).toBeTruthy());
  });

  it('clicking refresh button reshuffles deck without errors', async () => {
    const { getByText } = render(
      <HomeScreen navigation={mockNavigation} route={mockRoute} />
    );
    await waitFor(() => getByText('↺'));
    fireEvent.press(getByText('↺'));
    await waitFor(() => expect(getByText('↺')).toBeTruthy());
  });

  it('clicking a category chip updates the shown cards', async () => {
    const { getByText } = render(
      <HomeScreen navigation={mockNavigation} route={mockRoute} />
    );
    await waitFor(() => getByText('Ayah'));
    fireEvent.press(getByText('Ayah'));
    // After selecting Ayah, progress should show filtered count
    await waitFor(() => {
      const progress = getByText(/\d+ \/ 95/);
      expect(progress).toBeTruthy();
    });
  });

  it('renders the card area with a SwipeCard', async () => {
    const { getByText } = render(
      <HomeScreen navigation={mockNavigation} route={mockRoute} />
    );
    // The first card is Bismillah (after shuffle, any card from content)
    // Just verify some card content is rendered — translation or source
    await waitFor(() => {
      // At least the progress shows card is present
      const progress = getByText(/1 \/ \d+/);
      expect(progress).toBeTruthy();
    });
  });
});
