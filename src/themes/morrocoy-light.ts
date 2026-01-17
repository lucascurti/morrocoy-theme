// ==========================================================================
// Morrocoy Light Theme - Tailwind v4 Edition
// Uses MorrocoyTheme class to generate VS Code theme
// ==========================================================================

import { MorrocoyTheme, MorrocoyThemeConfig } from '../../lib/MorrocoyTheme';

/**
 * Morrocoy Light theme configuration using Tailwind v4 colors.
 *
 * A light theme built entirely with Tailwind CSS v4 colors for consistency
 * and easy customization.
 */
const config: MorrocoyThemeConfig = {
  name: 'Morrocoy Light',
  fileName: 'morrocoy-light.json',
  type: 'light',

  theme: {
    // =========================================================================
    // Interface - VS Code Workbench Colors (Light Theme)
    // =========================================================================
    interface: {
      // === Text Colors ===
      foreground: 'gray.900',
      textSecondary: 'gray.700',
      textMuted: 'gray.500',
      textInactive: 'gray.400',

      // === Backgrounds ===
      backgroundEditor: 'gray.100',
      backgroundSidebar: 'gray.200',
      backgroundActivityBar: 'gray.300',
      // Hover highlight
      backgroundHover: 'zinc.200',
      border: 'zinc.300',

      // === Semantic Colors ===
      accent: 'sky.600',
      error: 'red.400',
      warning: 'orange.400',
      success: 'green.600',
      info: 'blue.500',
      modified: 'amber.500',

      // === Cursor & Selection ===
      // Cursor color
      cursor: 'zinc.600',
      selection: 'blue.500',

      // === Bracket Colors ===
      bracketColors: ['rose.600', 'amber.600', 'green.600', 'blue.600', 'violet.600', 'cyan.600'],
    },

    // =========================================================================
    // Code - Syntax Highlighting Colors
    // =========================================================================
    code: {
      // === Base Text ===
      foreground: 'gray.600',

      // === Comments ===
      comment: 'zinc.400',

      // === Literals ===
      string: 'lime.700',
      number: 'amber.600',

      // === Operators & Punctuation ===
      punctuation: 'orange.500',

      // === Keywords ===
      keyword: 'purple.600',
      controlFlow: 'rose.400',
      storage: 'rose.400',
      import: 'orange.500',

      // === Types ===
      type: 'amber.600',
      modifier: 'amber.500',
      primitive: 'amber.500',

      // === Functions ===
      function: 'teal.600',
      parameter: 'cyan.600',

      // === Properties ===
      property: 'sky.600',
      attribute: 'purple.500',

      // === Markup ===
      tag: 'rose.400',
    },
  },
};

export const morrocoyLightTheme = new MorrocoyTheme(config);
