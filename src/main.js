import { createStore } from './utils/store.js';
import { Header } from './components/Header.js';
import { Metrics } from './components/Metrics.js';
import { EventsCard } from './components/EventsCard.js';
import { EmailsCard } from './components/EmailsCard.js';

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

document.getElementById('app').appendChild(header);
document.getElementById('app').appendChild(metrics);

const row = document.createElement('div');
row.className = 'grid-2';
row.appendChild(eventsCard);
row.appendChild(emailsCard);
document.getElementById('app').appendChild(row);
