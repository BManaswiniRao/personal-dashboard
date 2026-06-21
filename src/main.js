import { createStore } from './utils/store.js';
import { Header } from './components/Header.js';

const store = createStore();
const state = store.getState();

document.getElementById('app').innerHTML = '';
const header = Header({
  onSync: () => alert('Sync clicked'),
  syncing: false,
  lastSync: state.lastSync,
});
document.getElementById('app').appendChild(header);

console.log('Store loaded:', state.tasks.length, 'tasks');
