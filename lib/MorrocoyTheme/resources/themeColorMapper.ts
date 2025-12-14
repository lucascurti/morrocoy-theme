// ==========================================================================
// Theme Color Mapper - Opacity constants for transparency calculations
// ==========================================================================

/**
 * Transparency hex suffixes for creating semi-transparent colors.
 * These are appended to hex colors to create RGBA values.
 */
export const OPACITY = {
  /** 5% - Hover backgrounds, fold backgrounds, subtle highlights */
  5: '0c',
  /** 10% - Diff backgrounds, merge content backgrounds */
  10: '19',
  /** 15% - Selection, find match, word highlight */
  15: '26',
  /** 35% - Active scrollbar */
  35: '59',
  /** 50% - Notebook cell editor */
  50: '7f',
  /** 65% - Minimap highlights, unnecessary code */
  65: 'a5',
  /** 75% - Drop backgrounds */
  75: 'bf',
} as const;
