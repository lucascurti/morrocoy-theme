// ==========================================================================
// Morrocoy Dark Theme - Tailwind v4 Edition
// Uses MorrocoyTheme class to generate VS Code theme
// ==========================================================================

import { MorrocoyTheme, MorrocoyThemeConfig } from "../../lib/MorrocoyTheme";

/**
 * Morrocoy Dark theme configuration using Tailwind v4 colors.
 *
 * A dark theme built entirely with Tailwind CSS v4 colors for consistency
 * and easy customization.
 */
const config: MorrocoyThemeConfig = {
  name: "Morrocoy Dark",
  fileName: "morrocoy-dark.json",
  type: "dark",
  semanticHighlighting: true,

  theme: {
    // =========================================================================
    // Interface - VS Code Workbench Colors (Dark Theme)
    // =========================================================================
    interface: {
      // === Text Colors ===
      foreground: "slate.300",
      textSecondary: "slate.200",
      textMuted: "slate.500",
      textInactive: "slate.400",

      // === Backgrounds ===
      backgroundEditor: "sky.950",
      backgroundSidebar: "slate.600",
      backgroundActivityBar: "slate.700",
      backgroundWidget: "slate.700",
      // Hover highlight
      backgroundHover: "slate.600",

      // === Borders ===
      border: "slate.500",
      // Subtle border
      borderSubtle: "slate.500",

      // === Semantic Colors ===
      accent: "sky.300",
      error: "red.400",
      warning: "orange.400",
      success: "green.500",
      info: "blue.500",
      hints: "violet.400",
      modified: "amber.400",

      // === Cursor & Selection ===
      // Cursor color
      cursor: "slate.300",
      selection: "blue.500",
      findMatchBorder: "amber.400",

      // === Bracket Colors ===
      bracketColors: [
        "rose.400",
        "amber.400",
        "green.400",
        "blue.400",
        "violet.400",
        "cyan.400",
      ],
    },

    // =========================================================================
    // Code - Syntax Highlighting Colors
    // =========================================================================
    code: {
      // === Base Text ===
      foreground: "slate.200",

      // === Comments ===
      comment: "slate.500",
      commentDoc: "slate.400",

      // === Literals ===
      string: "lime.500",
      number: "amber.400",

      // === Operators & Punctuation ===
      punctuation: "orange.400",

      // === Keywords ===
      keyword: "purple.300",
      controlFlow: "rose.400",
      storage: "rose.200",
      import: "orange.400",

      // === Types ===
      type: "amber.200",
      modifier: "amber.300",
      primitive: "amber.500",

      // === Functions ===
      function: "teal.400",
      parameter: "sky.300",

      // === Properties ===
      property: "blue.400",
      attribute: "purple.300",

      // === Markup ===
      tag: "rose.400",
      tagPunctuation: "teal.400",

      // === Special ===
      invalid: "rose.500",
      embedded: "purple.300",
      link: "purple.300",
    },
  },

  // Optional overrides for specific VS Code color keys
  colorOverrides: {
    // Use if a specific VS Code key needs a different color than generated
  },

  // Override semantic token colors to match reference theme
  semanticTokenColors: {
    operator: "orange.400",
    memberOperatorOverload: "orange.400",
    operatorOverload: "orange.400",
    interface: "amber.200",
    type: "amber.200",
  },
};

export const morrocoyDarkTheme = new MorrocoyTheme(config);
