import React from 'react';
import { render } from '@testing-library/react-native';
import SettingsScreen from '../src/screens/SettingsScreen';

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
      ayah: '#1B5E20', ayahLight: '#E8F5E9',
      hadith: '#1A237E', hadithLight: '#E8EAF6',
      story: '#4A148C', storyLight: '#F3E5F5',
      dua: '#B71C1C', duaLight: '#FFEBEE',
    },
    isDark: false,
  }),
}));

describe('SettingsScreen', () => {
  let getByText, queryByText, getAllByText;
  beforeEach(() => {
    const result = render(<SettingsScreen />);
    getByText   = result.getByText;
    queryByText = result.queryByText;
    getAllByText = result.getAllByText;
  });

  // ── Hero ─────────────────────────────────────────────────────────────────

  it('renders Arabic نور', () => {
    expect(getByText('نور')).toBeTruthy();
  });

  it('renders title "Noor · Islamic Dawah"', () => {
    expect(getByText('Noor · Islamic Dawah')).toBeTruthy();
  });

  it('renders subtitle tagline', () => {
    expect(getByText(/Short, powerful Islamic reminders/i)).toBeTruthy();
  });

  // ── Content Library ───────────────────────────────────────────────────────

  it('renders CONTENT LIBRARY section label', () => {
    expect(getByText('CONTENT LIBRARY')).toBeTruthy();
  });

  it('renders Ayah count 95', () => {
    expect(getByText('95')).toBeTruthy();
  });

  it('renders Hadith count 73', () => {
    expect(getByText('73')).toBeTruthy();
  });

  it('renders Story count 20', () => {
    expect(getByText('20')).toBeTruthy();
  });

  it('renders Dua count 34', () => {
    expect(getByText('34')).toBeTruthy();
  });

  it('renders category plural labels (e.g. Ayahs, Hadiths)', () => {
    expect(getByText('Ayahs')).toBeTruthy();
    expect(getByText('Hadiths')).toBeTruthy();
    expect(getByText('Storys')).toBeTruthy(); // rendered as `${cat}s`
    expect(getByText('Duas')).toBeTruthy();
  });

  // ── How to Use ────────────────────────────────────────────────────────────

  it('renders HOW TO USE section label', () => {
    expect(getByText('HOW TO USE')).toBeTruthy();
  });

  it('renders swipe up instruction', () => {
    expect(getByText('Swipe UP to move to the next card')).toBeTruthy();
  });

  it('renders swipe down instruction', () => {
    expect(getByText('Swipe DOWN to go back to the previous card')).toBeTruthy();
  });

  it('renders all 7 how-to items', () => {
    // The HOW_TO_USE array has 7 entries each with an icon emoji
    const icons = ['👆', '👇', '🤍', '↗', '☪️', '↺', '☀️'];
    icons.forEach((icon) => {
      expect(getByText(icon)).toBeTruthy();
    });
  });

  // ── Disclaimer ────────────────────────────────────────────────────────────

  it('renders DISCLAIMER section label', () => {
    expect(getByText('DISCLAIMER')).toBeTruthy();
  });

  it('renders disclaimer content about Quranic verses', () => {
    expect(getByText(/All Quranic verses are referenced/i)).toBeTruthy();
  });

  // ── Version ───────────────────────────────────────────────────────────────

  it('renders version string', () => {
    expect(getByText(/Noor v1\.0\.0/i)).toBeTruthy();
  });
});
