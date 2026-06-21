// ── Main App ────────────────────────────────────────────────

import { createStore } from './utils/store.js';
import { fetchCalendarEvents, fetchEmails } from './api/claude.js';
import { Header } from './components/Header.js';
import { Metrics } from './components/Metrics.js';
import { EventsCard } from './components/EventsCard.js';
import { EmailsCard } from './components/EmailsCard.js';
import { TasksCard } from './components/TasksCard.js';
import { HabitsCard } from './components/HabitsCard.js';

// ── App state ───────────────────────────────────────────────
const store = createStore();
let liveData = { events: [], emails: [], loading: true };
let syncing = false;

// ── Render ──────────────────────────────────────────────────
function render() {
  try {
    const app = document.getElementById('app');
    const state = store.getState();

    app.innerHTML = '';

    const dashboard = document.createElement('div');
    dashboard.className = 'dashboard';

  // Header
  const header = Header({
    onSync: syncAll,
    syncing,
    lastSync: state.lastSync,
  });

  // Metrics
  const eventsToday = liveData.events.filter(e => e.date === 'Today').length;
  const unreadEmails = liveData.loading ? null : liveData.emails.filter(e => e.unread).length;
  const metrics = Metrics({
    tasks: state.tasks,
    habits: state.habits,
    eventsToday,
    unreadEmails,
  });

  // Top row: events + emails
  const topRow = document.createElement('div');
  topRow.className = 'grid-2';
  topRow.appendChild(EventsCard({ events: liveData.events, loading: liveData.loading }));
  topRow.appendChild(EmailsCard({ emails: liveData.emails, loading: liveData.loading }));

  // Bottom row: tasks + habits
  const bottomRow = document.createElement('div');
  bottomRow.className = 'grid-2';
  bottomRow.appendChild(TasksCard({
    tasks: state.tasks,
    onToggle: (id) => { store.toggleTask(id); render(); },
    onDelete: (id) => { store.deleteTask(id); render(); },
    onAdd: (text) => { store.addTask(text); render(); },
  }));
  bottomRow.appendChild(HabitsCard({
    habits: state.habits,
    onToggle: (id, day) => { store.toggleHabitDay(id, day); render(); },
    onDelete: (id) => { store.deleteHabit(id); render(); },
    onAdd: (name) => { store.addHabit(name); render(); },
  }));

  dashboard.appendChild(header);
  dashboard.appendChild(metrics);
  dashboard.appendChild(topRow);
  dashboard.appendChild(bottomRow);
  app.appendChild(dashboard);
  } catch (error) {
    console.error('Render error:', error);
    document.getElementById('app').innerHTML = '<h1>Error loading dashboard. Check console.</h1>';
  }
}

// ── Sync ────────────────────────────────────────────────────
async function syncAll() {
  if (syncing) return;
  syncing = true;
  liveData = { events: [], emails: [], loading: true };
  render();

  try {
    const [events, emails] = await Promise.all([
      fetchCalendarEvents().catch(() => []),
      fetchEmails().catch(() => []),
    ]);
    liveData = { events, emails, loading: false };
    store.setLastSync(Date.now());
  } catch (err) {
    console.error('Sync failed:', err);
    liveData = { events: [], emails: [], loading: false };
  }

  syncing = false;
  render();
}


// ── Boot ────────────────────────────────────────────────────
render();
syncAll();
