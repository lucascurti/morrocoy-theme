// ==========================================================================
// MorrocoyTheme - Type-safe VS Code theme builder using Tailwind colors
// ==========================================================================

import { SemanticTokenSelector } from './generated/semanticTokenTypes';
import { TailwindColor, tailwindColors } from './generated/tailwindColors';
import { TextMateScope } from './generated/textMateScopeTypes';
import { VSCodeColorKey } from './generated/vscodeColorTypes';
import { OPACITY } from './resources/themeColorMapper';
import { SemanticTheme } from './types/themeTypes';

// ==========================================================================
// Types
// ==========================================================================

/**
 * A record type that provides autocomplete for known keys while accepting any string.
 * Uses optional known keys + index signature pattern.
 */
export type VSCodeColors = {
  [K in VSCodeColorKey]?: string;
} & {
  [key: string]: string;
};

/**
 * Font style options for token colors.
 */
export type FontStyle =
  | ''
  | 'italic'
  | 'bold'
  | 'underline'
  | 'strikethrough'
  | 'italic bold'
  | 'italic underline'
  | 'italic strikethrough'
  | 'bold underline'
  | 'bold strikethrough'
  | 'underline strikethrough'
  | 'italic bold underline'
  | 'italic bold strikethrough'
  | 'italic underline strikethrough'
  | 'bold underline strikethrough'
  | 'italic bold underline strikethrough';

/**
 * Token color settings with Tailwind color references.
 */
export interface MorrocoyTokenColorSettings {
  foreground?: TailwindColor;
  background?: TailwindColor;
  fontStyle?: FontStyle;
}

/**
 * A token color rule for syntax highlighting using Tailwind colors.
 */
export interface MorrocoyTokenColorRule {
  name?: string;
  scope: TextMateScope | TextMateScope[] | (string & {}) | string[];
  settings: MorrocoyTokenColorSettings;
}

/**
 * Theme type for VS Code uiTheme configuration.
 */
export type ThemeType = 'light' | 'dark';

/**
 * Configuration for a Tailwind-based VS Code theme.
 */
export interface MorrocoyThemeConfig {
  /** Theme display name */
  name: string;

  /** Output filename for the theme JSON */
  fileName: string;

  /** Theme type: 'light' or 'dark' - determines VS Code's uiTheme setting */
  type: ThemeType;

  /**
   * Semantic theme configuration.
   * Contains `interface` for workbench colors and `code` for syntax highlighting.
   */
  theme: SemanticTheme;

  /**
   * Optional color overrides for specific VS Code color keys.
   * Use this to fine-tune individual colors that differ from the generated values.
   */
  colorOverrides?: Partial<Record<VSCodeColorKey | (string & {}), TailwindColor>>;

  /**
   * Optional overrides for semantic token colors.
   * These override the generated values from theme.code.
   */
  semanticTokenColors?: Partial<Record<SemanticTokenSelector, TailwindColor>>;
}

/**
 * VS Code theme JSON structure.
 */
export interface VSCodeThemeJSON {
  $schema: string;
  name: string;
  semanticHighlighting: boolean;
  semanticTokenColors: Record<string, string>;
  colors: VSCodeColors;
  tokenColors: Array<{
    name?: string;
    scope: string | string[];
    settings: {
      foreground?: string;
      background?: string;
      fontStyle?: string;
    };
  }>;
}

// ==========================================================================
// MorrocoyTheme Class
// ==========================================================================

export class MorrocoyTheme {
  private config: MorrocoyThemeConfig;

  constructor(config: MorrocoyThemeConfig) {
    this.config = config;
    this.validateConfig();
  }

  /**
   * Validates the theme configuration.
   */
  private validateConfig(): void {
    // Validate interface colors
    const interfaceColors = Object.values(this.config.theme.interface).flat();
    for (const color of interfaceColors) {
      if (typeof color === 'string' && color && !tailwindColors[color as TailwindColor]) {
        throw new Error(
          `Unknown Tailwind color "${color}" in theme.interface configuration. ` +
            `Check that it exists in tailwindColors.`
        );
      }
    }

    // Validate code colors
    const codeColors = Object.values(this.config.theme.code).flat();
    for (const color of codeColors) {
      if (typeof color === 'string' && color && !tailwindColors[color as TailwindColor]) {
        throw new Error(
          `Unknown Tailwind color "${color}" in theme.code configuration. ` +
            `Check that it exists in tailwindColors.`
        );
      }
    }

    // Validate color overrides
    if (this.config.colorOverrides) {
      for (const [key, color] of Object.entries(this.config.colorOverrides)) {
        if (color && !tailwindColors[color]) {
          throw new Error(
            `Unknown Tailwind color "${color}" for override key "${key}". ` +
              `Check that it exists in tailwindColors.`
          );
        }
      }
    }
  }

  /**
   * Resolves a Tailwind color to its hex value.
   */
  private resolveColor(color: TailwindColor): string {
    const hex = tailwindColors[color];
    if (!hex) {
      throw new Error(`Unknown Tailwind color: ${color}`);
    }
    return hex;
  }

