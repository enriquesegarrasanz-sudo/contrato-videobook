// app.js — lógica principal de la aplicación

// DATE
const now = new Date();
document.getElementById('docDate').textContent = 'Madrid, ' + now.toLocaleDateString('es-ES', { day:'numeric', month:'long', year:'numeric' });

// SCROLL ANIMATION
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });
document.querySelectorAll('.section').forEach(s => observer.observe(s));

// PROGRESS
window.addEventListener('scroll', () => {
  const doc = document.documentElement;
  const pct = (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100;
  document.getElementById('progressFill').style.width = pct + '%';
});

// CHECKBOXES
function toggleCheck(id) {
  const input = document.getElementById(id);
  input.checked = !input.checked;
  input.closest('.check-group').classList.toggle('checked', input.checked);
}

// SIGNATURE PAD
const canvas = document.getElementById('sigPad');
const ctx = canvas.getContext('2d');
let drawing = false;
let hasSig = false;

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * ratio;
  canvas.height = rect.height * ratio;
  ctx.scale(ratio, ratio);
  ctx.strokeStyle = '#1a1a2e';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
}

window.addEventListener('resize', () => { if(!hasSig) resizeCanvas(); });
setTimeout(resizeCanvas, 100);

function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  if(e.touches) return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

canvas.addEventListener('mousedown', e => { drawing = true; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); });
canvas.addEventListener('mousemove', e => { if(!drawing) return; const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); hasSig = true; document.getElementById('sigHint').style.display='none'; });
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mouseleave', () => drawing = false);

canvas.addEventListener('touchstart', e => { e.preventDefault(); drawing = true; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); }, { passive: false });
canvas.addEventListener('touchmove', e => { e.preventDefault(); if(!drawing) return; const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); hasSig = true; document.getElementById('sigHint').style.display='none'; }, { passive: false });
canvas.addEventListener('touchend', () => drawing = false);

function clearSignature() {
  const rect = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);
  hasSig = false;
  document.getElementById('sigHint').style.display='block';
}

// VALIDATION
function validate() {
  const name = document.getElementById('clientName').value.trim();
  const nif = document.getElementById('clientNIF').value.trim();
  const email = document.getElementById('clientEmail').value.trim();
  const chk1 = document.getElementById('chk1').checked;
  const chk2 = document.getElementById('chk2').checked;

  if(!name) { showStatus('Por favor, introduce tu nombre completo.', 'err'); return false; }
  if(!nif) { showStatus('Por favor, introduce tu NIF / DNI.', 'err'); return false; }
  if(!email) { showStatus('Por favor, introduce tu correo electrónico.', 'err'); return false; }
  if(!chk1) { showStatus('Debes marcar el consentimiento de grabación.', 'err'); return false; }
  if(!chk2) { showStatus('Debes aceptar los términos del contrato.', 'err'); return false; }
  if(!hasSig) { showStatus('Por favor, añade tu firma en el recuadro.', 'err'); return false; }
  return true;
}

function showStatus(msg, type) {
  const el = document.getElementById('statusMsg');
  el.className = 'status-msg ' + type;
  el.textContent = msg;
}

