import { createStore } from './utils/store.js';
import { Header } from './components/Header.js';
import { Metrics } from './components/Metrics.js';
import { EventsCard } from './components/EventsCard.js';
import { EmailsCard } from './components/EmailsCard.js';
import { TasksCard } from './components/TasksCard.js';
import { HabitsCard } from './components/HabitsCard.js';
import { DateSummary } from './components/DateSummary.js';

const store = createStore();
const state = store.getState();

document.getElementById('app').innerHTML = '';

const header = Header({
  onSync: () => alert('Sync clicked'),
  syncing: false,
  lastSync: state.lastSync,
});

const metrics = Metrics({
  tasks: state.tasks,
  habits: state.habits,
  eventsToday: 0,
  unreadEmails: 0,
});

const eventsCard = EventsCard({ events: [], loading: false });
const emailsCard = EmailsCard({ emails: [], loading: false });
const tasksCard = TasksCard({
  tasks: state.tasks,
  onToggle: (id) => { store.toggleTask(id); location.reload(); },
  onDelete: (id) => { store.deleteTask(id); location.reload(); },
  onAdd: (text) => { store.addTask(text); location.reload(); },
});
const habitsCard = HabitsCard({
  habits: state.habits,
  onToggle: (id, day) => { store.toggleHabitDay(id, day); location.reload(); },
  onDelete: (id) => { store.deleteHabit(id); location.reload(); },
  onAdd: (name) => { store.addHabit(name); location.reload(); },
});

document.getElementById('app').appendChild(header);
document.getElementById('app').appendChild(metrics);

const topRow = document.createElement('div');
topRow.className = 'grid-2';
topRow.appendChild(eventsCard);
topRow.appendChild(emailsCard);
document.getElementById('app').appendChild(topRow);

const bottomRow = document.createElement('div');
bottomRow.className = 'grid-2';
bottomRow.appendChild(tasksCard);
bottomRow.appendChild(habitsCard);
document.getElementById('app').appendChild(bottomRow);

const summaryCard = DateSummary({
  tasks: state.tasks,
  habits: state.habits,
  dailyLog: state.dailyLog,
});
document.getElementById('app').appendChild(summaryCard);
