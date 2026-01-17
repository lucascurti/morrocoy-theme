import { describe, expect, it } from 'vitest';

import { tailwindColors } from '../lib/MorrocoyTheme/generated/tailwindColors';
import { MorrocoyTheme, MorrocoyThemeConfig } from '../lib/MorrocoyTheme/MorrocoyTheme';
import { OPACITY } from '../lib/MorrocoyTheme/resources/themeColorMapper';
import {
  SemanticCodeTheme,
  SemanticInterfaceTheme,
  SemanticTheme,
} from '../lib/MorrocoyTheme/types/themeTypes';

/**
 * Helper to create a minimal valid interface theme for testing.
 */
function createMinimalInterfaceTheme(): SemanticInterfaceTheme {
  return {
    foreground: 'stone.800',
    textSecondary: 'stone.500',
    textMuted: 'stone.400',
    textInactive: 'stone.400',
    border: 'stone.400',
    backgroundEditor: 'stone.50',
    backgroundSidebar: 'stone.100',
    backgroundActivityBar: 'stone.200',
    backgroundHover: 'stone.800',
    accent: 'pink.600',
    error: 'pink.600',
    warning: 'orange.600',
    success: 'teal.700',
    info: 'blue.700',
    modified: 'amber.700',
    cursor: 'stone.800',
    selection: 'stone.500',
  };
}

/**
 * Helper to create a minimal valid code theme for testing.
 */
function createMinimalCodeTheme(): SemanticCodeTheme {
  return {
    foreground: 'stone.200',
    comment: 'stone.500',
    string: 'teal.400',
    number: 'amber.400',
    punctuation: 'orange.400',
    keyword: 'pink.500',
    controlFlow: 'rose.400',
    storage: 'pink.300',
    import: 'orange.500',
    type: 'blue.500',
    modifier: 'amber.300',
    primitive: 'amber.500',
    function: 'teal.500',
    parameter: 'blue.300',
    property: 'blue.400',
    attribute: 'pink.400',
    tag: 'rose.400',
  };
}

/**
 * Helper to create a minimal valid semantic theme for testing.
 */
function _createMinimalTheme(): SemanticTheme {
  return {
    interface: createMinimalInterfaceTheme(),
    code: createMinimalCodeTheme(),
  };
}

/**
 * Helper to create a MorrocoyTheme with minimal config.
 */
function createTheme(
  interfaceOverrides?: Partial<SemanticInterfaceTheme>,
  codeOverrides?: Partial<SemanticCodeTheme>,
  configOverrides?: Partial<MorrocoyThemeConfig>
): MorrocoyTheme {
  const config: MorrocoyThemeConfig = {
    name: 'Test Theme',
    fileName: 'test-theme.json',
    type: 'dark',
    theme: {
      interface: { ...createMinimalInterfaceTheme(), ...interfaceOverrides },
      code: { ...createMinimalCodeTheme(), ...codeOverrides },
    },
    ...configOverrides,
  };
  return new MorrocoyTheme(config);
}

