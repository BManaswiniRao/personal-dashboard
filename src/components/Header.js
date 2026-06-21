// ── Header Component ────────────────────────────────────────

export function Header({ onSync, syncing, lastSync }) {
  const el = document.createElement('div');
  el.className = 'header';

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const dateStr = now.toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const lastSyncText = lastSync
    ? `Last synced ${new Date(lastSync).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`
    : 'Not yet synced';

  el.innerHTML = `
    <div class="header-left">
      <h1>${greeting} ☀️</h1>
      <p>${dateStr}</p>
    </div>
    <div class="header-right">
      <span class="status-pill">
        <span class="status-dot"></span>
        ${lastSyncText}
      </span>
      <button class="btn" id="sync-btn">
        <i class="ti ti-refresh ${syncing ? 'pulse' : ''}" aria-hidden="true"></i>
        ${syncing ? 'Syncing...' : 'Sync now'}
      </button>
    </div>
  `;

  el.querySelector('#sync-btn').addEventListener('click', onSync);
  return el;
}
