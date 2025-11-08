/**
 * Color constants for the MCP Orchestrator app
 * Following iOS design system guidelines
 */

export const COLORS = {
  // Primary colors
  PRIMARY: '#007AFF',
  SECONDARY: '#34C759',

  // Status colors
  SUCCESS: '#34C759',
  WARNING: '#FF9500',
  ERROR: '#FF3B30',
  INFO: '#007AFF',

  // Background colors
  BACKGROUND: '#F2F2F7',
  SURFACE: '#FFFFFF',
  CARD: '#FFFFFF',

  // Text colors
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#8E8E93',
  TEXT_TERTIARY: '#C7C7CC',
  TEXT_INVERSE: '#FFFFFF',

  // Message bubble colors
  USER_MESSAGE_BG: '#007AFF',
  USER_MESSAGE_TEXT: '#FFFFFF',
  AI_MESSAGE_BG: '#FFFFFF',
  AI_MESSAGE_TEXT: '#000000',
  SYSTEM_MESSAGE_BG: '#E5E5EA',
  SYSTEM_MESSAGE_TEXT: '#8E8E93',

  // Border colors
  BORDER: '#C6C6C8',
  BORDER_LIGHT: '#E5E5EA',

  // MCP status colors
  MCP_PENDING: '#C7C7CC',
  MCP_IN_PROGRESS: '#007AFF',
  MCP_COMPLETED: '#34C759',
  MCP_FAILED: '#FF3B30',

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
