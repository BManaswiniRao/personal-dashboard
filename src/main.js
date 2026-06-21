import { Header } from './components/Header.js';

document.getElementById('app').innerHTML = '';
const header = Header({
  onSync: () => alert('Sync clicked'),
  syncing: false,
  lastSync: null,
});
document.getElementById('app').appendChild(header);
