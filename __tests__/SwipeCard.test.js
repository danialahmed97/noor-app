import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SwipeCard from '../src/components/SwipeCard';

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
      ayah: '#1B5E20', ayahLight: '#E8F5E9',
      hadith: '#1A237E', hadithLight: '#E8EAF6',
      story: '#4A148C', storyLight: '#F3E5F5',
      dua: '#B71C1C', duaLight: '#FFEBEE',
    },
    isDark: false,
  }),
}));

const mockCard = {
  id: 'ayah_test_1',
  category: 'Ayah',
  arabic: 'بِسْمِ اللَّهِ',
  translation: '"In the name of Allah, the Most Gracious."',
  explanation: 'A short explanation.',
  source: 'Surah Al-Fatihah • 1:1',
  sourceType: 'Quran',
  tag: 'Test',
};

const longExplanationCard = {
  ...mockCard,
  id: 'ayah_test_long',
  explanation: 'A'.repeat(451), // > 450 chars → triggers "Read more"
};

const mockOnNext = jest.fn();
const mockOnPrev = jest.fn();

beforeEach(() => {
  AsyncStorage._reset();
  jest.clearAllMocks();
});

describe('SwipeCard', () => {
  it('renders the card translation', async () => {
    const { getByText } = render(
      <SwipeCard card={mockCard} onNext={mockOnNext} onPrev={mockOnPrev} />
    );
    await waitFor(() => expect(getByText(mockCard.translation)).toBeTruthy());
  });

  it('renders the Arabic text', async () => {
    const { getByText } = render(
      <SwipeCard card={mockCard} onNext={mockOnNext} onPrev={mockOnPrev} />
    );
    await waitFor(() => expect(getByText(mockCard.arabic)).toBeTruthy());
  });

  it('renders the explanation', async () => {
    const { getByText } = render(
      <SwipeCard card={mockCard} onNext={mockOnNext} onPrev={mockOnPrev} />
    );
    await waitFor(() => expect(getByText(mockCard.explanation)).toBeTruthy());
  });

  it('renders the source', async () => {
    const { getByText } = render(
      <SwipeCard card={mockCard} onNext={mockOnNext} onPrev={mockOnPrev} />
    );
    await waitFor(() => expect(getByText(mockCard.source)).toBeTruthy());
  });

  it('renders the category chip (e.g. Ayah)', async () => {
    const { getByText } = render(
      <SwipeCard card={mockCard} onNext={mockOnNext} onPrev={mockOnPrev} />
    );
    await waitFor(() => expect(getByText('AYAH')).toBeTruthy());
  });

  it('does not show "Read more" when explanation is short', async () => {
    const { queryByText } = render(
      <SwipeCard card={mockCard} onNext={mockOnNext} onPrev={mockOnPrev} />
    );
    await waitFor(() => expect(queryByText(/read more/i)).toBeNull());
  });

  it('shows "Read more" when explanation is longer than 450 chars', async () => {
    const { getByText } = render(
      <SwipeCard card={longExplanationCard} onNext={mockOnNext} onPrev={mockOnPrev} />
    );
    await waitFor(() => expect(getByText(/read more/i)).toBeTruthy());
  });

  it('renders an unsaved heart initially (🤍)', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);
    const { getByText } = render(
      <SwipeCard card={mockCard} onNext={mockOnNext} onPrev={mockOnPrev} />
    );
    await waitFor(() => expect(getByText('🤍')).toBeTruthy());
  });

  it('renders a saved heart (❤️) when card is already saved', async () => {
    // Mock isCardSaved to return true
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify([mockCard]));
    const { getByText } = render(
      <SwipeCard card={mockCard} onNext={mockOnNext} onPrev={mockOnPrev} />
    );
    await waitFor(() => expect(getByText('❤️')).toBeTruthy());
  });

  it('toggles saved state when heart is pressed', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);
    const { getByText } = render(
      <SwipeCard card={mockCard} onNext={mockOnNext} onPrev={mockOnPrev} />
    );
    await waitFor(() => getByText('🤍'));

    await act(async () => { fireEvent.press(getByText('🤍')); });

    await waitFor(() => expect(getByText('❤️')).toBeTruthy());
  });

  it('renders the share button', async () => {
    const { getByText } = render(
      <SwipeCard card={mockCard} onNext={mockOnNext} onPrev={mockOnPrev} />
    );
    await waitFor(() => expect(getByText('↗')).toBeTruthy());
  });
});

describe('SwipeCard with Hadith category', () => {
  const hadithCard = {
    id: 'hadith_test_1',
    category: 'Hadith',
    arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ',
    translation: '"Actions are judged by intentions."',
    explanation: 'The Prophet ﷺ said this foundational hadith.',
    source: 'Bukhari 1',
    sourceType: 'Hadith',
    tag: 'Niyyah',
  };

  it('renders Hadith category chip', async () => {
    const { getByText } = render(
      <SwipeCard card={hadithCard} onNext={mockOnNext} onPrev={mockOnPrev} />
    );
    await waitFor(() => expect(getByText('HADITH')).toBeTruthy());
  });
});

describe('SwipeCard with Story category', () => {
  const storyCard = {
    id: 'story_test_1',
    category: 'Story',
    arabic: '',
    translation: 'A story of patience.',
    explanation: 'This is a story about Nabi Ayyub (AS).',
    source: 'Islamic Literature',
    sourceType: 'Story',
    tag: 'Patience',
  };

  it('renders Story card translation', async () => {
    const { getByText } = render(
      <SwipeCard card={storyCard} onNext={mockOnNext} onPrev={mockOnPrev} />
    );
    await waitFor(() => expect(getByText(storyCard.translation)).toBeTruthy());
  });
});