  /**
   * Maps the semantic interface theme to all VS Code workbench color keys.
   * This generates ~550 color mappings from ~25 semantic theme properties.
   */
  private mapThemeToVSCodeColors(): VSCodeColors {
    const theme = this.config.theme.interface;

    // Resolve all theme colors to hex values
    const textPrimary = this.resolveColor(theme.foreground);
    const textSecondary = this.resolveColor(theme.textSecondary);
    const textMuted = this.resolveColor(theme.textMuted);
    const textInactive = this.resolveColor(theme.textInactive);

    const bgEditor = this.resolveColor(theme.backgroundEditor);
    const bgSidebar = this.resolveColor(theme.backgroundSidebar);
    const bgActivityBar = this.resolveColor(theme.backgroundActivityBar);

    const border = this.resolveColor(theme.textMuted);

    const accent = this.resolveColor(theme.accent);
    const error = this.resolveColor(theme.error);
    const warning = this.resolveColor(theme.warning);
    const success = this.resolveColor(theme.success);
    const info = this.resolveColor(theme.info);
    const modified = this.resolveColor(theme.modified);

    const cursor = this.resolveColor(theme.cursor);

    // Bracket colors (default to semantic colors if not provided)
    const brackets = theme.bracketColors
      ? theme.bracketColors.map((c) => this.resolveColor(c))
      : [accent, warning, modified, success, info, accent];

    // Transparent color
    const transparent = '#00000000';

    const accentBackground = accent + OPACITY[35];
    const accentBackgroundLight = accent + OPACITY[10];
    const diffEditorInsertedBg = success + OPACITY[10];
    const diffEditorRemovedBg = error + OPACITY[10];

    return {
      // Activity Bar
      'activityBar.activeFocusBorder': accent,
      'activityBar.activeBackground': accentBackground,
      'activityBar.background': bgActivityBar,
      'activityBar.border': border,
      'activityBar.foreground': textSecondary,
      'activityBar.inactiveForeground': textInactive,
      'activityBarBadge.background': accent,
      'activityBarBadge.foreground': bgEditor,
      'activityBarTop.background': bgActivityBar,
      'activityBarTop.foreground': textPrimary,
      'activityBarTop.inactiveForeground': textInactive,

      // Toolbar
      'toolbar.hoverBackground': textPrimary + OPACITY[35],
      // Badges
      'badge.background': accent,
      'badge.foreground': bgEditor,

      // Banner
      'banner.background': border,
      'banner.foreground': textSecondary,
      'banner.iconForeground': textSecondary,

      // Breadcrumb
      'breadcrumb.activeSelectionForeground': textPrimary,
      'breadcrumb.focusForeground': textSecondary,
      'breadcrumb.foreground': textMuted,
      'breadcrumbPicker.background': bgEditor,

      // Buttons
      'button.background': bgActivityBar,
      'button.foreground': textPrimary,
      'button.hoverBackground': bgActivityBar + OPACITY[50],
      'button.secondaryBackground': bgActivityBar,
      'button.secondaryForeground': textSecondary,
      'button.secondaryHoverBackground': border,
      'button.separator': bgEditor,

      // Charts
      'charts.blue': info,
      'charts.foreground': textPrimary,
      'charts.green': success,
      'charts.lines': textInactive,
      'charts.orange': warning,
      'charts.purple': accent,
      'charts.red': accent,
      'charts.yellow': modified,

      // Chat
      'chat.avatarBackground': bgEditor,
      'chat.avatarForeground': accent,
      'chat.requestBubbleBackground': textPrimary + OPACITY[15],
      'chat.requestBubbleHoverBackground': textPrimary + OPACITY[35],
      'chat.requestBackground': border,
      'chat.requestBorder': border,
      'chat.slashCommandBackground': transparent,
      'chat.slashCommandForeground': accent,

      // Checkbox
      'checkbox.background': bgActivityBar,
      'checkbox.border': border,
      'checkbox.foreground': accent,

      // Command Center
      'commandCenter.activeBackground': bgEditor,
      'commandCenter.activeForeground': textSecondary,
      'commandCenter.background': bgSidebar,
      'commandCenter.border': bgEditor,
      'commandCenter.debuggingBackground': bgSidebar,
      'commandCenter.foreground': textMuted,

      // Debug Console
      'debugConsole.errorForeground': error,
      'debugConsole.infoForeground': info,
      'debugConsole.sourceForeground': textPrimary,
      'debugConsole.warningForeground': warning,
      'debugConsoleInputIcon.foreground': accent,

      // Debug Exception Widget
      'debugExceptionWidget.background': bgActivityBar,
      'debugExceptionWidget.border': bgActivityBar,

      // Debug Icons
      'debugIcon.breakpointCurrentStackframeForeground': accent,
      'debugIcon.breakpointDisabledForeground': textSecondary,
      'debugIcon.breakpointForeground': accent,
      'debugIcon.breakpointStackframeForeground': textPrimary,
      'debugIcon.breakpointUnverifiedForeground': warning,
      'debugIcon.continueForeground': textPrimary,
      'debugIcon.disconnectForeground': textPrimary,
      'debugIcon.pauseForeground': textPrimary,
      'debugIcon.restartForeground': success,
      'debugIcon.startForeground': success,
      'debugIcon.stepBackForeground': textPrimary,
      'debugIcon.stepIntoForeground': textPrimary,
      'debugIcon.stepOutForeground': textPrimary,
      'debugIcon.stepOverForeground': textPrimary,
      'debugIcon.stopForeground': accent,

      // Debug Token Expression
      'debugTokenExpression.boolean': warning,
      'debugTokenExpression.error': accent,
      'debugTokenExpression.name': info,
      'debugTokenExpression.number': accent,
      'debugTokenExpression.string': modified,
      'debugTokenExpression.value': textPrimary,

      // Debug Toolbar
      'debugToolBar.background': border,

      // Debug View
      'debugView.exceptionLabelBackground': accent,
      'debugView.exceptionLabelForeground': bgEditor,
      'debugView.stateLabelBackground': success,
      'debugView.stateLabelForeground': bgEditor,
      'debugView.valueChangedHighlight': accent,

      // Description Foreground
      descriptionForeground: textSecondary,

      // Diff Editor
      'diffEditor.diagonalFill': border,
      'diffEditor.insertedLineBackground': diffEditorInsertedBg,
      'diffEditor.insertedTextBackground': diffEditorInsertedBg,
      'diffEditor.removedLineBackground': diffEditorRemovedBg,
      'diffEditor.removedTextBackground': diffEditorRemovedBg,
      'diffEditor.unchangedCodeBackground': bgSidebar,
      'diffEditor.unchangedRegionBackground': bgSidebar,
      'diffEditor.unchangedRegionForeground': textSecondary,
      'diffEditor.unchangedRegionShadow': bgActivityBar,
      'diffEditorGutter.insertedLineBackground': bgEditor,
      'diffEditorGutter.removedLineBackground': bgEditor,
      'diffEditorOverview.insertedForeground': success + OPACITY[35],
      'diffEditorOverview.removedForeground': error + OPACITY[35],

      // Disabled Foreground
      disabledForeground: textPrimary + OPACITY[15],

      // Dropdown
      'dropdown.background': bgActivityBar,
      'dropdown.border': border,
      'dropdown.foreground': textMuted,
      'dropdown.listBackground': bgActivityBar,

      // Editor
      'editor.background': bgEditor,
      'editor.findMatchBackground': transparent,
      'editor.findMatchBorder': accent,
      'editor.findMatchHighlightBackground': textPrimary + OPACITY[15],
      'editor.findMatchHighlightBorder': transparent,
      'editor.findRangeHighlightBackground': textPrimary + OPACITY[15],
      'editor.findRangeHighlightBorder': transparent,
      'editor.focusedStackFrameHighlightBackground': textSecondary + OPACITY[15],
      'editor.foldBackground': textPrimary + OPACITY[5],
      'editor.foreground': textPrimary,
      'editor.hoverHighlightBackground': textPrimary + OPACITY[5],
      'editor.inactiveSelectionBackground': textPrimary + OPACITY[5],
      'editor.inlineValuesBackground': border,
      'editor.inlineValuesForeground': textSecondary,
      'editor.lineHighlightBackground': textPrimary + OPACITY[5],
      'editor.lineHighlightBorder': transparent,
      'editor.linkedEditingBackground': border,
      'editor.rangeHighlightBackground': textPrimary + OPACITY[15],
      'editor.rangeHighlightBorder': border,
      'editor.selectionBackground': textSecondary + OPACITY[15],
      'editor.selectionHighlightBackground': textPrimary + OPACITY[15],
      'editor.selectionHighlightBorder': transparent,
      'editor.stackFrameHighlightBackground': textSecondary + OPACITY[15],
      'editor.wordHighlightBackground': textPrimary + OPACITY[15],
      'editor.wordHighlightBorder': transparent,
      'editor.wordHighlightStrongBackground': textPrimary + OPACITY[15],
      'editor.wordHighlightStrongBorder': transparent,

      // Editor Bracket Highlight
      'editorBracketHighlight.foreground1': brackets[0],
      'editorBracketHighlight.foreground2': brackets[1],
      'editorBracketHighlight.foreground3': brackets[2],
      'editorBracketHighlight.foreground4': brackets[3],
      'editorBracketHighlight.foreground5': brackets[4],
      'editorBracketHighlight.foreground6': brackets[5],

      // Editor Bracket Match
      'editorBracketMatch.background': bgEditor,
      'editorBracketMatch.border': textInactive,

      // Editor Code Lens
      'editorCodeLens.foreground': textInactive,

      // Editor Cursor
      'editorCursor.background': bgEditor,
      'editorCursor.foreground': cursor,

      // Editor Error/Warning/Info
      'editorError.background': transparent,
      'editorError.border': transparent,
      'editorError.foreground': error,
      'editorWarning.background': transparent,
      'editorWarning.border': transparent,
      'editorWarning.foreground': warning,
      'editorInfo.background': transparent,
      'editorInfo.border': bgEditor,
      'editorInfo.foreground': info,

      // Editor Ghost Text
      'editorGhostText.foreground': textInactive,

      // Editor Group
      'editorGroup.border': bgSidebar,
      'editorGroup.dropBackground': bgSidebar + OPACITY[75],
      'editorGroup.emptyBackground': bgActivityBar,
      'editorGroup.focusedEmptyBorder': bgSidebar,
      'editorGroupHeader.noTabsBackground': bgEditor,
      'editorGroupHeader.tabsBackground': bgActivityBar,
      'editorGroupHeader.tabsBorder': border,

      // Editor Gutter
      'editorGutter.addedBackground': success + OPACITY[65],
      'editorGutter.background': bgEditor,
      'editorGutter.deletedBackground': error + OPACITY[65],
      'editorGutter.foldingControlForeground': textSecondary,
      'editorGutter.modifiedBackground': warning + OPACITY[65],

      // Editor Hint
      'editorHint.border': bgEditor,
      'editorHint.foreground': accent,

      // Editor Hover Widget
      'editorHoverWidget.background': bgActivityBar,
      'editorHoverWidget.border': bgActivityBar,

      // Editor Indent Guide
      'editorIndentGuide.background': border,

      // Editor Inlay Hint
      'editorInlayHint.background': bgActivityBar,
      'editorInlayHint.foreground': textPrimary,

      // Editor Light Bulb
      'editorLightBulb.foreground': accent,
      'editorLightBulbAi.foreground': accent,
      'editorLightBulbAutoFix.foreground': success,

      // Editor Line Number
      'editorLineNumber.activeForeground': textSecondary + OPACITY[75],
      'editorLineNumber.foreground': textSecondary + OPACITY[35],

      // Editor Link
      'editorLink.activeForeground': info,

      // Editor Marker Navigation
      'editorMarkerNavigation.background': border,
      'editorMarkerNavigationError.background': error,
      'editorMarkerNavigationInfo.background': info,
      'editorMarkerNavigationWarning.background': warning,

      // Editor Overview Ruler
      'editorOverviewRuler.addedForeground': success + OPACITY[65],
      'editorOverviewRuler.border': bgEditor,
      'editorOverviewRuler.currentContentForeground': border,
      'editorOverviewRuler.deletedForeground': error + OPACITY[65],
      'editorOverviewRuler.errorForeground': error,
      'editorOverviewRuler.findMatchForeground': textPrimary + OPACITY[15],
      'editorOverviewRuler.incomingContentForeground': border,
      'editorOverviewRuler.infoForeground': info,
      'editorOverviewRuler.modifiedForeground': modified + OPACITY[65],
      'editorOverviewRuler.rangeHighlightForeground': textPrimary + OPACITY[15],
      'editorOverviewRuler.selectionHighlightForeground': textPrimary + OPACITY[15],
      'editorOverviewRuler.warningForeground': warning,
      'editorOverviewRuler.wordHighlightForeground': textPrimary + OPACITY[15],
      'editorOverviewRuler.wordHighlightStrongForeground': textPrimary + OPACITY[15],

      // Editor Pane
      'editorPane.background': bgEditor,

      // Editor Ruler
      'editorRuler.foreground': border,

      // Editor Sticky Scroll
      'editorStickyScroll.background': bgEditor,
      'editorStickyScroll.border': border,
      'editorStickyScroll.shadow': bgEditor,
      'editorStickyScrollHover.background': textPrimary + OPACITY[5],

      // Editor Suggest Widget
      'editorSuggestWidget.background': bgActivityBar,
      'editorSuggestWidget.border': bgActivityBar,
      'editorSuggestWidget.foreground': textSecondary,
      'editorSuggestWidget.highlightForeground': textPrimary,
      'editorSuggestWidget.selectedBackground': bgSidebar,

      // Edit Find Widget
      'editorWidget.background': bgSidebar,
      'editorWidget.border': border,

      // Editor Unnecessary Code
      'editorUnnecessaryCode.opacity': '#000000' + OPACITY[65],

      // Editor Whitespace
      'editorWhitespace.foreground': border,

      // Editor Widget

      // Error Foreground
      errorForeground: accent,

      // Extension Badge
      'extensionBadge.remoteBackground': success,
      'extensionBadge.remoteForeground': textPrimary,

      // Extension Button
      'extensionButton.background': bgActivityBar,
      'extensionButton.foreground': textSecondary,
      'extensionButton.hoverBackground': border,
      'extensionButton.prominentBackground': bgActivityBar,
      'extensionButton.prominentForeground': textPrimary,
      'extensionButton.prominentHoverBackground': border,

      // Extension Icon
      'extensionIcon.preReleaseForeground': accent,
      'extensionIcon.sponsorForeground': info,
      'extensionIcon.starForeground': accent,
      'extensionIcon.verifiedForeground': success,

      // Focus Border
      focusBorder: textInactive,

      // Foreground
      foreground: textPrimary,

      // Git Decoration
      'gitDecoration.addedResourceForeground': success + OPACITY[65],
      'gitDecoration.conflictingResourceForeground': warning,
      'gitDecoration.deletedResourceForeground': error + OPACITY[65],
      'gitDecoration.ignoredResourceForeground': textInactive,
      'gitDecoration.modifiedResourceForeground': modified + OPACITY[65],
      'gitDecoration.stageDeletedResourceForeground': error + OPACITY[65],
      'gitDecoration.stageModifiedResourceForeground': modified + OPACITY[65],
      'gitDecoration.untrackedResourceForeground': success + OPACITY[65],

      // Icon
      'icon.foreground': textPrimary,

      // Inline Chat
      'inlineChat.background': bgEditor,
      'inlineChat.border': bgSidebar,
      'inlineChat.shadow': bgActivityBar,
      'inlineChatDiff.inserted': diffEditorInsertedBg,
      'inlineChatDiff.removed': diffEditorInsertedBg,

      // Input
      'input.background': bgActivityBar,
      'input.border': border,
      'input.foreground': textPrimary,
      'input.placeholderForeground': textSecondary,
      'inputOption.activeBackground': border,
      'inputOption.activeBorder': border,
      'inputOption.activeForeground': textPrimary,
      'inputOption.hoverBackground': border,

      // Input Validation
      'inputValidation.errorBackground': border,
      'inputValidation.errorBorder': accent,
      'inputValidation.errorForeground': accent,
      'inputValidation.infoBackground': border,
      'inputValidation.infoBorder': info,
      'inputValidation.infoForeground': info,
      'inputValidation.warningBackground': border,
      'inputValidation.warningBorder': warning,
      'inputValidation.warningForeground': warning,

      // Interactive
      'interactive.activeCodeBorder': textInactive,
      'interactive.inactiveCodeBorder': border,

      // Keybinding Label
      'keybindingLabel.background': bgSidebar,
      'keybindingLabel.border': bgSidebar,
      'keybindingLabel.bottomBorder': bgSidebar,
      'keybindingLabel.foreground': textSecondary,

      // List
      'list.activeSelectionBackground': textPrimary + OPACITY[5],
      'list.activeSelectionForeground': accent,
      'list.dropBackground': bgActivityBar + OPACITY[75],
      'list.errorForeground': accent,
      'list.focusBackground': bgEditor,
      'list.focusForeground': textPrimary,
      'list.highlightForeground': textPrimary,
      'list.hoverBackground': textPrimary + OPACITY[5],
      'list.hoverForeground': textPrimary,
      'list.inactiveFocusBackground': bgEditor,
      'list.inactiveSelectionBackground': accentBackgroundLight,
      'list.inactiveSelectionForeground': accent,
      'list.invalidItemForeground': accent,
      'list.warningForeground': warning,

      // List Filter Widget
      'listFilterWidget.background': bgEditor,
      'listFilterWidget.noMatchesOutline': accent,
      'listFilterWidget.outline': bgEditor,
      'listFilterWidget.shadow': bgActivityBar,

      // Menu
      'menu.background': bgEditor,
      'menu.border': bgSidebar,
      'menu.foreground': textPrimary,
      'menu.selectionForeground': accent,
      'menu.separatorBackground': border,
      'menubar.selectionForeground': textPrimary,

      // Merge
      'merge.border': bgEditor,
      'merge.commonContentBackground': textPrimary + OPACITY[10],
      'merge.commonHeaderBackground': textPrimary + OPACITY[15],
      'merge.currentContentBackground': accent + OPACITY[10],
      'merge.currentHeaderBackground': accent + OPACITY[15],
      'merge.incomingContentBackground': diffEditorInsertedBg,
      'merge.incomingHeaderBackground': success + OPACITY[15],

      // Merge Editor
      'mergeEditor.change.background': textPrimary + OPACITY[10],
      'mergeEditor.change.word.background': textPrimary + OPACITY[10],
      'mergeEditor.conflict.handled.minimapOverViewRuler': success,
      'mergeEditor.conflict.handledFocused.border': success,
      'mergeEditor.conflict.handledUnfocused.border': success,
      'mergeEditor.conflict.unhandled.minimapOverViewRuler': accent,
      'mergeEditor.conflict.unhandledFocused.border': accent,
      'mergeEditor.conflict.unhandledUnfocused.border': accent,

      // Minimap
      'minimap.errorHighlight': accent + OPACITY[65],
      'minimap.findMatchHighlight': textMuted + OPACITY[65],
      'minimap.infoHighlight': info + OPACITY[65],
      'minimap.selectionHighlight': textSecondary + OPACITY[15],
      'minimap.selectionOccurrenceHighlight': textInactive + OPACITY[65],
      'minimap.warningHighlight': warning + OPACITY[65],
      'minimapGutter.addedBackground': success,
      'minimapGutter.deletedBackground': error + OPACITY[65],
      'minimapGutter.modifiedBackground': modified,

      // Notebook
      'notebook.cellBorderColor': border,
      'notebook.cellEditorBackground': bgSidebar + OPACITY[50],
      'notebook.cellInsertionIndicator': textPrimary,
      'notebook.cellStatusBarItemHoverBackground': textInactive,
      'notebook.cellToolbarSeparator': border,
      'notebook.editorBackground': bgEditor,
      'notebook.focusedEditorBorder': textInactive,
      'notebookStatusErrorIcon.foreground': accent,
      'notebookStatusRunningIcon.foreground': textPrimary,
      'notebookStatusSuccessIcon.foreground': success,

      // Notification
      'notificationCenter.border': bgActivityBar,
      'notificationCenterHeader.background': bgActivityBar,
      'notificationCenterHeader.foreground': textMuted,
      'notificationLink.foreground': accent,
      'notifications.background': bgActivityBar,
      'notifications.border': bgActivityBar,
      'notifications.foreground': textSecondary,
      'notificationsErrorIcon.foreground': accent,
      'notificationsInfoIcon.foreground': info,
      'notificationsWarningIcon.foreground': warning,
      'notificationToast.border': bgActivityBar,

      // Panel
      'panel.background': bgActivityBar,
      'panel.border': bgActivityBar,
      'panel.dropBackground': bgSidebar + OPACITY[75],
      'panelStickyScroll.background': bgActivityBar,
      'panelStickyScroll.border': border,
      'panelStickyScroll.shadow': bgActivityBar,
      'panelTitle.activeBorder': accent,
      'panelTitle.activeForeground': accent,
      'panelTitle.inactiveForeground': textMuted,

      // Peek View
      'peekView.border': bgActivityBar,
      'peekViewEditor.background': bgActivityBar,
      'peekViewEditor.matchHighlightBackground': border,
      'peekViewEditorGutter.background': bgActivityBar,
      'peekViewResult.background': bgActivityBar,
      'peekViewResult.fileForeground': textMuted,
      'peekViewResult.lineForeground': textMuted,
      'peekViewResult.matchHighlightBackground': border,
      'peekViewResult.selectionBackground': border,
      'peekViewResult.selectionForeground': textPrimary,
      'peekViewTitle.background': bgSidebar,
      'peekViewTitleDescription.foreground': textMuted,
      'peekViewTitleLabel.foreground': textPrimary,

      // Picker Group
      'pickerGroup.border': bgEditor,
      'pickerGroup.foreground': border,

      // Ports
      'ports.iconRunningProcessForeground': success,

      // Problems
      'problemsErrorIcon.foreground': accent,
      'problemsInfoIcon.foreground': info,
      'problemsWarningIcon.foreground': warning,

      // Profile Badge
      'profileBadge.background': border,
      'profileBadge.foreground': textSecondary,

      // Progress Bar
      'progressBar.background': textInactive,

      // Quick Input
      'quickInput.background': bgActivityBar,
      'quickInput.foreground': textSecondary,
      'quickInputList.focusForeground': textPrimary,
      'quickInput.list.focusBackground': accentBackgroundLight,
      // "quickInput.list.":

      // Sash
      'sash.hoverBorder': textInactive,

      // SCM Graph
      'scmGraph.historyItemHoverLabelForeground': bgEditor,
      'scmGraph.foreground1': accent,
      'scmGraph.foreground2': warning,
      'scmGraph.foreground3': modified,
      'scmGraph.foreground4': success,
      'scmGraph.foreground5': accent,
      'scmGraph.historyItemHoverAdditionsForeground': success,
      'scmGraph.historyItemHoverDeletionsForeground': accent,
      'scmGraph.historyItemRefColor': accent,
      'scmGraph.historyItemRemoteRefColor': success,
      'scmGraph.historyItemBaseRefColor': info,
      'scmGraph.historyItemHoverDefaultLabelForeground': bgEditor,
      'scmGraph.historyItemHoverDefaultLabelBackground': textMuted,

      // Scrollbar
      'scrollbar.shadow': bgEditor,
      'scrollbarSlider.activeBackground': textPrimary + OPACITY[35],
      'scrollbarSlider.background': textSecondary + OPACITY[15],
      'scrollbarSlider.hoverBackground': textPrimary + OPACITY[15],

      // Selection
      'selection.background': textSecondary + OPACITY[15],

      // Settings
      'settings.checkboxBackground': bgActivityBar,
      'settings.checkboxBorder': border,
      'settings.checkboxForeground': accent,
      'settings.dropdownBackground': bgActivityBar,
      'settings.dropdownBorder': border,
      'settings.dropdownForeground': textPrimary,
      'settings.dropdownListBorder': textMuted,
      'settings.headerForeground': accent,
      'settings.modifiedItemForeground': accent,
      'settings.modifiedItemIndicator': accent,
      'settings.numberInputBackground': bgActivityBar,
      'settings.numberInputBorder': border,
      'settings.numberInputForeground': textPrimary,
      'settings.rowHoverBackground': textInactive + OPACITY[5],
      'settings.sashBorder': border,
      'settings.settingsHeaderHoverForeground': textPrimary,
      'settings.textInputBackground': bgActivityBar,
      'settings.textInputBorder': border,
      'settings.textInputForeground': textPrimary,

      // Sidebar
      'sideBar.background': bgSidebar,
      'sideBar.border': bgActivityBar,
      'sideBar.dropBackground': bgSidebar + OPACITY[75],
      'sideBar.foreground': textSecondary,
      'sideBarSectionHeader.background': bgSidebar,
      'sideBarSectionHeader.foreground': textInactive,
      'sideBarStickyScroll.background': bgSidebar,
      'sideBarStickyScroll.border': border,
      'sideBarStickyScroll.shadow': bgSidebar,
      'sideBarTitle.foreground': textInactive,

      // Status Bar
      'statusBar.background': bgActivityBar,
      'statusBar.border': bgActivityBar,
      'statusBar.debuggingBackground': textInactive,
      'statusBar.debuggingBorder': bgActivityBar,
      'statusBar.debuggingForeground': textPrimary,
      'statusBar.focusBorder': border,
      'statusBar.foreground': textInactive,
      'statusBar.noFolderBackground': bgActivityBar,
      'statusBar.noFolderBorder': bgActivityBar,
      'statusBar.noFolderForeground': textInactive,
      'statusBarItem.activeBackground': bgEditor,
      'statusBarItem.errorBackground': bgEditor,
      'statusBarItem.errorForeground': accent,
      'statusBarItem.focusBorder': textInactive,
      'statusBarItem.hoverBackground': bgActivityBar,
      'statusBarItem.hoverForeground': textPrimary,
      'statusBarItem.prominentBackground': border,
      'statusBarItem.prominentHoverBackground': border,
      'statusBarItem.remoteBackground': bgActivityBar,
      'statusBarItem.remoteForeground': success,
      'statusBarItem.remoteHoverBackground': success,
      'statusBarItem.remoteHoverForeground': bgEditor,
      'statusBarItem.warningBackground': bgEditor,
      'statusBarItem.warningForeground': warning,

      // Symbol Icon
      'symbolIcon.arrayForeground': accent,
      'symbolIcon.booleanForeground': accent,
      'symbolIcon.classForeground': info,
      'symbolIcon.colorForeground': accent,
      'symbolIcon.constantForeground': accent,
      'symbolIcon.constructorForeground': success,
      'symbolIcon.enumeratorForeground': warning,
      'symbolIcon.enumeratorMemberForeground': warning,
      'symbolIcon.eventForeground': warning,
      'symbolIcon.fieldForeground': warning,
      'symbolIcon.fileForeground': textSecondary,
      'symbolIcon.folderForeground': textSecondary,
      'symbolIcon.functionForeground': success,
      'symbolIcon.interfaceForeground': info,
      'symbolIcon.keyForeground': warning,
      'symbolIcon.keywordForeground': accent,
      'symbolIcon.methodForeground': success,
      'symbolIcon.moduleForeground': info,
      'symbolIcon.namespaceForeground': info,
      'symbolIcon.nullForeground': accent,
      'symbolIcon.numberForeground': accent,
      'symbolIcon.objectForeground': info,
      'symbolIcon.operatorForeground': accent,
      'symbolIcon.packageForeground': accent,
      'symbolIcon.propertyForeground': warning,
      'symbolIcon.referenceForeground': accent,
      'symbolIcon.snippetForeground': success,
      'symbolIcon.stringForeground': modified,
      'symbolIcon.structForeground': accent,
      'symbolIcon.textForeground': modified,
      'symbolIcon.typeParameterForeground': warning,
      'symbolIcon.unitForeground': accent,
      'symbolIcon.variableForeground': info,

      // Tab
      'tab.activeBackground': accentBackgroundLight,
      'tab.activeBorder': accent,
      'tab.activeForeground': textPrimary,
      'tab.activeModifiedBorder': border,
      'tab.border': bgEditor,
      'tab.hoverBackground': bgEditor,
      'tab.hoverBorder': border,
      'tab.hoverForeground': textPrimary,
      'tab.inactiveBackground': bgEditor,
      'tab.inactiveForeground': textMuted,
      'tab.inactiveModifiedBorder': border,
      'tab.lastPinnedBorder': border,
      'tab.unfocusedActiveBorder': textMuted,
      'tab.unfocusedActiveForeground': textSecondary,
      'tab.unfocusedActiveModifiedBorder': border,
      'tab.unfocusedHoverBackground': bgEditor,
      'tab.unfocusedHoverBorder': bgEditor,
      'tab.unfocusedHoverForeground': textSecondary,
      'tab.unfocusedInactiveForeground': textMuted,
      'tab.unfocusedInactiveModifiedBorder': border,

      // Terminal
      'terminal.ansiBlack': border,
      'terminal.ansiBlue': warning,
      'terminal.ansiBrightBlack': textInactive,
      'terminal.ansiBrightBlue': warning,
      'terminal.ansiBrightCyan': info,
      'terminal.ansiBrightGreen': success,
      'terminal.ansiBrightMagenta': accent,
      'terminal.ansiBrightRed': accent,
      'terminal.ansiBrightWhite': textPrimary,
      'terminal.ansiBrightYellow': modified,
      'terminal.ansiCyan': info,
      'terminal.ansiGreen': success,
      'terminal.ansiMagenta': accent,
      'terminal.ansiRed': accent,
      'terminal.ansiWhite': textPrimary,
      'terminal.ansiYellow': modified,
      'terminal.background': bgEditor,
      'terminal.foreground': textPrimary,
      'terminal.selectionBackground': textPrimary + OPACITY[15],
      'terminalCommandDecoration.defaultBackground': textPrimary,
      'terminalCommandDecoration.errorBackground': accent,
      'terminalCommandDecoration.successBackground': success,
      'terminalCursor.background': transparent,
      'terminalCursor.foreground': cursor,

      // Testing
      'testing.iconErrored': accent,
      'testing.iconFailed': accent,
      'testing.iconPassed': success,
      'testing.iconQueued': textPrimary,
      'testing.iconSkipped': warning,
      'testing.iconUnset': textMuted,
      'testing.message.error.decorationForeground': accent,
      'testing.message.error.lineBackground': accent + OPACITY[10],
      'testing.message.info.decorationForeground': textPrimary,
      'testing.message.info.lineBackground': textPrimary + OPACITY[10],
      'testing.runAction': modified,

      // Text Block Quote
      'textBlockQuote.background': bgActivityBar,
      'textBlockQuote.border': bgActivityBar,
      'textCodeBlock.background': bgActivityBar,
      'textLink.activeForeground': textPrimary,
      'textLink.foreground': accent,
      'textPreformat.foreground': textPrimary,
      'textSeparator.foreground': textInactive,

      // Title Bar
      'titleBar.activeBackground': bgActivityBar,
      'titleBar.activeForeground': textSecondary,
      'titleBar.border': bgActivityBar,
      'titleBar.inactiveBackground': bgSidebar,
      'titleBar.inactiveForeground': border,

      // Tree
      'tree.inactiveIndentGuidesStroke': bgEditor,
      'tree.indentGuidesStroke': border,

      // Walk Through
      'walkThrough.embeddedEditorBackground': bgSidebar,

      // Welcome Page
      'welcomePage.buttonBackground': bgActivityBar,
      'welcomePage.buttonHoverBackground': border,
      'welcomePage.progress.background': textInactive,
      'welcomePage.progress.foreground': textMuted,
      'welcomePage.tileBackground': bgActivityBar,
      'welcomePage.tileHoverBackground': border,
      'welcomePage.tileShadow': bgActivityBar,

      // Widget
      'widget.shadow': bgActivityBar,
    };
  }

