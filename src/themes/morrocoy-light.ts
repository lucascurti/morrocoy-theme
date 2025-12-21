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
      foreground: 'zinc.900',
      textSecondary: 'zinc.700',
      textMuted: 'zinc.400',
      textInactive: 'zinc.300',

      // === Backgrounds ===
      backgroundEditor: 'zinc.50',
      backgroundSidebar: 'zinc.100',
      backgroundActivityBar: 'zinc.200',
      // Hover highlight
      backgroundHover: 'zinc.200',

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
      foreground: 'zinc.600',

      // === Comments ===
      comment: 'zinc.400',

      // === Literals ===
      string: 'lime.700',
      number: 'amber.600',

      // === Operators & Punctuation ===
      punctuation: 'orange.500',

      // === Keywords ===
      keyword: 'purple.400',
      controlFlow: 'rose.400',
      storage: 'rose.400',
      import: 'orange.400',

      // === Types ===
      type: 'amber.500',
      modifier: 'amber.500',
      primitive: 'amber.500',

      // === Functions ===
      function: 'teal.600',
      parameter: 'cyan.600',

      // === Properties ===
      property: 'sky.600',
      attribute: 'purple.400',

      // === Markup ===
      tag: 'rose.400',
    },
  },
};

export const morrocoyLightTheme = new MorrocoyTheme(config);
