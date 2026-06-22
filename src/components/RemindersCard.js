// ── Reminders Card ──────────────────────────────────────────

export function RemindersCard({ reminders, onAdd, onDelete, onMarkPaid }) {
  const el = document.createElement('div');
  el.className = 'card';

  const today = new Date();
  const todayDate = today.getDate();

  const getNextDue = (reminder) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (reminder.frequency === 'monthly') {
      let nextDate = new Date(today);
      nextDate.setDate(reminder.dueDay);
      if (nextDate < today) {
        nextDate.setMonth(nextDate.getMonth() + 1);
      }
      return nextDate;
    } else if (reminder.frequency === '15days') {
      let nextDate = new Date(today);
      nextDate.setDate(reminder.dueDay);
      while (nextDate < today) {
        nextDate.setDate(nextDate.getDate() + 15);
      }
      return nextDate;
    }
    return today;
  };

  const getDaysUntil = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const sortedReminders = reminders
    .map(r => ({ ...r, nextDue: getNextDue(r), daysUntil: getDaysUntil(getNextDue(r)) }))
    .sort((a, b) => a.daysUntil - b.daysUntil);

  const dueTodayList = sortedReminders.filter(r => r.daysUntil === 0);
  const upcomingList = sortedReminders.filter(r => r.daysUntil > 0 && r.daysUntil <= 7);
  const laterList = sortedReminders.filter(r => r.daysUntil > 7);

  el.innerHTML = `
    <div class="card-header">
      <h2>🔔 Reminders & Bills</h2>
      <span class="badge">${dueTodayList.length > 0 ? '⚠️ ' + dueTodayList.length : 'All set'}</span>
    </div>

    ${dueTodayList.length > 0 ? `
      <div class="reminder-section urgent">
        <h3>📌 Due Today</h3>
        ${dueTodayList.map(r => `
          <div class="reminder-item urgent-item">
            <div class="reminder-info">
              <div class="reminder-name">${r.name}</div>
              <div class="reminder-details">₹${r.amount} • ${r.bank}</div>
            </div>
            <button class="btn-icon paid-btn" data-id="${r.id}" title="Mark as paid">✓</button>
          </div>
        `).join('')}
      </div>
    ` : ''}

    ${upcomingList.length > 0 ? `
      <div class="reminder-section">
        <h3>📅 Upcoming (Next 7 days)</h3>
        ${upcomingList.map(r => `
          <div class="reminder-item">
            <div class="reminder-info">
              <div class="reminder-name">${r.name}</div>
              <div class="reminder-details">₹${r.amount} • ${r.bank} • ${r.daysUntil} days</div>
            </div>
            <button class="btn-icon" data-id="${r.id}">✕</button>
          </div>
        `).join('')}
      </div>
    ` : ''}

    ${laterList.length > 0 ? `
      <div class="reminder-section">
        <h3>📊 Later</h3>
        ${laterList.slice(0, 3).map(r => `
          <div class="reminder-item">
            <div class="reminder-info">
              <div class="reminder-name">${r.name}</div>
              <div class="reminder-details">₹${r.amount} • ${r.daysUntil} days</div>
            </div>
            <button class="btn-icon" data-id="${r.id}">✕</button>
          </div>
        `).join('')}
        ${laterList.length > 3 ? `<p class="text-muted">+${laterList.length - 3} more</p>` : ''}
      </div>
    ` : ''}

    <form class="form-reminder" id="reminder-form">
      <input type="text" id="reminder-name" placeholder="Bill name (e.g., ICICI SIP)" required />
      <input type="number" id="reminder-amount" placeholder="Amount (e.g., 500)" required />
      <input type="text" id="reminder-bank" placeholder="Bank/Provider" required />
      <div class="form-row">
        <input type="number" id="reminder-day" placeholder="Day (5-31)" min="1" max="31" required />
        <select id="reminder-freq" required>
          <option value="">Frequency...</option>
          <option value="monthly">Monthly</option>
          <option value="15days">Every 15 days</option>
        </select>
      </div>
      <button type="submit" class="btn">Add reminder</button>
    </form>
  `;

  el.querySelectorAll('.btn-icon.paid-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      onMarkPaid(id);
    });
  });

  el.querySelectorAll('.reminder-item .btn-icon:not(.paid-btn)').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      onDelete(id);
    });
  });

  el.querySelector('#reminder-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = el.querySelector('#reminder-name').value;
    const amount = el.querySelector('#reminder-amount').value;
    const bank = el.querySelector('#reminder-bank').value;
    const day = el.querySelector('#reminder-day').value;
    const freq = el.querySelector('#reminder-freq').value;

    onAdd(name, parseInt(amount), bank, parseInt(day), freq);
    el.querySelector('#reminder-form').reset();
  });

  return el;
}