// BUILD PDF TEXT
function buildPDFContent(doc, name, nif, email, phone, dateStr) {
  const lm = 20, rm = 190, lw = rm - lm;
  let y = 20;

  function addLine(h = 6) { y += h; }
  function checkPage() { if(y > 270) { doc.addPage(); y = 20; } }

  // HEADER
  doc.setFillColor(26, 26, 46);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(200, 147, 58);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('CONTRATO DE SERVICIOS AUDIOVISUALES', 105, 14, {align:'center'});
  doc.setTextColor(255,255,255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Videobook · Portfolio de Actor', 105, 25, {align:'center'});
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180,180,200);
  doc.text('Madrid, ' + dateStr, 105, 34, {align:'center'});

  y = 52;
  doc.setTextColor(26,26,46);

  function sectionTitle(num, title) {
    checkPage();
    doc.setDrawColor(200, 147, 58);
    doc.setLineWidth(0.5);
    doc.line(lm, y, rm, y);
    addLine(5);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(200, 147, 58);
    doc.text(num + '. ' + title.toUpperCase(), lm, y);
    addLine(6);
    doc.setTextColor(26,26,46);
  }

  function para(text, size=9) {
    doc.setFontSize(size);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60,60,74);
    const lines = doc.splitTextToSize(text, lw);
    lines.forEach(line => { checkPage(); doc.text(line, lm, y); addLine(5); });
    addLine(2);
  }

  function bold(text, size=9) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(26,26,46);
    doc.setFontSize(size);
    checkPage();
    doc.text(text, lm, y);
    addLine(6);
  }

  // 1. PARTES
  sectionTitle('1', 'Partes del contrato');
  doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(26,26,46);
  doc.text('Cliente:', lm, y); addLine(5);
  doc.setFont('helvetica','normal'); doc.setTextColor(60,60,74);
  doc.text('Nombre: ' + name, lm+4, y); addLine(5);
  doc.text('NIF: ' + nif, lm+4, y); addLine(5);
  doc.text('Email: ' + email, lm+4, y); addLine(5);
  if(phone) { doc.text('Teléfono: ' + phone, lm+4, y); addLine(5); }
  addLine(3);

  // 2. OBJETO
  sectionTitle('2', 'Objeto del contrato');
  para('El prestador se compromete a realizar una escena de videobook para el portfolio profesional de actor/actriz del cliente, cubriendo todas las fases del proceso creativo y técnico.');

  // 3. SERVICIOS
  sectionTitle('3', 'Servicios incluidos (300 €)');
  const svcs = [
    'Charla previa de desarrollo artístico.',
    'Creación del guión adaptado al perfil del cliente.',
    'Ensayo previo al rodaje.',
    'Grabación de la escena.',
    'Edición, corrección de color y postproducción.',
    'Pack de fotografías del rodaje y resultado final.',
    'Dos (2) revisiones incluidas sin coste adicional.',
  ];
  svcs.forEach(s => { checkPage(); doc.setFontSize(9); doc.setFont('helvetica','normal'); doc.setTextColor(60,60,74); doc.text('– ' + s, lm+3, y); addLine(5); });
  addLine(2);

  // 4–9 (condensed)
  sectionTitle('4', 'Revisiones adicionales');
  para('Las dos primeras revisiones están incluidas. A partir de la tercera, cada ronda adicional tiene un suplemento de 30 €.');

  sectionTitle('5', 'Transporte y desplazamiento');
  para('El transporte no está incluido. En caso de ser necesario, el coste irá aparte según el trayecto real, acordado previamente. El prestador optará por transporte compartido (Cabify Pool / Uber) para mantener el coste razonable.');

  sectionTitle('6', 'Uso de Inteligencia Artificial y grabación de la charla previa');
  para('El prestador utiliza herramientas de IA como co-guionista en su proceso creativo. Para ello cuenta con el consentimiento expreso del cliente para grabar la charla previa. Dicha grabación se utilizará exclusivamente para la elaboración del guión y será eliminada una vez concluido el servicio.');

  sectionTitle('7', 'Confidencialidad y protección de datos');
  para('Todo el material generado tiene carácter estrictamente confidencial y será tratado conforme al RGPD (UE) 2016/679 y la normativa española de protección de datos. El prestador se compromete a no compartir el material con terceros ni utilizarlo para ninguna otra finalidad.');

  sectionTitle('8', 'Precio y forma de pago');
  para('Servicio base: 300 €. Revisiones adicionales: 30 € / ronda. Transporte: según trayecto. Pago: 50 % en la firma, 50 % a la entrega, salvo acuerdo distinto.');

  sectionTitle('9', 'Derechos de uso');
  para('El material entregado podrá ser utilizado para fines exclusivos de portfolio y presentación profesional. Cualquier uso comercial deberá acordarse por escrito.');

  // FIRMAS
  addLine(4);
  sectionTitle('10', 'Consentimientos y firma');
  doc.setFontSize(9); doc.setFont('helvetica','normal'); doc.setTextColor(60,60,74);
  doc.text('[✓] Consiento la grabación de la charla previa (véase apartado 6).', lm, y); addLine(5);
  doc.text('[✓] He leído y acepto íntegramente los términos del contrato.', lm, y); addLine(5);
  addLine(4);

  return y;
}

// GENERATE PDF
async function generatePDF() {
  if(!validate()) return;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit:'mm', format:'a4', orientation:'portrait' });
  const name = document.getElementById('clientName').value.trim();
  const nif = document.getElementById('clientNIF').value.trim();
  const email = document.getElementById('clientEmail').value.trim();
  const phone = document.getElementById('clientPhone').value.trim();
  const dateStr = now.toLocaleDateString('es-ES', { day:'numeric', month:'long', year:'numeric' });

  let y = buildPDFContent(doc, name, nif, email, phone, dateStr);

  // Signature
  if(hasSig) {
    if(y > 230) { doc.addPage(); y = 20; }
    doc.setFontSize(8); doc.setTextColor(100,100,120);
    doc.text('Firma del cliente:', 20, y + 4);
    const sigData = canvas.toDataURL('image/png');
    doc.addImage(sigData, 'PNG', 20, y + 6, 80, 30);
    y += 42;
  }

  // Footer
  doc.setFontSize(7); doc.setTextColor(150,150,170);
  doc.text('Documento confidencial — uso exclusivo de las partes firmantes · Madrid · ' + dateStr, 105, 290, {align:'center'});

  doc.save('Contrato_Videobook_' + name.replace(/\s+/g, '_') + '.pdf');
  showStatus('PDF descargado correctamente. Compártelo por WhatsApp.', 'ok');
}