describe('MorrocoyTheme', () => {
  describe('constructor', () => {
    it('should create a theme with valid config', () => {
      const theme = createTheme();
      expect(theme.name).toBe('Test Theme');
      expect(theme.fileName).toBe('test-theme.json');
    });

    it('should throw error for unknown Tailwind color in interface theme', () => {
      expect(() => createTheme({ foreground: 'invalid.color' as any })).toThrow(
        /Unknown Tailwind color "invalid.color"/
      );
    });

    it('should throw error for unknown Tailwind color in code theme', () => {
      expect(() => createTheme(undefined, { comment: 'invalid.color' as any })).toThrow(
        /Unknown Tailwind color "invalid.color"/
      );
    });

    it('should throw error for unknown Tailwind color in colorOverrides', () => {
      expect(() =>
        createTheme(undefined, undefined, {
          colorOverrides: {
            'activityBar.activeBorder': 'invalid.color' as any,
          },
        })
      ).toThrow(/Unknown Tailwind color "invalid.color"/);
    });
  });

  describe('toJSON', () => {
    it('should generate valid VS Code theme JSON structure', () => {
      const theme = createTheme(undefined, undefined, {
        semanticTokenColors: {
          operator: 'orange.400',
          interface: 'amber.200',
        },
      });

      const json = theme.toJSON();

      // Check structure
      expect(json.$schema).toBe('vscode://schemas/color-theme');
      expect(json.name).toBe('Test Theme');
      expect(json.semanticHighlighting).toBe(true);

      // Check semantic token colors are resolved to hex (overrides applied)
      expect(json.semanticTokenColors.operator).toBe(tailwindColors['orange.400']);
      expect(json.semanticTokenColors.interface).toBe(tailwindColors['amber.200']);

      // Check colors are generated from interface theme
      expect(json.colors['foreground']).toBe(tailwindColors['stone.800']);
      expect(json.colors['editor.background']).toBe(tailwindColors['stone.50']);
      expect(json.colors['sideBar.background']).toBe(tailwindColors['stone.100']);

      // Check token colors are generated from code theme
      expect(json.tokenColors.length).toBeGreaterThan(0);

      // Find Comments token
      const commentsToken = json.tokenColors.find((t) => t.name === 'Comments');
      expect(commentsToken).toBeDefined();
      expect(commentsToken?.settings.foreground).toBe(tailwindColors['stone.500']);
    });

    it('should apply colorOverrides over generated colors', () => {
      const theme = createTheme(undefined, undefined, {
        colorOverrides: {
          'activityBar.activeBorder': 'blue.500',
          'badge.background': 'red.500',
        },
      });

      const json = theme.toJSON();

      // Check that overrides are applied
      expect(json.colors['activityBar.activeBorder']).toBe(tailwindColors['blue.500']);
      expect(json.colors['badge.background']).toBe(tailwindColors['red.500']);
    });

    it('should default semanticHighlighting to true', () => {
      const theme = createTheme();
      const json = theme.toJSON();

      expect(json.semanticHighlighting).toBe(true);
    });

    it('should generate semantic token colors from code theme', () => {
      const theme = createTheme();
      const json = theme.toJSON();

      // Generated from code theme (operator uses import color)
      expect(json.semanticTokenColors.operator).toBe(tailwindColors['orange.500']); // import
      expect(json.semanticTokenColors.type).toBe(tailwindColors['blue.500']);
      expect(json.semanticTokenColors.interface).toBe(tailwindColors['blue.500']);
    });

    it('should generate all major color categories', () => {
      const theme = createTheme();
      const json = theme.toJSON();

      // Activity Bar
      expect(json.colors['activityBar.background']).toBeDefined();
      expect(json.colors['activityBar.foreground']).toBeDefined();
      expect(json.colors['activityBarBadge.background']).toBeDefined();

      // Editor
      expect(json.colors['editor.background']).toBeDefined();
      expect(json.colors['editor.foreground']).toBeDefined();
      expect(json.colors['editor.selectionBackground']).toBeDefined();

      // Sidebar
      expect(json.colors['sideBar.background']).toBeDefined();
      expect(json.colors['sideBar.foreground']).toBeDefined();

      // Tabs
      expect(json.colors['tab.activeBackground']).toBeDefined();
      expect(json.colors['tab.activeForeground']).toBeDefined();

      // Terminal
      expect(json.colors['terminal.background']).toBeDefined();
      expect(json.colors['terminal.foreground']).toBeDefined();

      // Git decorations
      expect(json.colors['gitDecoration.addedResourceForeground']).toBeDefined();
      expect(json.colors['gitDecoration.deletedResourceForeground']).toBeDefined();
      expect(json.colors['gitDecoration.modifiedResourceForeground']).toBeDefined();
    });

    it('should apply transparency to selection and hover colors', () => {
      const theme = createTheme();
      const json = theme.toJSON();

      // Selection should have transparency
      const selectionBg = json.colors['editor.selectionBackground'];
      expect(selectionBg).toMatch(/^#[0-9a-f]{6}[0-9a-f]{2}$/i);
      expect(selectionBg!.endsWith(OPACITY[65])).toBe(true);

      // Line highlight should have subtle transparency
      const lineHighlight = json.colors['editor.lineHighlightBackground'];
      expect(lineHighlight).toMatch(/^#[0-9a-f]{6}[0-9a-f]{2}$/i);
      expect(lineHighlight!.endsWith(OPACITY[35])).toBe(true);
    });

    it('should use semantic interface colors correctly', () => {
      const theme = createTheme();
      const json = theme.toJSON();

      // Error color
      expect(json.colors['editorError.foreground']).toBe(tailwindColors['pink.600']);
      expect(json.colors['list.errorForeground']).toBe(tailwindColors['pink.600']);

      // Warning color
      expect(json.colors['editorWarning.foreground']).toBe(tailwindColors['orange.600']);

      // Success color
      expect(json.colors['gitDecoration.addedResourceForeground']).toBe(
        tailwindColors['teal.700'] + OPACITY[65]
      );

      // Info color
      expect(json.colors['editorInfo.foreground']).toBe(tailwindColors['blue.700']);
    });

    it('should generate bracket colors from interface theme', () => {
      const theme = createTheme({
        bracketColors: [
          'pink.600',
          'orange.600',
          'amber.700',
          'teal.700',
          'blue.700',
          'violet.700',
        ],
      });
      const json = theme.toJSON();

      expect(json.colors['editorBracketHighlight.foreground1']).toBe(tailwindColors['pink.600']);
      expect(json.colors['editorBracketHighlight.foreground2']).toBe(tailwindColors['orange.600']);
      expect(json.colors['editorBracketHighlight.foreground3']).toBe(tailwindColors['amber.700']);
      expect(json.colors['editorBracketHighlight.foreground4']).toBe(tailwindColors['teal.700']);
      expect(json.colors['editorBracketHighlight.foreground5']).toBe(tailwindColors['blue.700']);
      expect(json.colors['editorBracketHighlight.foreground6']).toBe(tailwindColors['violet.700']);
    });

    it('should use default bracket colors when not provided', () => {
      const theme = createTheme();
      const json = theme.toJSON();

      // Should fallback to semantic colors
      expect(json.colors['editorBracketHighlight.foreground1']).toBe(tailwindColors['pink.600']); // accent
      expect(json.colors['editorBracketHighlight.foreground2']).toBe(tailwindColors['orange.600']); // warning
    });

    it('should generate all expected token colors from code theme', () => {
      const theme = createTheme();
      const json = theme.toJSON();

      // Check for key token categories
      const tokenNames = json.tokenColors.map((t) => t.name);

      expect(tokenNames).toContain('Comments');
      expect(tokenNames).toContain('Keywords');
      expect(tokenNames).toContain('Variables');
      expect(tokenNames).toContain('Functions');
      expect(tokenNames).toContain('Classes');
      expect(tokenNames).toContain('Strings, Inherited Class');
      expect(tokenNames).toContain('Integers');
      expect(tokenNames).toContain('Object Properties');
      expect(tokenNames).toContain('Variable Parameter');
      expect(tokenNames).toContain('Imports and Exports');
    });
  });

  describe('toString', () => {
    it('should generate formatted JSON string', () => {
      const theme = createTheme();
      const jsonString = theme.toString();

      expect(jsonString).toContain('"name": "Test Theme"');
      expect(jsonString).toContain('"foreground"');
      // Should be formatted with 2-space indent
      expect(jsonString).toMatch(/^\{\n {2}/);
    });

    it('should generate minified JSON when pretty=false', () => {
      const theme = createTheme();
      const jsonString = theme.toString(false);

      expect(jsonString).not.toContain('\n');
    });
  });
});

describe('OPACITY constants', () => {
  it('should have all expected opacity levels', () => {
    expect(OPACITY[5]).toBe('0c');
    expect(OPACITY[10]).toBe('19');
    expect(OPACITY[15]).toBe('26');
    expect(OPACITY[35]).toBe('59');
    expect(OPACITY[50]).toBe('7f');
    expect(OPACITY[65]).toBe('a5');
    expect(OPACITY[75]).toBe('bf');
  });
});

describe('tailwindColors', () => {
  it('should have all expected color families', () => {
    const families = [
      'red',
      'orange',
      'amber',
      'yellow',
      'lime',
      'green',
      'emerald',
      'teal',
      'cyan',
      'sky',
      'blue',
      'indigo',
      'violet',
      'purple',
      'fuchsia',
      'pink',
      'rose',
      'slate',
      'gray',
      'zinc',
      'neutral',
      'stone',
    ];

    const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

    for (const family of families) {
      for (const shade of shades) {
        const key = `${family}.${shade}`;
        expect(tailwindColors).toHaveProperty(key);
        expect(tailwindColors[key as keyof typeof tailwindColors]).toMatch(/^#[0-9a-f]{6}$/i);
      }
    }
  });

  it('should have special colors', () => {
    expect(tailwindColors).toHaveProperty('black');
    expect(tailwindColors).toHaveProperty('white');
    expect(tailwindColors).toHaveProperty('transparent');
  });
});
