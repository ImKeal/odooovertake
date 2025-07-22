const STORAGE_KEY = 'clock_entries';

function loadEntries() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  const parsed = JSON.parse(stored);
  return parsed.map(e => e.type ? e : { ...e, type: 'entrada' });
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function sendEntry(entry) {
  return fetch('/api/clock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry)
  }).then(res => res.ok)
    .catch(() => false);
}

function syncStored(setEntries) {
  const entries = loadEntries();
  const unsynced = entries.filter(e => !e.synced);
  if (!unsynced.length) return;
  Promise.all(unsynced.map(e => sendEntry(e))).then(results => {
    let changed = false;
    results.forEach((ok, idx) => {
      if (ok) {
        unsynced[idx].synced = true;
        changed = true;
      }
    });
    if (changed) {
      saveEntries(entries);
      setEntries(entries.slice());
    }
  });
}

function App() {
  const [entries, setEntries] = React.useState(loadEntries());

  React.useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  React.useEffect(() => {
    function handleOnline() {
      syncStored(setEntries);
    }
    window.addEventListener('online', handleOnline);
    // attempt initial sync
    handleOnline();
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  function addEntry(type) {
    const entry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type,
      synced: navigator.onLine
    };
    setEntries(prev => [...prev, entry]);
    if (navigator.onLine) {
      sendEntry(entry).then(ok => {
        if (ok) {
          setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, synced: true } : e));
        }
      });
    }
  }

  return React.createElement('div', { id: 'app' },
    React.createElement('h1', null, 'Marcaciones de Empleados'),
    React.createElement('div', { className: 'buttons' },
      React.createElement('button', { className: 'entrada', onClick: () => addEntry('entrada') }, 'Registrar Entrada'),
      React.createElement('button', { className: 'salida', onClick: () => addEntry('salida') }, 'Registrar Salida')
    ),
    React.createElement('ul', null,
      entries.map(e => {
        const text = `${new Date(e.timestamp).toLocaleString()} - ${e.type} - ${e.synced ? 'enviado' : 'pendiente'}`;
        return React.createElement('li', { key: e.id }, text);
      })
    )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js');
  });
}
