// ── API Module ──────────────────────────────────────────────
// All Anthropic API calls with MCP server integration

import { CONFIG } from '../config.js';

const ANTHROPIC_ENDPOINT = 'https://api.anthropic.com/v1/messages';

async function callClaude({ systemPrompt, userMessage, mcpServers = [], tools = [] }) {
  const body = {
    model: 'claude-sonnet-4-6',
    max_tokens: 1000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  };

  if (mcpServers.length) body.mcp_servers = mcpServers;
  if (tools.length) body.tools = tools;

  const res = await fetch(ANTHROPIC_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CONFIG.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'mcp-client-2025-04-04',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

function extractText(data) {
  return (data.content || [])
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('');
}

function parseJSON(text) {
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

// ── Calendar ────────────────────────────────────────────────
export async function fetchCalendarEvents() {
  const data = await callClaude({
    systemPrompt: `You are a calendar assistant. Use Google Calendar to fetch upcoming events for the next 3 days.
Return ONLY a JSON array, no markdown, no backticks:
[{"title":"string","time":"HH:MM AM/PM","date":"Today|Tomorrow|Weekday","type":"meeting|personal|reminder","attendees":0}]
Include up to 6 events. If none found return [].`,
    userMessage: 'Fetch my upcoming calendar events for the next 3 days.',
    mcpServers: [{ type: 'url', url: CONFIG.MCP_CALENDAR, name: 'google-calendar' }],
  });

  try {
    return parseJSON(extractText(data));
  } catch {
    return [];
  }
}

// ── Gmail ───────────────────────────────────────────────────
export async function fetchEmails() {
  const data = await callClaude({
    systemPrompt: `You are an email assistant. Use Gmail to fetch the 5 most recent inbox emails.
Return ONLY a JSON array, no markdown, no backticks:
[{"from":"Name","initials":"NM","subject":"Subject (max 40 chars)","time":"Xh ago|Today|Yesterday","unread":true}]
If none found return [].`,
    userMessage: 'Fetch my recent emails from Gmail inbox.',
    mcpServers: [{ type: 'url', url: CONFIG.MCP_GMAIL, name: 'gmail' }],
  });

  try {
    return parseJSON(extractText(data));
  } catch {
    return [];
  }
}

// ── AI Insights ─────────────────────────────────────────────
export async function getInsights({ tasks, habits, events, emails, diet, dailyLog }) {
  const taskSummary = tasks.map(t => `${t.done ? '✓' : '○'} [${t.priority}] ${t.text}`).join('\n');
  const habitSummary = habits.map(h => `${h.name}: ${h.days.filter(Boolean).length}/7 days`).join('\n');
  const dietSummary = diet.length > 0 ? diet.map(d => `${d.meal}: ${d.food} (mood: ${d.mood}/5)`).join('\n') : 'No diet entries';
  const logSummary = dailyLog.length > 0 ? dailyLog[0].entry : 'No daily log';

  const data = await callClaude({
    systemPrompt: 'You are a personal wellness coach. Give a friendly, encouraging 4-sentence analysis: 1) how their tasks/productivity look, 2) their habit progress, 3) diet observations, 4) one actionable tip for tomorrow. Be specific and personal, not generic.',
    userMessage: `Tasks:\n${taskSummary}\n\nHabits this week:\n${habitSummary}\n\nToday's diet:\n${dietSummary}\n\nDaily log:\n${logSummary}`,
  });

  return extractText(data);
}
