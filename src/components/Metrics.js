// ── Metrics Component ────────────────────────────────────────

export function Metrics({ tasks, habits, eventsToday, unreadEmails }) {
  const el = document.createElement('div');
  el.className = 'metrics';

  const done = tasks.filter(t => t.done).length;
  const total = tasks.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const maxStreak = habits.length
    ? Math.max(...habits.map(h => h.days.filter(Boolean).length))
    : 0;

  const metrics = [
    {
      label: 'Events today',
      icon: 'ti-calendar',
      value: eventsToday,
      sub: eventsToday === 1 ? '1 event scheduled' : `${eventsToday} events scheduled`,
    },
    {
      label: 'Tasks done',
      icon: 'ti-check',
      value: `${done}/${total}`,
      sub: `${pct}% complete`,
      progress: pct,
    },
    {
      label: 'Best habit streak',
      icon: 'ti-flame',
      value: maxStreak,
      sub: 'days this week',
    },
    {
      label: 'Unread emails',
      icon: 'ti-mail',
      value: unreadEmails ?? '—',
      sub: unreadEmails === 1 ? '1 message' : `${unreadEmails ?? '...'} messages`,
    },
  ];

  el.innerHTML = metrics.map(m => `
    <div class="metric-card">
      <div class="metric-label">
        <i class="ti ${m.icon}" aria-hidden="true"></i>${m.label}
      </div>
      <div class="metric-value">${m.value}</div>
      <div class="metric-sub">${m.sub}</div>
      ${m.progress !== undefined ? `
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${m.progress}%"></div>
        </div>
      ` : ''}
    </div>
  `).join('');

  return el;
}
