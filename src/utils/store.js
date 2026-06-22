// ── State ───────────────────────────────────────────────────
// Central state store with localStorage persistence

const STORAGE_KEY = 'dashboard_state';

const defaultState = {
  tasks: [
    { id: 1, text: 'Review Q3 report', done: false, priority: 'high' },
    { id: 2, text: 'Send follow-up emails', done: false, priority: 'med' },
    { id: 3, text: 'Update project timeline', done: true, priority: 'low' },
    { id: 4, text: 'Prepare for standup', done: false, priority: 'med' },
  ],
  habits: [
    { id: 1, name: 'Morning workout', days: [1, 1, 1, 0, 0, 0, 0] },
    { id: 2, name: 'Read 20 mins', days: [1, 1, 0, 1, 0, 0, 0] },
    { id: 3, name: 'Meditate', days: [1, 0, 1, 1, 0, 0, 0] },
    { id: 4, name: 'No social media after 9pm', days: [0, 1, 1, 0, 0, 0, 0] },
  ],
  diet: [
    { id: 1, date: '2025-06-21', meal: 'Breakfast', food: 'Oatmeal with berries', mood: 4 },
    { id: 2, date: '2025-06-21', meal: 'Lunch', food: 'Grilled chicken & salad', mood: 5 },
  ],
  dailyLog: [
    { date: '2025-06-21', entry: 'Completed 3 important tasks. Worked out 30 mins. Feeling productive!' },
    { date: '2025-06-20', entry: 'Had a good day. Finished the project milestone.' },
  ],
  reminders: [
    { id: 1, name: 'SIP', amount: 500, bank: 'ICICI', dueDay: 5, frequency: 'monthly' },
    { id: 2, name: 'HDFC', amount: 100, bank: 'HDFC', dueDay: 6, frequency: '15days' },
  ],
  taskCounter: 5,
  habitCounter: 5,
  dietCounter: 3,
  reminderCounter: 3,
  lastSync: null,
};

function load() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultState, ...JSON.parse(saved) } : { ...defaultState };
  } catch {
    return { ...defaultState };
  }
}

function save(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save state:', e);
  }
}

export function createStore() {
  let state = load();
  const listeners = new Set();

  function notify() {
    listeners.forEach(fn => fn(state));
  }

  return {
    getState: () => state,

    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },

    // ── Tasks ──────────────────────────────────────────────
    addTask(text, priority = 'med') {
      state = {
        ...state,
        tasks: [{ id: state.taskCounter, text, done: false, priority }, ...state.tasks],
        taskCounter: state.taskCounter + 1,
      };
      save(state);
      notify();
    },

    toggleTask(id) {
      state = {
        ...state,
        tasks: state.tasks.map(t => t.id === id ? { ...t, done: !t.done } : t),
      };
      save(state);
      notify();
    },

    deleteTask(id) {
      state = { ...state, tasks: state.tasks.filter(t => t.id !== id) };
      save(state);
      notify();
    },

    // ── Habits ─────────────────────────────────────────────
    addHabit(name) {
      state = {
        ...state,
        habits: [...state.habits, { id: state.habitCounter, name, days: [0, 0, 0, 0, 0, 0, 0] }],
        habitCounter: state.habitCounter + 1,
      };
      save(state);
      notify();
    },

    toggleHabitDay(id, dayIndex) {
      state = {
        ...state,
        habits: state.habits.map(h => {
          if (h.id !== id) return h;
          const days = [...h.days];
          days[dayIndex] = days[dayIndex] ? 0 : 1;
          return { ...h, days };
        }),
      };
      save(state);
      notify();
    },

    deleteHabit(id) {
      state = { ...state, habits: state.habits.filter(h => h.id !== id) };
      save(state);
      notify();
    },

    setLastSync(ts) {
      state = { ...state, lastSync: ts };
      save(state);
      notify();
    },

    // ── Diet ───────────────────────────────────────────────
    addDietEntry(meal, food, mood) {
      state = {
        ...state,
        diet: [...state.diet, { id: state.dietCounter, date: new Date().toISOString().split('T')[0], meal, food, mood }],
        dietCounter: state.dietCounter + 1,
      };
      save(state);
      notify();
    },

    deleteDietEntry(id) {
      state = { ...state, diet: state.diet.filter(d => d.id !== id) };
      save(state);
      notify();
    },

    getDietToday() {
      const today = new Date().toISOString().split('T')[0];
      return state.diet.filter(d => d.date === today);
    },

    // ── Daily Log ──────────────────────────────────────────
    addDailyLog(entry) {
      const today = new Date().toISOString().split('T')[0];
      const existing = state.dailyLog.find(d => d.date === today);
      state = {
        ...state,
        dailyLog: existing
          ? state.dailyLog.map(d => d.date === today ? { ...d, entry } : d)
          : [...state.dailyLog, { date: today, entry }],
      };
      save(state);
      notify();
    },

    getDailyLog(date) {
      return state.dailyLog.find(d => d.date === date);
    },

    // ── Reminders ──────────────────────────────────────────
    addReminder(name, amount, bank, dueDay, frequency) {
      state = {
        ...state,
        reminders: [...state.reminders, { id: state.reminderCounter, name, amount, bank, dueDay, frequency }],
        reminderCounter: state.reminderCounter + 1,
      };
      save(state);
      notify();
    },

    deleteReminder(id) {
      state = { ...state, reminders: state.reminders.filter(r => r.id !== id) };
      save(state);
      notify();
    },

    markReminderPaid(id) {
      console.log('Marked reminder', id, 'as paid');
      this.deleteReminder(id);
    },
  };
}
