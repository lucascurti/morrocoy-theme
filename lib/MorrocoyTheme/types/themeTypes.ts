// ==========================================================================
// Theme Types - Semantic theme configuration for VS Code themes
// ==========================================================================

import { TailwindColor } from '../generated/tailwindColors';

// ==========================================================================
// Interface Theme (VS Code Workbench Colors)
// ==========================================================================

/**
 * VS Code interface/workbench colors.
 * Define your theme using meaningful color roles instead of individual VS Code keys.
 * The TailwindVsCodeTheme class will automatically map these to all ~550 VS Code color keys.
 */
export interface SemanticInterfaceTheme {
  // === Text Colors ===

  /** Primary foreground color for main text content */
  foreground: TailwindColor;

  /** Secondary text for less prominent content (breadcrumbs, descriptions) */
  textSecondary: TailwindColor;

  /** Muted text for low-emphasis content (placeholders, code lens) */
  textMuted: TailwindColor;

  /** Inactive/unfocused text (inactive tabs, unfocused elements) */
  textInactive: TailwindColor;

  // === Background Colors ===

  /** Main editor background */
  backgroundEditor: TailwindColor;

  /** Sidebar and secondary panel backgrounds */
  backgroundSidebar: TailwindColor;

  /** Activity bar and tertiary backgrounds */
  backgroundActivityBar: TailwindColor;

  /** Hover and subtle highlight backgrounds (computed with transparency) */
  backgroundHover: TailwindColor;

  // === Accent & Semantic Colors ===

  /** Primary accent color (focus, active tabs, badges, links) */
  accent: TailwindColor;

  /** Error color (error messages, deleted items, breakpoints) */
  error: TailwindColor;

  /** Warning color (warnings, modified indicators) */
  warning: TailwindColor;

  /** Success color (added items, passed tests, running processes) */
  success: TailwindColor;

  /** Info color (information messages, debug info) */
  info: TailwindColor;

  /** Modified/changed indicator color (git modified) */
  modified: TailwindColor;

  // === Cursor & Selection ===

  /** Cursor color */
  cursor: TailwindColor;

  /** Selection background base (transparency applied internally) */
  selection: TailwindColor;

  // === Bracket Colors (for rainbow brackets) ===

  /** Bracket highlight colors (array of 6 colors for bracket pairs) */
  bracketColors?: [
    TailwindColor,
    TailwindColor,
    TailwindColor,
    TailwindColor,
    TailwindColor,
    TailwindColor,
  ];
}

// ==========================================================================
// Code Theme (Syntax Highlighting Colors)
// ==========================================================================

/**
 * Syntax highlighting colors for code.
 * These colors are automatically mapped to TextMate token scopes and semantic tokens.
 */
export interface SemanticCodeTheme {
  // === Base Text ===

  /** Default text/foreground for variables, identifiers, constants */
  foreground: TailwindColor;

  // === Comments ===

  /** Regular comments */
  comment: TailwindColor;

  // === Literals ===

  /** String literals, regex, headings, inline code */
  string: TailwindColor;

  /** Numeric literals (integers, floats) */
  number: TailwindColor;

  // === Operators & Punctuation ===

  /** Punctuation, operators, brackets, separators */
  punctuation: TailwindColor;

  // === Keywords ===

  /** Keywords, language constants, special methods */
  keyword: TailwindColor;

  /** Control flow keywords (return, if, await) - often bold */
  controlFlow: TailwindColor;

  /** Storage declarations (const, let, function, class) */
  storage: TailwindColor;

  /** Import/export statements */
  import: TailwindColor;

  // === Types & Classes ===

  /** Types, classes, interfaces */
  type: TailwindColor;

  /** Type modifiers (async, as, type keyword) */
  modifier: TailwindColor;

  /** Primitive/built-in types (string, number, boolean) */
  primitive: TailwindColor;

  // === Functions ===

  /** Functions, methods, support functions */
  function: TailwindColor;

  /** Function parameters */
  parameter: TailwindColor;

  // === Properties & Attributes ===

  /** Object properties, keys */
  property: TailwindColor;

  /** HTML/JSX attributes, escape characters */
  attribute: TailwindColor;

  // === Markup ===

  /** HTML/XML tag names */
  tag: TailwindColor;
}

// ==========================================================================
// Combined Theme
// ==========================================================================

/**
 * Complete semantic theme configuration.
 * Combines interface (workbench) colors and code (syntax highlighting) colors.
 */
export interface SemanticTheme {
  /** VS Code interface/workbench colors */
  interface: SemanticInterfaceTheme;

  /** Syntax highlighting colors */
  code: SemanticCodeTheme;
}
