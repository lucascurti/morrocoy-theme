// ==========================================================================
// MorrocoyTheme - Public API
// Type-safe VS Code theme builder using Tailwind colors
// ==========================================================================

// Main class and types
export {
  MorrocoyTheme,
  createTheme,
  type MorrocoyThemeConfig,
  type ThemeType,
  type VSCodeThemeJSON,
  type VSCodeColors,
  type FontStyle,
} from './MorrocoyTheme';

// Semantic theme types
export {
  type SemanticTheme,
  type SemanticInterfaceTheme,
  type SemanticCodeTheme,
} from './types/themeTypes';

// Opacity constants for transparency calculations
export { OPACITY } from './resources/themeColorMapper';

// Tailwind colors
export { tailwindColors, type TailwindColor } from './generated/tailwindColors';

// VS Code color key types
export { type VSCodeColorKey } from './generated/vscodeColorTypes';

// TextMate scope types
export { type TextMateScope } from './generated/textMateScopeTypes';

// Semantic token types
export { type SemanticTokenSelector } from './generated/semanticTokenTypes';
