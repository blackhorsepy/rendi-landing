// ── CURSOR ──
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// ── SCROLL REVEAL ──
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

// ── LIVE CHAT ANIMATION ──
const msgs = [
  { type: 'in', text: 'Hola! 👋 Soy <strong>Rendi</strong>. Mandame la foto de tu factura y yo me encargo del resto.', delay: 600 },
  { type: 'out', text: 'Ahí va la foto 📸', delay: 1800, isImg: true },
  { type: 'typing', delay: 2800 },
  { type: 'receipt', delay: 4200 },
  { type: 'out', text: '✅', delay: 5600, isConfirm: true },
  { type: 'in', text: '🎉 <strong>¡Listo!</strong> Gasto de <strong style="color:var(--lime)">Gs 156.570</strong> registrado en Salud.<br><br>Podés verlo en tu <a href="https://dashboard.rendi.pro" target="_blank" style="color:var(--lime);text-decoration:underline;">dashboard</a> 📊', delay: 6400 },
];

const container = document.getElementById('chatMsgs');
let typingEl = null;

function addMsg(m) {
  if (m.type === 'typing') {
    typingEl = document.createElement('div');
    typingEl.className = 'typing';
    typingEl.innerHTML = '<span></span><span></span><span></span>';
    container.appendChild(typingEl);
    container.scrollTop = container.scrollHeight;
    return;
  }

  if (typingEl) { typingEl.remove(); typingEl = null; }

  if (m.type === 'receipt') {
    const el = document.createElement('div');
    el.className = 'receipt-bubble';
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    el.innerHTML = `
      <div class="receipt-top">
        🧾 <span class="rl">Factura detectada:</span><br>
        🏪 Farmacia Punto Farma<br>
        💰 Monto: Gs 156.570<br>
        📅 Fecha: 2026-03-01<br>
        🏷️ Categoría: Salud<br>
        📋 RUC: 80022877-4
      </div>
      <div class="receipt-btns">
        <div class="rb confirm">✅ Registrar</div>
        <div class="rb">✏️ Editar</div>
        <div class="rb cancel">❌ Cancelar</div>
      </div>`;
    container.appendChild(el);
    requestAnimationFrame(() => {
      el.style.transition = 'all .4s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
    container.scrollTop = container.scrollHeight;
    return;
  }

  const el = document.createElement('div');
  el.className = 'bubble ' + (m.type === 'in' ? 'rendi' : 'user');
  el.style.opacity = '0';
  el.style.transform = 'translateY(10px)';

  if (m.isImg) {
    el.innerHTML = `<div style="background:rgba(200,255,0,.08);border:1px solid rgba(200,255,0,.15);border-radius:10px;padding:20px;text-align:center;font-size:28px;margin-bottom:4px;">🧾</div><span style="font-size:11px;opacity:.5;">factura_farmacia.jpg</span><div class="bubble-time">ahora ✓✓</div>`;
  } else if (m.isConfirm) {
    el.innerHTML = `<span style="font-size:22px;">✅</span><div class="bubble-time">ahora ✓✓</div>`;
  } else {
    el.innerHTML = m.text + '<div class="bubble-time">ahora' + (m.type === 'out' ? ' ✓✓' : '') + '</div>';
  }

  container.appendChild(el);
  requestAnimationFrame(() => {
    el.style.transition = 'all .4s ease';
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });
  container.scrollTop = container.scrollHeight;
}

// Lanzar animación al cargar
msgs.forEach(m => setTimeout(() => addMsg(m), m.delay));

// Replay en loop cada 12 segundos
setTimeout(() => {
  setInterval(() => {
    container.innerHTML = '';
    msgs.forEach(m => setTimeout(() => addMsg(m), m.delay));
  }, 12000);
}, 8000);
