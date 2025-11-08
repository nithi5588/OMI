/**
 * Color constants for the MCP Orchestrator app
 * Following iOS design system guidelines
 */

export const COLORS = {
  // Primary colors - More vibrant blue
  PRIMARY: '#0A84FF',
  SECONDARY: '#32D74B',

  // Status colors
  SUCCESS: '#32D74B',
  WARNING: '#FF9F0A',
  ERROR: '#FF453A',
  INFO: '#0A84FF',

  // Background colors - Softer backgrounds
  BACKGROUND: '#F5F5F7',
  SURFACE: '#FFFFFF',
  CARD: '#FFFFFF',

  // Text colors - Better contrast
  TEXT_PRIMARY: '#1C1C1E',
  TEXT_SECONDARY: '#8E8E93',
  TEXT_TERTIARY: '#C7C7CC',
  TEXT_INVERSE: '#FFFFFF',

  // Message bubble colors - More saturated
  USER_MESSAGE_BG: '#0A84FF',
  USER_MESSAGE_TEXT: '#FFFFFF',
  AI_MESSAGE_BG: '#FFFFFF',
  AI_MESSAGE_TEXT: '#1C1C1E',
  SYSTEM_MESSAGE_BG: '#E5E5EA',
  SYSTEM_MESSAGE_TEXT: '#636366',

  // Border colors - Subtle
  BORDER: '#D1D1D6',
  BORDER_LIGHT: '#E5E5EA',

  // MCP status colors - Vibrant
  MCP_PENDING: '#AEAEB2',
  MCP_IN_PROGRESS: '#0A84FF',
  MCP_COMPLETED: '#32D74B',
  MCP_FAILED: '#FF453A',

  // Overlay colors
  OVERLAY: 'rgba(0, 0, 0, 0.4)',
  OVERLAY_LIGHT: 'rgba(0, 0, 0, 0.1)',
};

export const THEME = {
  colors: {
    primary: COLORS.PRIMARY,
    secondary: COLORS.SECONDARY,
    background: COLORS.BACKGROUND,
    surface: COLORS.SURFACE,
    error: COLORS.ERROR,
    text: COLORS.TEXT_PRIMARY,
    disabled: COLORS.TEXT_TERTIARY,
    placeholder: COLORS.TEXT_SECONDARY,
    backdrop: COLORS.OVERLAY,
  },
  roundness: 12,
  animation: {
    scale: 1.0,
  },
};
