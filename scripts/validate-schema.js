// Validation rules for auto-generated Noor content cards.
// Pure Node, no external dependencies.

const CATEGORIES = ['Ayah', 'Hadith', 'Story', 'Dua'];
const SOURCE_TYPES = ['Quran', 'Hadith', 'Story', 'Dua'];

const REQUIRED_FIELDS = [
  'id',
  'category',
  'arabic',
  'transliteration',
  'translation',
  'explanation',
  'source',
  'sourceType',
  'tag',
];

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validate a single card against the Noor content schema.
 * @param {object} card
 * @param {Set<string>} existingIds - ids that must not be reused
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateCard(card, existingIds) {
  const errors = [];

  if (!card || typeof card !== 'object' || Array.isArray(card)) {
    return { valid: false, errors: ['Card is not an object'] };
  }

  for (const field of REQUIRED_FIELDS) {
    if (!(field in card)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Without the required fields, further checks aren't meaningful.
  if (errors.length > 0) {
    return { valid: false, errors };
  }

  if (!isNonEmptyString(card.id)) {
    errors.push('id must be a non-empty string');
  } else if (existingIds && existingIds.has(card.id)) {
    errors.push(`Duplicate id (already used): ${card.id}`);
  }

  if (!CATEGORIES.includes(card.category)) {
    errors.push(`category must be one of ${CATEGORIES.join(', ')} (got "${card.category}")`);
  }

  if (!SOURCE_TYPES.includes(card.sourceType)) {
    errors.push(`sourceType must be one of ${SOURCE_TYPES.join(', ')} (got "${card.sourceType}")`);
  }

  if (card.category === 'Story') {
    // Story headlines use the translation field as the title; arabic/transliteration may be null.
    if (card.arabic !== null && !isNonEmptyString(card.arabic)) {
      errors.push('arabic must be null or a non-empty string for Story cards');
    }
    if (card.transliteration !== null && !isNonEmptyString(card.transliteration)) {
      errors.push('transliteration must be null or a non-empty string for Story cards');
    }
  } else {
    if (!isNonEmptyString(card.arabic)) {
      errors.push(`arabic must be a non-empty string for category "${card.category}"`);
    }
    if (!isNonEmptyString(card.transliteration)) {
      errors.push(`transliteration must be a non-empty string for category "${card.category}"`);
    }
  }

  for (const field of ['translation', 'explanation', 'source', 'tag']) {
    if (!isNonEmptyString(card[field])) {
      errors.push(`${field} must be a non-empty string`);
    }
  }

  if (isNonEmptyString(card.id) && isNonEmptyString(card.category)) {
    const categoryLower = card.category.toLowerCase();
    const idPattern = new RegExp(`^${categoryLower}_[a-z0-9_]+$`);
    if (!idPattern.test(card.id)) {
      errors.push(
        `id "${card.id}" must follow the pattern ${categoryLower}_{descriptor} (lowercase letters, digits, underscores)`
      );
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate a batch of cards, splitting them into valid and dropped sets.
 * @param {object[]} cards
 * @param {Set<string>} existingIds - ids already present in content.js
 * @returns {{ validCards: object[], droppedCards: { card: object, errors: string[] }[], errors: string[] }}
 */
function validateBatch(cards, existingIds) {
  const validCards = [];
  const droppedCards = [];
  const errors = [];

  if (!Array.isArray(cards)) {
    return { validCards, droppedCards, errors: ['Batch is not an array of cards'] };
  }

  const idsSoFar = new Set(existingIds);

  for (const card of cards) {
    const result = validateCard(card, idsSoFar);

    if (result.valid) {
      validCards.push(card);
      idsSoFar.add(card.id);
    } else {
      droppedCards.push({ card, errors: result.errors });
      const idLabel = card && isNonEmptyString(card.id) ? card.id : '(missing id)';
      errors.push(`Card "${idLabel}": ${result.errors.join('; ')}`);
    }
  }

  return { validCards, droppedCards, errors };
}

module.exports = {
  CATEGORIES,
  SOURCE_TYPES,
  validateCard,
  validateBatch,
};
