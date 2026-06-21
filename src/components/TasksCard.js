// ── Tasks Component ─────────────────────────────────────────

const PRIORITY_STYLES = {
  high: { style: 'background:#FAECE7;color:#993C1D', label: 'High' },
  med:  { style: 'background:#FAEEDA;color:#854F0B', label: 'Med' },
  low:  { style: 'background:#EAF3DE;color:#3B6D11', label: 'Low' },
};

export function TasksCard({ tasks, onToggle, onDelete, onAdd }) {
  const el = document.createElement('div');
  el.className = 'card';

  el.innerHTML = `
    <div class="card-header">
      <span class="card-title">
        <i class="ti ti-list-check" aria-hidden="true"></i> Tasks
      </span>
    </div>
    <div id="tasks-body"></div>
    <div class="add-row">
      <input class="add-input" id="task-input" placeholder="Add a task..." />
      <button class="add-btn" id="add-task-btn" aria-label="Add task">
        <i class="ti ti-plus" aria-hidden="true"></i>
      </button>
    </div>
  `;

  function renderList() {
    const body = el.querySelector('#tasks-body');
    if (!tasks.length) {
      body.innerHTML = `<div class="empty-state" style="padding:12px 0">No tasks yet — add one below!</div>`;
      return;
    }
    body.innerHTML = tasks.map(t => {
      const pri = PRIORITY_STYLES[t.priority] || PRIORITY_STYLES.med;
      return `
        <div class="task-item" data-id="${t.id}">
          <div class="task-check ${t.done ? 'done' : ''}" role="checkbox" aria-checked="${t.done}" tabindex="0" data-toggle="${t.id}"></div>
          <span class="task-text ${t.done ? 'done' : ''}">${t.text}</span>
          <span class="badge" style="${pri.style};padding:2px 7px">${pri.label}</span>
          <button class="task-del" data-delete="${t.id}" aria-label="Delete task">
            <i class="ti ti-x" aria-hidden="true"></i>
          </button>
        </div>`;
    }).join('');
  }

  renderList();

  el.addEventListener('click', e => {
    const toggle = e.target.closest('[data-toggle]');
    if (toggle) { onToggle(Number(toggle.dataset.toggle)); return; }

    const del = e.target.closest('[data-delete]');
    if (del) { onDelete(Number(del.dataset.delete)); return; }
  });

  el.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      const toggle = e.target.closest('[data-toggle]');
      if (toggle) { e.preventDefault(); onToggle(Number(toggle.dataset.toggle)); }
    }
  });

  const input = el.querySelector('#task-input');
  const addBtn = el.querySelector('#add-task-btn');

  function handleAdd() {
    const val = input.value.trim();
    if (!val) return;
    onAdd(val);
    input.value = '';
  }

  addBtn.addEventListener('click', handleAdd);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') handleAdd(); });

  // Expose a re-render method for store updates
  el._rerender = (newTasks) => {
    tasks = newTasks;
    renderList();
  };

  return el;
}
