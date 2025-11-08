/**
 * Application configuration
 * Environment variables and app settings
 */

export const CONFIG = {
  // API Endpoints (to be configured later)
  API_ENDPOINTS: {
    CLAUDE: process.env.CLAUDE_API_URL || 'https://api.anthropic.com/v1',
    OMI: process.env.OMI_API_URL || '',
  },

  // AsyncStorage keys
  STORAGE_KEYS: {
    CONVERSATIONS: '@mcp_conversations',
    SETTINGS: '@mcp_settings',
    USER_PREFERENCES: '@mcp_user_preferences',
  },

  // App settings
  APP: {
    MAX_MESSAGE_LENGTH: 5000,
    MAX_CONVERSATIONS_STORED: 100,
    AUTO_SAVE_INTERVAL: 5000, // 5 seconds
    TYPING_INDICATOR_DELAY: 800,
  },

  // MCP settings
  MCP: {
    MAX_CONCURRENT_WORKFLOWS: 3,
    WORKFLOW_TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
  },
};

export default CONFIG;
