// ── Daily Log Card ──────────────────────────────────────────

export function DailyLogCard({ dailyLog, onSave }) {
  const el = document.createElement('div');
  el.className = 'card';

  const today = new Date().toISOString().split('T')[0];
  const todayLog = dailyLog.find(d => d.date === today);
  const currentEntry = todayLog?.entry || '';

  el.innerHTML = `
    <div class="card-header">
      <h2>📔 Daily Log</h2>
      <span class="badge">${new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
    </div>

    <div class="log-container">
      <textarea id="log-input" placeholder="What did you do today? How did you feel? What did you learn?" class="log-input">${currentEntry}</textarea>
      <button id="save-log" class="btn">Save entry</button>
    </div>

    <div class="past-entries">
      <h3>Past entries</h3>
      ${dailyLog.slice().reverse().slice(0, 5).map(log => `
        <div class="past-entry">
          <span class="entry-date">${new Date(log.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
          <p>${log.entry.substring(0, 80)}${log.entry.length > 80 ? '...' : ''}</p>
        </div>
      `).join('')}
    </div>
  `;

  el.querySelector('#save-log').addEventListener('click', () => {
    const entry = el.querySelector('#log-input').value;
    if (entry.trim()) {
      onSave(entry);
      el.querySelector('#log-input').value = entry;
    }
  });

  return el;
}
