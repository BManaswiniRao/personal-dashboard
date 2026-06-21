// ── Configuration ──────────────────────────────────────────
// Copy this file to config.js and fill in your values.
// config.js is listed in .gitignore — never commit API keys.

export const CONFIG = {
  // Get from https://console.anthropic.com/
  ANTHROPIC_API_KEY: 'YOUR_ANTHROPIC_API_KEY_HERE',

  // Google OAuth Client ID — get from https://console.cloud.google.com/
  // Enable: Gmail API, Google Calendar API
  // Add redirect URI: http://localhost:3000
  GOOGLE_CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID_HERE',

  // Scopes needed for Gmail + Calendar
  GOOGLE_SCOPES: [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/gmail.readonly',
  ].join(' '),

  // MCP server endpoints (Anthropic-hosted, no changes needed)
  MCP_CALENDAR: 'https://calendarmcp.googleapis.com/mcp/v1',
  MCP_GMAIL: 'https://gmailmcp.googleapis.com/mcp/v1',

  // App settings
  SYNC_INTERVAL_MS: 5 * 60 * 1000, // auto-sync every 5 minutes
};
