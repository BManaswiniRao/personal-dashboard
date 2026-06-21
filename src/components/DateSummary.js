// ── Date Summary Component ──────────────────────────────────

export function DateSummary({ tasks, habits, dailyLog }) {
  const el = document.createElement('div');
  el.className = 'card';

  const today = new Date().toISOString().split('T')[0];
  let selectedDate = today;

  const renderSummary = () => {
    const dayLog = dailyLog.find(d => d.date === selectedDate);
    const tasksOnDay = tasks.filter(t => t.date === selectedDate || !t.date);
    const completedCount = tasksOnDay.filter(t => t.done).length;

    const dayName = new Date(selectedDate).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return `
      <div class="summary-content">
        <h3>${dayName}</h3>

        <div class="summary-section">
          <h4>📋 Tasks</h4>
          ${tasksOnDay.length === 0 ? '<p class="empty">No tasks</p>' : `
            <p><strong>${completedCount}/${tasksOnDay.length}</strong> completed</p>
            ${tasksOnDay.map(t => `
              <div class="summary-item">
                <span class="check">${t.done ? '✓' : '○'}</span>
                <span class="${t.done ? 'done' : ''}">${t.text}</span>
              </div>
            `).join('')}
          `}
        </div>

        ${dayLog ? `
          <div class="summary-section">
            <h4>📔 Daily Note</h4>
            <p class="note-text">"${dayLog.entry}"</p>
          </div>
        ` : ''}

        <div class="summary-section">
          <h4>📊 Summary</h4>
          <p>📅 <strong>${dayName}</strong></p>
          <p>✅ <strong>${completedCount}</strong> tasks completed</p>
        </div>
      </div>
    `;
  };

  el.innerHTML = `
    <div class="card-header">
      <h2>📅 What I Did</h2>
      <input type="date" id="date-picker" value="${today}" class="date-input" />
    </div>
    <div id="summary-body">
      ${renderSummary()}
    </div>
  `;

  const datePicker = el.querySelector('#date-picker');
  const summaryBody = el.querySelector('#summary-body');

  datePicker.addEventListener('change', (e) => {
    selectedDate = e.target.value;
    summaryBody.innerHTML = renderSummary();
  });

  return el;
}
