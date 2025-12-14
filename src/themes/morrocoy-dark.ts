// ==========================================================================
// Morrocoy Dark Theme - Tailwind v4 Edition
// Uses MorrocoyTheme class to generate VS Code theme
// ==========================================================================

import { MorrocoyTheme, MorrocoyThemeConfig } from '../../lib/MorrocoyTheme';

/**
 * Morrocoy Dark theme configuration using Tailwind v4 colors.
 *
 * A dark theme built entirely with Tailwind CSS v4 colors for consistency
 * and easy customization.
 */
const config: MorrocoyThemeConfig = {
  name: 'Morrocoy Dark',
  fileName: 'morrocoy-dark.json',
  type: 'dark',

  theme: {
    // =========================================================================
    // Interface - VS Code Workbench Colors (Dark Theme)
    // =========================================================================
    interface: {
      // === Text Colors ===
      foreground: 'slate.300',
      textSecondary: 'slate.200',
      textMuted: 'slate.500',
      textInactive: 'slate.400',

      // === Backgrounds ===
      backgroundEditor: 'sky.950',
      backgroundSidebar: 'slate.600',
      backgroundActivityBar: 'slate.700',
      // Hover highlight
      backgroundHover: 'slate.600',

      // === Semantic Colors ===
      accent: 'sky.300',
      error: 'red.400',
      warning: 'orange.400',
      success: 'green.600',
      info: 'blue.500',
      modified: 'amber.500',

      // === Cursor & Selection ===
      // Cursor color
      cursor: 'slate.300',
      selection: 'blue.500',

      // === Bracket Colors ===
      bracketColors: ['rose.400', 'amber.400', 'green.400', 'blue.400', 'violet.400', 'cyan.400'],
    },

    // =========================================================================
    // Code - Syntax Highlighting Colors
    // =========================================================================
    code: {
      // === Base Text ===
      foreground: 'slate.200',

      // === Comments ===
      comment: 'slate.500',

      // === Literals ===
      string: 'lime.500',
      number: 'amber.400',

      // === Operators & Punctuation ===
      punctuation: 'orange.400',

      // === Keywords ===
      keyword: 'purple.300',
      controlFlow: 'rose.400',
      storage: 'rose.200',
      import: 'orange.400',

      // === Types ===
      type: 'amber.200',
      modifier: 'amber.300',
      primitive: 'amber.200',

      // === Functions ===
      function: 'teal.400',
      parameter: 'sky.300',

      // === Properties ===
      property: 'blue.400',
      attribute: 'purple.300',

      // === Markup ===
      tag: 'rose.400',
    },
  },
};

export const morrocoyDarkTheme = new MorrocoyTheme(config);
