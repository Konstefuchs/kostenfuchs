const socket = io(window.location.origin, { path: '/socket.io' });

const valueInput = document.getElementById('valueInput');
const sendBtn = document.getElementById('sendBtn');
const latencyMs = document.getElementById('latencyMs');
const historyEl = document.getElementById('history');

sendBtn.addEventListener('click', sendValue);
valueInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendValue();
});

function sendValue() {
  const value = valueInput.value.trim();
  if (!value) return;

  const startMs = performance.now();

  socket.emit('pipeline:value', value, (ack) => {
    const endMs = performance.now();
    const roundTripMs = Math.round(endMs - startMs);

    latencyMs.textContent = roundTripMs;
    addToHistory(value, roundTripMs);
    valueInput.value = '';
    valueInput.focus();
  });
}

function addToHistory(value, ms) {
  const entry = document.createElement('div');
  entry.className = 'flex justify-between items-center py-2 px-3 rounded bg-slate-700/30 text-sm';
  entry.innerHTML = `
    <span class="text-slate-300">"${escapeHtml(value)}"</span>
    <span class="font-mono text-emerald-400">${ms} ms</span>
  `;
  historyEl.insertBefore(entry, historyEl.firstChild);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
