import { Dimensions } from 'react-native';

const BASE_WIDTH = 375;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const scale        = (size) => (SCREEN_WIDTH / BASE_WIDTH) * size;
export const isTablet     = SCREEN_WIDTH >= 768;
export const CARD_MAX_WIDTH = isTablet ? 560 : SCREEN_WIDTH - 32;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };
export const radius  = { sm: 8, md: 16, lg: 24, pill: 100 };

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
};

export function getCategoryColor(category, colors) {
  switch (category) {
    case 'Ayah':   return colors.ayah;
    case 'Hadith': return colors.hadith;
    case 'Story':  return colors.story;
    case 'Dua':    return colors.dua;
    default:       return colors.primary;
  }
}

export function getCategoryLightColor(category, colors) {
  switch (category) {
    case 'Ayah':   return colors.ayahLight;
    case 'Hadith': return colors.hadithLight;
    case 'Story':  return colors.storyLight;
    case 'Dua':    return colors.duaLight;
    default:       return colors.ayahLight;
  }
}

export function getCategoryEmoji(category) {
  switch (category) {
    case 'Ayah':   return '📖';
    case 'Hadith': return '🌙';
    case 'Story':  return '✨';
    case 'Dua':    return '🤲';
    default:       return '📖';
  }
}
