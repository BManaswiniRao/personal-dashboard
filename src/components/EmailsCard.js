// ── Emails Component ────────────────────────────────────────

const AV_COLORS = [
  { bg: '#E6F1FB', color: '#185FA5' },
  { bg: '#E1F5EE', color: '#0F6E56' },
  { bg: '#FAEEDA', color: '#854F0B' },
  { bg: '#EEEDFE', color: '#3C3489' },
  { bg: '#FAECE7', color: '#993C1D' },
];

export function EmailsCard({ emails, loading }) {
  const el = document.createElement('div');
  el.className = 'card';

  el.innerHTML = `
    <div class="card-header">
      <span class="card-title">
        <i class="ti ti-mail" aria-hidden="true"></i> Recent emails
      </span>
    </div>
    <div id="emails-body"></div>
  `;

  const body = el.querySelector('#emails-body');

  if (loading) {
    body.innerHTML = `<div class="loading-state"><span class="pulse">Fetching inbox...</span></div>`;
    return el;
  }

  if (!emails || emails.length === 0) {
    body.innerHTML = `
      <div class="empty-state">
        <i class="ti ti-inbox" aria-hidden="true"></i>
        Inbox is empty
      </div>`;
    return el;
  }

  body.innerHTML = emails.map((em, i) => {
    const av = AV_COLORS[i % AV_COLORS.length];
    return `
      <div class="email-item">
        <div class="email-avatar" style="background:${av.bg};color:${av.color}">
          ${em.initials || em.from.slice(0, 2).toUpperCase()}
        </div>
        <div style="flex:1;min-width:0">
          <div class="email-from">${em.from}</div>
          <div class="email-subject">${em.subject}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
          <span class="email-time">${em.time}</span>
          ${em.unread ? '<div class="unread-dot"></div>' : ''}
        </div>
      </div>`;
  }).join('');

  return el;
}
