import { createStore } from './utils/store.js';
import { Header } from './components/Header.js';
import { Metrics } from './components/Metrics.js';

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

document.getElementById('app').appendChild(header);
document.getElementById('app').appendChild(metrics);
