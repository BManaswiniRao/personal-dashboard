// ── Events Component ────────────────────────────────────────

const DOT_COLORS = ['#378ADD', '#1D9E75', '#EF9F27', '#D85A30', '#7F77DD'];
const BADGE_STYLES = {
  meeting: 'background:#E6F1FB;color:#185FA5',
  personal: 'background:#E1F5EE;color:#0F6E56',
  reminder: 'background:#FAEEDA;color:#854F0B',
};

export function EventsCard({ events, loading }) {
  const el = document.createElement('div');
  el.className = 'card';

  el.innerHTML = `
    <div class="card-header">
      <span class="card-title">
        <i class="ti ti-calendar-event" aria-hidden="true"></i> Upcoming events
      </span>
    </div>
    <div id="events-body"></div>
  `;

  const body = el.querySelector('#events-body');

  if (loading) {
    body.innerHTML = `<div class="loading-state"><span class="pulse">Fetching calendar...</span></div>`;
    return el;
  }

  if (!events || events.length === 0) {
    body.innerHTML = `
      <div class="empty-state">
        <i class="ti ti-calendar-off" aria-hidden="true"></i>
        No upcoming events
      </div>`;
    return el;
  }

  body.innerHTML = events.map((ev, i) => {
    const dot = DOT_COLORS[i % DOT_COLORS.length];
    const badge = BADGE_STYLES[ev.type] || BADGE_STYLES.meeting;
    const attendeeText = ev.attendees > 1 ? ` · ${ev.attendees} people` : '';
    return `
      <div class="event-item">
        <div class="event-dot" style="background:${dot}"></div>
        <div style="flex:1">
          <div class="event-name">${ev.title}</div>
          <div class="event-meta">
            <i class="ti ti-clock" style="font-size:11px" aria-hidden="true"></i>
            ${ev.time} · ${ev.date}${attendeeText}
          </div>
        </div>
        <span class="badge" style="${badge}">${ev.type || 'event'}</span>
      </div>`;
  }).join('');

  return el;
}