  /**
   * Maps the semantic code theme to token color rules.
   * Generates token rules matching the standard VS Code theme structure.
   */
  private mapCodeToTokenColors(): MorrocoyTokenColorRule[] {
    const c = this.config.theme.code;
    const error = this.config.theme.interface.error;

    return [
      // Text (default foreground for unused/unknown scopes)
      {
        name: 'Text',
        scope: 'comment.unused.elixir',
        settings: { foreground: c.foreground },
      },

      // Comments
      {
        name: 'Comments',
        scope: [
          'comment',
          'punctuation.definition.comment',
          'comment.block.documentation punctuation.definition',
          'string.comment',
          'comment.block.documentation',
          'comment.block',
        ],
        settings: { foreground: c.comment, fontStyle: 'italic' },
      },

      // Doc Comment Keywords
      {
        name: 'Doc Comment Keywords',
        scope: [
          'comment.block.documentation variable',
          'keyword.other.documentation',
          'storage.type.class.jsdoc',
          'comment.block variable.parameter',
          'keyword.other.phpdoc',
          'comment.block.documentation entity.name.type',
          'meta.other.type.phpdoc support class',
        ],
        settings: { foreground: c.comment },
      },

      // Punctuation
      {
        name: 'Punctuation',
        scope: [
          'punctuation.comma.graphql',
          'punctuation.definition.variable',
          'punctuation.definition.parameters',
          'punctuation.definition.array',
          'punctuation.definition.function',
          'punctuation.brace',
          'punctuation.terminator.statement',
          'punctuation.delimiter.object.comma',
          'punctuation.definition.entity',
          'punctuation.definition',
          'punctuation.definition.string.begin.markdown',
          'punctuation.definition.string.end.markdown',
          'punctuation.separator.key-value',
          'punctuation.separator.dictionary',
          'punctuation.terminator',
          'punctuation.delimiter.comma',
          'punctuation.separator.comma',
          'punctuation.accessor',
          'punctuation.separator.array',
          'punctuation.section',
          'punctuation.section.property-list.begin.bracket.curly',
          'punctuation.section.property-list.end.bracket.curly',
          'punctuation.separator.statement',
          'punctuation.section.array.elixir',
          'punctuation.separator.object.elixir',
          'punctuation.section.embedded.elixir',
          'punctuation.section.function.elixir',
          'punctuation.section.scope.elixir',
          'punctuation.separator.parameter',
          'meta.brace.round',
          'meta.brace.square',
          'meta.brace.curly',
          'constant.name.attribute.tag.pug',
          'punctuation.section.embedded',
          'punctuation.separator.method',
          'punctuation.separator',
          'punctuation.other.comma',
          'punctuation.bracket',
          'keyword.control.ternary',
          'string.interpolated.pug',
          'support.function.interpolation.sass',
          'punctuation.parenthesis.begin',
          'punctuation.parenthesis.end',
          'punctuation.operation.graphql',
          'punctuation.colon.graphql',
        ],
        settings: { foreground: c.punctuation },
      },

      // Delimiters
      {
        name: 'Delimiters',
        scope: 'none',
        settings: { foreground: c.foreground },
      },

      // Operators
      {
        name: 'Operators',
        scope: 'keyword.operator',
        settings: { foreground: c.punctuation },
      },

      // Keywords
      {
        name: 'Keywords',
        scope: [
          'keyword',
          'keyword.operator.expression',
          'keyword.operator.type.asserts',
          'variable.language',
          'keyword.other.special-method.elixir',
          'meta.control.flow',
        ],
        settings: { foreground: c.keyword },
      },

      // Variables
      {
        name: 'Variables',
        scope: [
          'variable',
          'source.elixir.embedded.source',
          'string source.groovy',
          'string meta.embedded.line.ruby',
        ],
        settings: { foreground: c.foreground },
      },

      // Functions
      {
        name: 'Functions',
        scope: [
          'entity.name.function',
          'meta.require',
          'support.function.any-method',
          'meta.function-call',
          'meta.method-call',
          'variable.function',
        ],
        settings: { foreground: c.function },
      },

      // Classes
      {
        name: 'Classes',
        scope: [
          'support.class',
          'entity.name.class',
          'entity.name.type.class',
          'meta.class.instance',
          'meta.class.inheritance',
          'entity.other.inherited-class',
          'entity.name.type',
          'variable.other.constant.elixir',
          'storage.type.haskell',
          'support.type.graphql',
          'support.type.enum.graphql',
        ],
        settings: { foreground: c.type },
      },

      // Methods
      {
        name: 'Methods',
        scope: 'keyword.other.special-method',
        settings: { foreground: c.function },
      },

      // Storage
      {
        name: 'Storage',
        scope: ['storage', 'constant.language'],
        settings: { foreground: c.keyword },
      },

      // Support
      {
        name: 'Support',
        scope: 'support.function',
        settings: { foreground: c.function },
      },

      // Strings
      {
        name: 'Strings, Inherited Class',
        scope: [
          'string',
          'punctuation.definition.string',
          'support.constant.property-value',
          'string.quoted.double.shell',
          'support.function.variable.quoted.single.elixir',
          'storage.type.string',
        ],
        settings: { foreground: c.string },
      },

      // Numbers
      {
        name: 'Integers',
        scope: ['constant.numeric', 'variable.other.anonymous.elixir'],
        settings: { foreground: c.number },
      },

      // Floats
      {
        name: 'Floats',
        scope: 'none',
        settings: { foreground: c.number },
      },

      // Boolean
      {
        name: 'Boolean',
        scope: 'none',
        settings: { foreground: c.keyword },
      },

      // Constants
      {
        name: 'Constants',
        scope: [
          'constant',
          'variable.other.constant',
          'punctuation.definition.constant',
          'constant.other.symbol',
          'constant.language.symbol',
          'support.constant',
          'support.variable.magic.python',
          'variable.other.enummember',
        ],
        settings: { foreground: c.foreground },
      },

      // Tags (punctuation)
      {
        name: 'Tags',
        scope: ['punctuation.definition.tag'],
        settings: { foreground: c.function },
      },

      // Tag name
      {
        name: 'Tag name',
        scope: 'entity.name.tag',
        settings: { foreground: c.tag },
      },

      // Attributes
      {
        name: 'Attribute IDs',
        scope: ['entity.other.attribute-name', 'string.unquoted.alias.graphql'],
        settings: { foreground: c.attribute },
      },

      // Selector
      {
        name: 'Selector',
        scope: 'meta.selector',
        settings: { foreground: c.punctuation },
      },

      // Values
      {
        name: 'Values',
        scope: 'none',
        settings: { foreground: c.number },
      },

      // Headings
      {
        name: 'Headings',
        scope: [
          'markup.heading',
          'punctuation.definition.heading',
          'entity.name.section',
          'markup.heading.setext',
        ],
        settings: { fontStyle: '', foreground: c.string },
      },

      // Units
      {
        name: 'Units',
        scope: 'keyword.other.unit',
        settings: { foreground: c.string },
      },

      // Bold
      {
        name: 'Bold',
        scope: ['markup.bold', 'punctuation.definition.bold'],
        settings: { fontStyle: 'bold', foreground: c.type },
      },

      // Italic
      {
        name: 'Italic',
        scope: ['markup.italic', 'punctuation.definition.italic'],
        settings: { fontStyle: 'italic', foreground: c.attribute },
      },

      // Strikethrough
      {
        name: 'Strikethrough',
        scope: ['markup.strikethrough', 'punctuation.definition.strikethrough'],
        settings: { foreground: c.comment, fontStyle: 'strikethrough' },
      },

      // Strikethrough Italic
      {
        name: 'Strikethrough Italic',
        scope: [
          'markup.strikethrough markup.italic',
          'markup.strikethrough markup.italic punctuation.definition.italic',
        ],
        settings: { foreground: c.comment, fontStyle: 'italic strikethrough' },
      },

      // Strikethrough Bold
      {
        name: 'Strikethrough Bold',
        scope: [
          'markup.strikethrough markup.bold',
          'markup.strikethrough markup.bold punctuation.definition.bold',
        ],
        settings: { foreground: c.comment, fontStyle: 'bold strikethrough' },
      },

      // Code
      {
        name: 'Code',
        scope: 'markup.raw.inline',
        settings: { foreground: c.string },
      },

      // Link Text
      {
        name: 'Link Text',
        scope: 'string.other.link',
        settings: { foreground: c.function },
      },

      // Link URL
      {
        name: 'Link Url',
        scope: 'meta.link',
        settings: { foreground: c.attribute },
      },

      // Lists
      {
        name: 'Lists',
        scope: 'beginning.punctuation.definition.list',
        settings: { foreground: c.property },
      },

      // Quotes
      {
        name: 'Quotes',
        scope: 'markup.quote',
        settings: { foreground: c.foreground },
      },

      // Separator
      {
        name: 'Separator',
        scope: 'meta.separator',
        settings: { foreground: c.foreground },
      },

      // Inserted
      {
        name: 'Inserted',
        scope: 'markup.inserted',
        settings: { foreground: c.function },
      },

      // Deleted
      {
        name: 'Deleted',
        scope: 'markup.deleted',
        settings: { foreground: c.type },
      },

      // Changed
      {
        name: 'Changed',
        scope: 'markup.changed',
        settings: { foreground: c.keyword },
      },

      // Regular Expressions
      {
        name: 'Regular Expressions',
        scope: 'string.regexp',
        settings: { foreground: c.string },
      },

      // Escape Characters
      {
        name: 'Escape Characters',
        scope: ['constant.character.escape', 'constant.other.character-class'],
        settings: { foreground: c.attribute },
      },

      // Embedded
      {
        name: 'Embedded',
        scope: 'variable.interpolation',
        settings: { foreground: c.attribute },
      },

      // Illegal
      {
        name: 'Illegal',
        scope: 'invalid',
        settings: { foreground: error },
      },

      // New Operator
      {
        name: 'New Operator',
        scope: 'keyword.operator.new',
        settings: { foreground: c.keyword },
      },

      // CSS ID
      {
        name: 'Css ID',
        scope: 'entity.other.attribute-name.id',
        settings: { foreground: c.type },
      },

      // Function Parameters
      {
        name: 'Function Parameters',
        scope: 'meta.function-call.arguments',
        settings: { foreground: c.foreground },
      },

      // Object Properties
      {
        name: 'Object Properties',
        scope: [
          'meta.object-literal.key',
          'meta.object.member',
          'variable.other.property',
          'variable.other.object.property',
          'support.variable.property',
          'variable.object.property',
          'support.type.property-name',
          'meta.property-name',
          'entity.name.tag.yaml',
          'constant.other.key',
          'constant.other.object.key.js',
          'string.unquoted.label.js',
          'support.type.map.key',
          'variable.graphql',
        ],
        settings: { foreground: c.property },
      },

      // Markup Code
      {
        name: 'Markup Code',
        scope: ['markup.inline.raw', 'markup.fenced_code.block', 'markup.raw.block'],
        settings: { foreground: c.property },
      },

      // Markup Link Image
      {
        name: 'Markup Link Image',
        scope: 'markup.underline.link.image',
        settings: { foreground: c.function },
      },

      // Variable Parameter
      {
        name: 'Variable Parameter',
        scope: [
          'variable.parameter',
          'parameter.variable.function.elixir',
          'variable.other.block.ruby',
        ],
        settings: { foreground: c.parameter },
      },

      // Type Primitive
      {
        name: 'Type Primitive',
        scope: ['support.type.primitive', 'support.type.builtin'],
        settings: { foreground: c.primitive },
      },

      // BASH: Command Substitution
      {
        name: 'BASH: Command Substitution',
        scope: 'string.interpolated.dollar.shell',
        settings: { foreground: c.type },
      },

      // BASH: Math Operation
      {
        name: 'BASH: Math Operation',
        scope: 'string.other.math.shell',
        settings: { foreground: c.function },
      },

      // BASH: Substitution
      {
        name: 'BASH: Substitution',
        scope: [
          'punctuation.definition.string.begin.shell',
          'punctuation.definition.string.end.shell',
        ],
        settings: { foreground: c.punctuation },
      },

      // CSV Rainbow 4
      {
        name: 'CSV Rainbow 4',
        scope: 'comment.rainbow4',
        settings: { foreground: c.property },
      },

      // CSV Rainbow 9
      {
        name: 'CSV Rainbow 9',
        scope: 'markup.bold.rainbow9',
        settings: { foreground: c.foreground, fontStyle: '' },
      },

      // CSV Rainbow 10
      {
        name: 'CSV Rainbow 10',
        scope: 'invalid.rainbow10',
        settings: { foreground: c.attribute },
      },

      // Imports and Exports
      {
        name: 'Imports and Exports',
        scope: ['keyword.control.import', 'keyword.control.export', 'keyword.control.from'],
        settings: { foreground: c.import },
      },

      // Async
      {
        name: 'Async',
        scope: ['storage.modifier.async', 'keyword.control.as', 'keyword.control.type'],
        settings: { foreground: c.modifier },
      },

      // Storage declarations
      {
        name: 'Storage - const, let, function, type, etc',
        scope: 'storage',
        settings: { foreground: c.storage },
      },

      // Control flow keywords (with bold)
      {
        name: 'keyword - await, return, etc',
        scope: 'keyword.control.flow',
        settings: { foreground: c.controlFlow, fontStyle: 'bold' },
      },
    ];
  }

