const center = [17.4948, 78.3996];
const route = [
  [17.4907,78.3857],[17.4931,78.3908],[17.4954,78.3950],[17.4972,78.3998],[17.4982,78.4048],[17.5005,78.4095]
];
let busIndex = 2;
let map, heroMap, busMarker;

function setupMap(id, zoom) {
  const m = L.map(id, { zoomControl: false }).setView(center, zoom);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }).addTo(m);
  return m;
}
function addRoute(m) {
  L.polyline(route, { color:'#66e887', weight:5, opacity:.85 }).addTo(m);
  route.forEach((p, i) => {
    L.circleMarker(p, { radius: i === 3 ? 8 : 5, color:'#07100d', weight:2, fillColor:'#7cf29a', fillOpacity:1 }).addTo(m);
  });
}
function addBus(m) {
  const icon = L.divIcon({ className:'bus-marker', html:'<div style="width:34px;height:34px;border-radius:50%;background:#7cf29a;color:#07100d;display:grid;place-items:center;font-size:17px;border:3px solid #07100d;box-shadow:0 0 0 5px rgba(124,242,154,.18)">🚌</div>', iconSize:[34,34], iconAnchor:[17,17] });
  return L.marker(route[busIndex], {icon}).addTo(m);
}
function updateBus() {
  busIndex = (busIndex + 1) % route.length;
  if (busMarker) busMarker.setLatLng(route[busIndex]);
  const eta = Math.max(5, 10 - busIndex);
  document.querySelector('#eta').textContent = String(eta).padStart(2,'0');
  document.querySelector('#heroEta').textContent = String(eta).padStart(2,'0') + ' min';
  document.querySelector('#stopEta').textContent = `Arriving in ${eta} min`;
  document.querySelector('#progressBar').style.width = `${Math.min(92, 45 + busIndex*9)}%`;
}

window.addEventListener('DOMContentLoaded', () => {
  map = setupMap('map', 14);
  addRoute(map);
  busMarker = addBus(map);
  heroMap = setupMap('heroMap', 14.5);
  addRoute(heroMap);
  addBus(heroMap);
  document.querySelector('#recenter').addEventListener('click', () => map.setView(route[busIndex], 15));
  const reminder = document.querySelector('#reminder');
  const notifyBtn = document.querySelector('#notifyBtn');
  const note = document.querySelector('#demoNote');
  notifyBtn.addEventListener('click', () => {
    reminder.checked = true;
    note.textContent = '✓ Reminder set. We’ll alert you 5 minutes before the bus reaches Green Park.';
    note.style.color = '#7cf29a';
  });
  reminder.addEventListener('change', () => {
    note.textContent = reminder.checked ? 'Reminder is enabled for Green Park.' : 'Reminder is turned off.';
    note.style.color = '';
  });
  setInterval(updateBus, 4500);
});
