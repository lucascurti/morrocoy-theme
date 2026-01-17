// ==========================================================================
// OpenCodeThemeBuilder - Generate OpenCode themes from Morrocoy configurations
// ==========================================================================

import { TailwindColor, tailwindColors } from '../generated/tailwindColors';
import { SemanticCodeTheme, SemanticInterfaceTheme } from '../types/themeTypes';

// ==========================================================================
// Types
// ==========================================================================

/**
 * OpenCode theme color value - can be dark/light variants or a single value
 */
interface OpenCodeColorValue {
  dark: string;
  light: string;
}

/**
 * OpenCode theme JSON structure
 */
export interface OpenCodeThemeJSON {
  $schema: string;
  defs: Record<string, string>;
  theme: Record<string, OpenCodeColorValue>;
}

/**
 * Configuration for building an OpenCode theme
 */
export interface OpenCodeThemeConfig {
  dark: {
    interface: SemanticInterfaceTheme;
    code: SemanticCodeTheme;
  };
  light: {
    interface: SemanticInterfaceTheme;
    code: SemanticCodeTheme;
  };
}

// ==========================================================================
// OpenCodeThemeBuilder Class
// ==========================================================================

/**
 * Builds OpenCode-compatible themes from Morrocoy dark and light configurations.
 *
 * OpenCode themes support dark/light variants in a single file, mapping semantic
 * colors to UI elements, diff views, markdown rendering, and syntax highlighting.
 */
export class OpenCodeThemeBuilder {
  private config: OpenCodeThemeConfig;
  private usedColors: Set<TailwindColor> = new Set();

  constructor(config: OpenCodeThemeConfig) {
    this.config = config;
  }

  /**
   * Converts a Tailwind color name to a valid JSON key (removes dots)
   */
  private colorToKey(color: TailwindColor): string {
    return color.replace('.', '');
  }

  /**
   * Resolves a Tailwind color to its hex value
   */
  private resolveColor(color: TailwindColor): string {
    const hex = tailwindColors[color];
    if (!hex) {
      throw new Error(`Unknown Tailwind color: ${color}`);
    }
    return hex;
  }

  /**
   * Tracks a color for inclusion in defs and returns its key
   */
  private trackColor(color: TailwindColor): string {
    this.usedColors.add(color);
    return this.colorToKey(color);
  }

  /**
   * Creates a dark/light color pair from interface or code theme properties
   */
  private createColorPair(darkColor: TailwindColor, lightColor: TailwindColor): OpenCodeColorValue {
    return {
      dark: this.trackColor(darkColor),
      light: this.trackColor(lightColor),
    };
  }

  /**
   * Builds the color definitions (defs) section
   */
  private buildDefs(): Record<string, string> {
    const defs: Record<string, string> = {};

    for (const color of this.usedColors) {
      defs[this.colorToKey(color)] = this.resolveColor(color);
    }

    // Sort keys for consistent output
    const sortedDefs: Record<string, string> = {};
    for (const key of Object.keys(defs).sort()) {
      sortedDefs[key] = defs[key];
    }

    return sortedDefs;
  }

