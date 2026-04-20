import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CategoryBar from '../src/components/CategoryBar';
import { CATEGORIES } from '../src/data/content';

// Provide a fixed theme so tests don't depend on AsyncStorage
jest.mock('../src/context/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      primary: '#0D5016',
      bg: '#F6F4EE',
      border: '#E8E4DA',
      textMid: '#555555',
      ayah: '#1B5E20', ayahLight: '#E8F5E9',
      hadith: '#1A237E', hadithLight: '#E8EAF6',
      story: '#4A148C', storyLight: '#F3E5F5',
      dua: '#B71C1C', duaLight: '#FFEBEE',
    },
    isDark: false,
  }),
}));

describe('CategoryBar', () => {
  const onSelect = jest.fn();

  beforeEach(() => onSelect.mockClear());

  it('renders a chip for every CATEGORY', () => {
    const { getByText } = render(
      <CategoryBar selected="All" onSelect={onSelect} />
    );
    CATEGORIES.forEach((cat) => {
      expect(getByText(cat)).toBeTruthy();
    });
  });

  it('calls onSelect with the tapped category', () => {
    const { getByText } = render(
      <CategoryBar selected="All" onSelect={onSelect} />
    );
    fireEvent.press(getByText('Ayah'));
    expect(onSelect).toHaveBeenCalledWith('Ayah');
  });

  it('calls onSelect with "All" when All chip is pressed', () => {
    const { getByText } = render(
      <CategoryBar selected="Ayah" onSelect={onSelect} />
    );
    fireEvent.press(getByText('All'));
    expect(onSelect).toHaveBeenCalledWith('All');
  });

  it('calls onSelect with the correct category for each chip', () => {
    const { getByText } = render(
      <CategoryBar selected="All" onSelect={onSelect} />
    );
    ['Story', 'Hadith', 'Dua'].forEach((cat) => {
      fireEvent.press(getByText(cat));
      expect(onSelect).toHaveBeenCalledWith(cat);
    });
  });

  it('renders the ☪️ emoji on the All chip', () => {
    const { getByText } = render(
      <CategoryBar selected="All" onSelect={onSelect} />
    );
    expect(getByText('☪️')).toBeTruthy();
  });

  it('renders category-specific emojis', () => {
    const { getByText } = render(
      <CategoryBar selected="All" onSelect={onSelect} />
    );
    expect(getByText('📖')).toBeTruthy(); // Ayah
    expect(getByText('🌙')).toBeTruthy(); // Hadith
    expect(getByText('✨')).toBeTruthy(); // Story
    expect(getByText('🤲')).toBeTruthy(); // Dua
  });
});
