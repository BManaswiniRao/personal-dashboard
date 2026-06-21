// ── Habits Component ────────────────────────────────────────

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Monday = 0 in our array; JS getDay(): 0=Sun,1=Mon,...
const todayIndex = (() => {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
})();

export function HabitsCard({ habits, onToggle, onDelete, onAdd }) {
  const el = document.createElement('div');
  el.className = 'card';

  el.innerHTML = `
    <div class="card-header">
      <span class="card-title">
        <i class="ti ti-repeat" aria-hidden="true"></i> Daily habits
      </span>
    </div>
    <div id="habits-body"></div>
    <div class="add-row">
      <input class="add-input" id="habit-input" placeholder="Add a habit..." />
      <button class="add-btn" id="add-habit-btn" aria-label="Add habit">
        <i class="ti ti-plus" aria-hidden="true"></i>
      </button>
    </div>
  `;

  function renderList() {
    const body = el.querySelector('#habits-body');
    if (!habits.length) {
      body.innerHTML = `<div class="empty-state" style="padding:12px 0">No habits yet — add one below!</div>`;
      return;
    }
    body.innerHTML = habits.map(h => `
      <div class="habit-row" data-id="${h.id}">
        <span class="habit-name">${h.name}</span>
        <div class="habit-days">
          ${h.days.map((d, i) => `
            <div class="habit-day ${d ? 'done' : ''} ${i === todayIndex ? 'today' : ''}"
              data-habit="${h.id}" data-day="${i}"
              title="${DAY_NAMES[i]}"
              role="checkbox"
              aria-checked="${Boolean(d)}"
              tabindex="0">${DAY_LABELS[i]}</div>
          `).join('')}
        </div>
        <button class="habit-del" data-delete="${h.id}" aria-label="Delete habit">
          <i class="ti ti-x" aria-hidden="true"></i>
        </button>
      </div>
    `).join('');
  }

  renderList();

  el.addEventListener('click', e => {
    const day = e.target.closest('[data-habit][data-day]');
    if (day) { onToggle(Number(day.dataset.habit), Number(day.dataset.day)); return; }

    const del = e.target.closest('[data-delete]');
    if (del) { onDelete(Number(del.dataset.delete)); return; }
  });

  const input = el.querySelector('#habit-input');
  const addBtn = el.querySelector('#add-habit-btn');

  function handleAdd() {
    const val = input.value.trim();
    if (!val) return;
    onAdd(val);
    input.value = '';
  }

  addBtn.addEventListener('click', handleAdd);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') handleAdd(); });

  el._rerender = (newHabits) => {
    habits = newHabits;
    renderList();
  };

  return el;
}