  /**
   * Maps Morrocoy semantic colors to OpenCode theme structure
   */
  private buildTheme(): Record<string, OpenCodeColorValue> {
    const darkInterface = this.config.dark.interface;
    const lightInterface = this.config.light.interface;
    const darkCode = this.config.dark.code;
    const lightCode = this.config.light.code;

    return {
      // =======================================================================
      // UI Colors
      // =======================================================================
      primary: this.createColorPair(darkInterface.accent, lightInterface.accent),
      secondary: this.createColorPair(darkInterface.textSecondary, lightInterface.textSecondary),
      accent: this.createColorPair(darkInterface.accent, lightInterface.accent),
      error: this.createColorPair(darkInterface.error, lightInterface.error),
      warning: this.createColorPair(darkInterface.warning, lightInterface.warning),
      success: this.createColorPair(darkInterface.success, lightInterface.success),
      info: this.createColorPair(darkInterface.info, lightInterface.info),
      text: this.createColorPair(darkInterface.foreground, lightInterface.foreground),
      textMuted: this.createColorPair(darkInterface.textMuted, lightInterface.textMuted),
      background: this.createColorPair(
        darkInterface.backgroundEditor,
        lightInterface.backgroundEditor
      ),
      backgroundPanel: this.createColorPair(
        darkInterface.backgroundSidebar,
        lightInterface.backgroundSidebar
      ),
      backgroundElement: this.createColorPair(
        darkInterface.backgroundActivityBar,
        lightInterface.backgroundActivityBar
      ),
      border: this.createColorPair(darkInterface.border, lightInterface.border),
      borderActive: this.createColorPair(darkInterface.textMuted, lightInterface.textMuted),
      borderSubtle: this.createColorPair(darkInterface.textInactive, lightInterface.textInactive),

      // =======================================================================
      // Diff Colors
      // =======================================================================
      diffAdded: this.createColorPair(darkInterface.success, lightInterface.success),
      diffRemoved: this.createColorPair(darkInterface.error, lightInterface.error),
      diffContext: this.createColorPair(darkInterface.textMuted, lightInterface.textMuted),
      diffHunkHeader: this.createColorPair(darkInterface.textMuted, lightInterface.textMuted),
      diffHighlightAdded: this.createColorPair(darkInterface.success, lightInterface.success),
      diffHighlightRemoved: this.createColorPair(darkInterface.error, lightInterface.error),
      diffAddedBg: this.createColorPair(
        darkInterface.backgroundSidebar,
        lightInterface.backgroundSidebar
      ),
      diffRemovedBg: this.createColorPair(
        darkInterface.backgroundSidebar,
        lightInterface.backgroundSidebar
      ),
      diffContextBg: this.createColorPair(
        darkInterface.backgroundSidebar,
        lightInterface.backgroundSidebar
      ),
      diffLineNumber: this.createColorPair(darkInterface.textInactive, lightInterface.textInactive),
      diffAddedLineNumberBg: this.createColorPair(
        darkInterface.backgroundSidebar,
        lightInterface.backgroundSidebar
      ),
      diffRemovedLineNumberBg: this.createColorPair(
        darkInterface.backgroundSidebar,
        lightInterface.backgroundSidebar
      ),

      // =======================================================================
      // Markdown Colors
      // =======================================================================
      markdownText: this.createColorPair(darkInterface.foreground, lightInterface.foreground),
      markdownHeading: this.createColorPair(darkInterface.accent, lightInterface.accent),
      markdownLink: this.createColorPair(darkInterface.info, lightInterface.info),
      markdownLinkText: this.createColorPair(darkInterface.accent, lightInterface.accent),
      markdownCode: this.createColorPair(darkCode.string, lightCode.string),
      markdownBlockQuote: this.createColorPair(darkInterface.textMuted, lightInterface.textMuted),
      markdownEmph: this.createColorPair(darkInterface.warning, lightInterface.warning),
      markdownStrong: this.createColorPair(darkInterface.modified, lightInterface.modified),
      markdownHorizontalRule: this.createColorPair(
        darkInterface.textInactive,
        lightInterface.textInactive
      ),
      markdownListItem: this.createColorPair(darkInterface.accent, lightInterface.accent),
      markdownListEnumeration: this.createColorPair(darkCode.number, lightCode.number),
      markdownImage: this.createColorPair(darkInterface.info, lightInterface.info),
      markdownImageText: this.createColorPair(darkInterface.accent, lightInterface.accent),
      markdownCodeBlock: this.createColorPair(darkCode.foreground, lightCode.foreground),

      // =======================================================================
      // Syntax Highlighting Colors
      // =======================================================================
      syntaxComment: this.createColorPair(darkCode.comment, lightCode.comment),
      syntaxKeyword: this.createColorPair(darkCode.keyword, lightCode.keyword),
      syntaxFunction: this.createColorPair(darkCode.function, lightCode.function),
      syntaxVariable: this.createColorPair(darkCode.parameter, lightCode.parameter),
      syntaxString: this.createColorPair(darkCode.string, lightCode.string),
      syntaxNumber: this.createColorPair(darkCode.number, lightCode.number),
      syntaxType: this.createColorPair(darkCode.type, lightCode.type),
      syntaxOperator: this.createColorPair(darkCode.punctuation, lightCode.punctuation),
      syntaxPunctuation: this.createColorPair(darkCode.foreground, lightCode.foreground),
    };
  }

  /**
   * Generates the complete OpenCode theme JSON object
   */
  toJSON(): OpenCodeThemeJSON {
    // Build theme first to collect all used colors
    const theme = this.buildTheme();

    // Then build defs from collected colors
    const defs = this.buildDefs();

    return {
      $schema: 'https://opencode.ai/theme.json',
      defs,
      theme,
    };
  }

  /**
   * Generates the OpenCode theme as a formatted JSON string
   */
  toString(): string {
    return JSON.stringify(this.toJSON(), null, 2);
  }
}