  /**
   * Maps the semantic code theme to semantic token colors.
   */
  private mapCodeToSemanticTokenColors(): Record<string, TailwindColor> {
    const c = this.config.theme.code;

    return {
      // Operators
      operator: c.import,
      memberOperatorOverload: c.import,
      operatorOverload: c.import,

      // Types and interfaces
      interface: c.type,
      type: c.type,
      // typeParameter: c.modifier,
      // class: c.type,
      // enum: c.type,
      // struct: c.type,

      // // Functions
      // function: c.function,
      // method: c.function,

      // // Variables and properties
      // variable: c.foreground,
      // parameter: c.parameter,
      // property: c.property,

      // // Keywords and modifiers
      // keyword: c.keyword,
      // modifier: c.modifier,

      // // Strings and numbers
      // string: c.string,
      // number: c.number,

      // // Comments
      // comment: c.comment,
    };
  }

  /**
   * Converts the theme configuration to VS Code theme JSON format.
   */
  toJSON(): VSCodeThemeJSON {
    // Generate semantic token colors from code theme
    const generatedSemanticTokenColors = this.mapCodeToSemanticTokenColors();
    const semanticTokenColors: Record<string, string> = {};

    // Resolve generated semantic token colors
    for (const [selector, color] of Object.entries(generatedSemanticTokenColors)) {
      semanticTokenColors[selector] = this.resolveColor(color);
    }

    // Apply explicit overrides
    if (this.config.semanticTokenColors) {
      for (const [selector, color] of Object.entries(this.config.semanticTokenColors)) {
        if (color) {
          semanticTokenColors[selector] = this.resolveColor(color as TailwindColor);
        }
      }
    }

    // Generate all VS Code colors from semantic interface theme
    const generatedColors = this.mapThemeToVSCodeColors();

    // Apply any color overrides
    const colors: Record<string, string> = { ...generatedColors };
    if (this.config.colorOverrides) {
      for (const [key, color] of Object.entries(this.config.colorOverrides)) {
        if (color) {
          colors[key] = this.resolveColor(color);
        }
      }
    }

    // Generate token colors from code theme
    const generatedTokenColors = this.mapCodeToTokenColors();

    // Build token colors array
    const tokenColors = generatedTokenColors.map((rule) => {
      const settings: {
        foreground?: string;
        background?: string;
        fontStyle?: string;
      } = {};

      if (rule.settings.foreground) {
        settings.foreground = this.resolveColor(rule.settings.foreground);
      }
      if (rule.settings.background) {
        settings.background = this.resolveColor(rule.settings.background);
      }
      if (rule.settings.fontStyle !== undefined) {
        settings.fontStyle = rule.settings.fontStyle;
      }

      return {
        ...(rule.name && { name: rule.name }),
        scope: rule.scope,
        settings,
      };
    });

    return {
      $schema: 'vscode://schemas/color-theme',
      name: this.config.name,
      semanticHighlighting: true,
      semanticTokenColors,
      colors,
      tokenColors,
    };
  }

  /**
   * Converts the theme to a JSON string.
   */
  toString(pretty = true): string {
    return JSON.stringify(this.toJSON(), null, pretty ? 2 : 0);
  }

  /**
   * Gets the configured file name for this theme.
   */
  get fileName(): string {
    return this.config.fileName;
  }

  /**
   * Gets the theme name.
   */
  get name(): string {
    return this.config.name;
  }

  /**
   * Gets the theme type (light or dark).
   */
  get type(): ThemeType {
    return this.config.type;
  }

  /**
   * Gets the VS Code uiTheme value based on theme type.
   */
  get uiTheme(): 'vs' | 'vs-dark' {
    return this.config.type === 'light' ? 'vs' : 'vs-dark';
  }
}

// ==========================================================================
// Helper Functions
// ==========================================================================

/**
 * Creates a new Morrocoy theme.
 */
export function createTheme(config: MorrocoyThemeConfig): MorrocoyTheme {
  return new MorrocoyTheme(config);
}