// SEND BY EMAIL
async function sendByEmail() {
  if(!validate()) return;
  const emailPrestador = document.getElementById('emailPrestador').value.trim();
  const emailCliente = document.getElementById('emailCopy').value.trim();
  if(!emailPrestador) { showStatus('Introduce el email del prestador.', 'err'); return; }

  showStatus('Generando PDF y enviando...', 'sending');

  const name = document.getElementById('clientName').value.trim();
  const nif = document.getElementById('clientNIF').value.trim();
  const email = document.getElementById('clientEmail').value.trim();
  const phone = document.getElementById('clientPhone').value.trim();
  const dateStr = now.toLocaleDateString('es-ES', { day:'numeric', month:'long', year:'numeric' });

  // Build PDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit:'mm', format:'a4', orientation:'portrait' });
  let y = buildPDFContent(doc, name, nif, email, phone, dateStr);
  if(hasSig) {
    if(y > 230) { doc.addPage(); y = 20; }
    const sigData = canvas.toDataURL('image/png');
    doc.addImage(sigData, 'PNG', 20, y + 6, 80, 30);
  }
  doc.setFontSize(7); doc.setTextColor(150,150,170);
  doc.text('Documento confidencial · Madrid · ' + dateStr, 105, 290, {align:'center'});

  // Download PDF locally
  doc.save('Contrato_Videobook_' + name.replace(/\s+/g, '_') + '.pdf');

  // Get base64 PDF (without data URI prefix)
  const pdfBase64 = doc.output('datauristring').split(',')[1];
  const fileName = 'Contrato_Videobook_' + name.replace(/\s+/g, '_') + '.pdf';

  const htmlBody = `
    <div style="font-family:sans-serif;color:#1a1a2e;max-width:600px">
      <h2 style="color:#c8933a">Contrato Videobook firmado</h2>
      <p>Se ha firmado digitalmente un contrato de servicios Videobook.</p>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:6px 12px;background:#f5ede0;font-weight:bold">Cliente</td><td style="padding:6px 12px">${name}</td></tr>
        <tr><td style="padding:6px 12px;background:#f5ede0;font-weight:bold">NIF</td><td style="padding:6px 12px">${nif}</td></tr>
        <tr><td style="padding:6px 12px;background:#f5ede0;font-weight:bold">Email</td><td style="padding:6px 12px">${email}</td></tr>
        <tr><td style="padding:6px 12px;background:#f5ede0;font-weight:bold">Teléfono</td><td style="padding:6px 12px">${phone || 'No indicado'}</td></tr>
        <tr><td style="padding:6px 12px;background:#f5ede0;font-weight:bold">Fecha</td><td style="padding:6px 12px">${dateStr}</td></tr>
      </table>
      <p style="margin-top:16px">El contrato firmado se adjunta en este email en formato PDF.</p>
      <p style="color:#6b6b80;font-size:12px">Documento generado automáticamente — Enrique Segarra Sanz · Videobook</p>
    </div>`;

  const WORKER_URL = 'https://contrato-email-proxy.enriquesegarrasanz.workers.dev';

  async function sendViaWorker(toEmail, toName) {
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toEmail, toName, clientName: name, nif, email, phone, dateStr, pdfBase64, fileName })
    });
    return res.ok;
  }

  try {
    const recipients = [sendViaWorker(emailPrestador, 'Enrique Segarra')];
    if(emailCliente) recipients.push(sendViaWorker(emailCliente, name));
    const results = await Promise.all(recipients);
    const allOk = results.every(Boolean);
    if(allOk) {
      const dest = emailCliente ? emailPrestador + ' y ' + emailCliente : emailPrestador;
      showStatus('✓ PDF descargado y enviado con adjunto a: ' + dest, 'ok');
    } else {
      showStatus('PDF descargado. Algunos emails no se pudieron enviar, inténtalo de nuevo.', 'err');
    }
  } catch(e) {
    showStatus('PDF descargado. Error al enviar email: ' + e.message, 'err');
  }
}
