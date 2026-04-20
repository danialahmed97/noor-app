import React from 'react';
import { render, waitFor, fireEvent, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../src/context/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      primary: '#0D5016',
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
    },
    isDark: false,
  }),
}));

// Mock useFocusEffect to call the callback immediately
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (cb) => {
    const { useEffect } = require('react');
    useEffect(() => {
      const cleanup = cb();
      return cleanup;
    }, []);
  },
}));

const mockNavigation = { navigate: jest.fn() };

const mockCard1 = {
  id: 'ayah_1_1',
  category: 'Ayah',
  arabic: 'بِسْمِ اللَّهِ',
  translation: '"In the name of Allah, the Most Gracious."',
  explanation: 'Every deed begins with Bismillah.',
  source: 'Surah Al-Fatihah • 1:1',
  sourceType: 'Quran',
  tag: 'Bismillah',
};

const mockCard2 = {
  id: 'hadith_test_1',
  category: 'Hadith',
  arabic: '',
  translation: '"Actions are judged by intentions."',
  explanation: 'A foundational hadith.',
  source: 'Bukhari 1',
  sourceType: 'Hadith',
  tag: 'Niyyah',
};

// Import after mocks so the module picks them up
let SavedScreen;
beforeAll(() => {
  SavedScreen = require('../src/screens/SavedScreen').default;
});

beforeEach(() => {
  AsyncStorage._reset();
  jest.clearAllMocks();
});

describe('SavedScreen — empty state', () => {
  it('shows "My Collection" header', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);
    const { getByText } = render(<SavedScreen navigation={mockNavigation} />);
    await waitFor(() => expect(getByText('My Collection')).toBeTruthy());
  });

  it('shows 0 cards saved subtitle', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);
    const { getByText } = render(<SavedScreen navigation={mockNavigation} />);
    await waitFor(() => expect(getByText('0 cards saved')).toBeTruthy());
  });

  it('shows empty state emoji and title', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);
    const { getByText } = render(<SavedScreen navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByText('🤲')).toBeTruthy();
      expect(getByText('No saved cards yet')).toBeTruthy();
    });
  });

  it('shows instruction to tap the heart', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);
    const { getByText } = render(<SavedScreen navigation={mockNavigation} />);
    await waitFor(() => expect(getByText(/heart/i)).toBeTruthy());
  });
});

describe('SavedScreen — with saved cards', () => {
  beforeEach(() => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify([mockCard1, mockCard2]));
  });

  it('shows "2 cards saved" in subtitle', async () => {
    const { getByText } = render(<SavedScreen navigation={mockNavigation} />);
    await waitFor(() => expect(getByText('2 cards saved')).toBeTruthy());
  });

  it('renders the first card translation', async () => {
    const { getByText } = render(<SavedScreen navigation={mockNavigation} />);
    await waitFor(() => expect(getByText(mockCard1.translation)).toBeTruthy());
  });

  it('renders the second card translation', async () => {
    const { getByText } = render(<SavedScreen navigation={mockNavigation} />);
    await waitFor(() => expect(getByText(mockCard2.translation)).toBeTruthy());
  });

  it('renders share (↗) and remove (✕) buttons for each card', async () => {
    const { getAllByText } = render(<SavedScreen navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getAllByText('↗')).toHaveLength(2);
      expect(getAllByText('✕')).toHaveLength(2);
    });
  });

  it('navigates to Home with the card when a card is tapped', async () => {
    const { getByText } = render(<SavedScreen navigation={mockNavigation} />);
    await waitFor(() => getByText(mockCard1.translation));
    fireEvent.press(getByText(mockCard1.translation));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Home', { openCard: mockCard1 });
  });
});

describe('SavedScreen — singular vs plural', () => {
  it('shows "1 card saved" (singular) when one card is saved', async () => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify([mockCard1]));
    const { getByText } = render(<SavedScreen navigation={mockNavigation} />);
    await waitFor(() => expect(getByText('1 card saved')).toBeTruthy());
  });
});
