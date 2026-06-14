/* ============================================
   CN+ Sistem Garansi Proteksi HP
   app.js — Main Application Logic
   ============================================ */

let activeHP   = null;
let activeTier = null;
let claims     = JSON.parse(localStorage.getItem('cnplus_claims') || '[]');

/* ── HELPERS ──────────────────────────────── */
function fmtRp(n) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

function fmtDate(d) {
  return new Date(d).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

/* ── NAVIGASI VIEW ────────────────────────── */
function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
  const map = { 'daftar-hp': 0, 'form-klaim': 1, 'riwayat': 2 };
  document.querySelectorAll('.nav-tab')[map[id]]?.classList.add('active');

  if (id === 'riwayat') renderTable();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── DAFTAR HP ────────────────────────────── */
function renderHP(list) {
  const g = document.getElementById('hpGrid');
  if (!list.length) {
    g.innerHTML = '<p style="color:var(--muted);grid-column:1/-1;padding:20px 0">Tidak ditemukan.</p>';
    return;
  }
  g.innerHTML = list.map(hp => `
    <div class="hp-card" onclick="pilihHP(${hp.id})">
      <div class="hp-brand">${hp.brand}</div>
      <div class="hp-name">${hp.name}</div>
      <div class="hp-type">${hp.type}</div>
      <div class="hp-price">${fmtRp(hp.price)} <small>harga pasaran</small></div>
      <button class="btn-pilih">Pilih Perangkat ini →</button>
    </div>
  `).join('');
}

function filterHP() {
  const q  = document.getElementById('searchHP').value.toLowerCase();
  const br = document.getElementById('filterBrand').value;
  const tp = document.getElementById('filterType').value;

  renderHP(HP_LIST.filter(hp =>
    (!q  || hp.brand.toLowerCase().includes(q) || hp.name.toLowerCase().includes(q)) &&
    (!br || hp.brand === br) &&
    (!tp || hp.type === tp)
  ));
}

/* ── PILIH HP ─────────────────────────────── */
function pilihHP(id) {
  activeHP   = HP_LIST.find(h => h.id === id);
  activeTier = null;

  document.getElementById('f_merk').value  = activeHP.brand;
  document.getElementById('f_tipe').value  = activeHP.name;
  document.getElementById('f_harga').value = fmtRp(activeHP.price);

  // Reset form fields
  ['f_nama','f_nohp','f_email','f_tglbeli','f_imei'].forEach(id => {
    document.getElementById(id).value = '';
  });

  document.getElementById('tierSilver').classList.remove('selected');
  document.getElementById('tierGold').classList.remove('selected');

  updateSummary();
  showView('form-klaim');
}

/* ── PILIH TIER ───────────────────────────── */
function pilihTier(t) {
  activeTier = t;
  document.getElementById('tierSilver').classList.toggle('selected', t === 'silver');
  document.getElementById('tierGold').classList.toggle('selected', t === 'gold');
  updateSummary();
}

/* ── UPDATE SUMMARY ───────────────────────── */
function updateSummary() {
  const tgl = document.getElementById('f_tglbeli').value;

  document.getElementById('s_nama').textContent      = document.getElementById('f_nama').value  || '—';
  document.getElementById('s_nohp').textContent      = document.getElementById('f_nohp').value  || '—';
  document.getElementById('s_email').textContent     = document.getElementById('f_email').value || '—';
  document.getElementById('s_tgl').textContent       = tgl
    ? new Date(tgl).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })
    : '—';
  document.getElementById('s_perangkat').textContent = activeHP
    ? activeHP.brand + ' ' + activeHP.name : '—';
  document.getElementById('s_harga').textContent     = activeHP  ? fmtRp(activeHP.price) : '—';
  document.getElementById('s_imei').textContent      = document.getElementById('f_imei').value  || '—';
  document.getElementById('s_tier').textContent      = activeTier ? TIER[activeTier].label : '—';
  document.getElementById('s_total').textContent     = activeTier ? fmtRp(TIER[activeTier].price) : '—';
}

// Live update summary saat ketik
['f_nama','f_nohp','f_email','f_tglbeli','f_imei'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', updateSummary);
});

/* ── SIMPAN KLAIM ─────────────────────────── */
function simpanKlaim() {
  const nama  = document.getElementById('f_nama').value.trim();
  const nohp  = document.getElementById('f_nohp').value.trim();
  const email = document.getElementById('f_email').value.trim();
  const tgl   = document.getElementById('f_tglbeli').value;
  const imei  = document.getElementById('f_imei').value.trim();

  if (!activeHP)                              return alert('Pilih perangkat terlebih dahulu.');
  if (!nama || !nohp || !email || !tgl || !imei) return alert('Lengkapi semua data yang wajib diisi (*).');
  if (!activeTier)                            return alert('Pilih tier proteksi terlebih dahulu.');

  const noKlaim = 'CN-' + Date.now().toString().slice(-8);

  claims.unshift({
    no:       noKlaim,
    tglDaftar: new Date().toISOString().split('T')[0],
    nama, nohp, email,
    tglBeli:  tgl,
    merk:     activeHP.brand,
    tipe:     activeHP.name,
    imei,
    harga:    activeHP.price,
    tier:     activeTier,
    biaya:    TIER[activeTier].price,
  });

  localStorage.setItem('cnplus_claims', JSON.stringify(claims));
  document.getElementById('modalNoKlaim').textContent = noKlaim;
  document.getElementById('modalBackdrop').classList.add('show');
}

/* ── MODAL ────────────────────────────────── */
function tutupModal() {
  document.getElementById('modalBackdrop').classList.remove('show');
  pilihHP(activeHP.id);
}

function keRiwayat() {
  document.getElementById('modalBackdrop').classList.remove('show');
  showView('riwayat');
}

/* ── RENDER TABEL RIWAYAT ─────────────────── */
function renderTable() {
  const q  = document.getElementById('searchKlaim').value.toLowerCase();
  const ft = document.getElementById('filterTier').value;

  const data = claims.filter(c =>
    (!q  || c.nama.toLowerCase().includes(q) ||
             c.no.toLowerCase().includes(q)   ||
             c.imei.toLowerCase().includes(q)) &&
    (!ft || c.tier === ft)
  );

  const tbody = document.getElementById('tableBody');

  if (!data.length) {
    tbody.innerHTML = `
      <tr><td colspan="10">
        <div class="empty-state">
          <div class="empty-icon">📋</div>
          <p>Belum ada data klaim</p>
        </div>
      </td></tr>`;
  } else {
    tbody.innerHTML = data.map(c => `
      <tr>
        <td class="no-klaim">${c.no}</td>
        <td>${fmtDate(c.tglDaftar)}</td>
        <td>
          <div style="font-weight:600">${c.nama}</div>
          <div style="font-size:.75rem;color:var(--muted)">${c.email}</div>
        </td>
        <td>${c.nohp}</td>
        <td style="font-weight:600">${c.merk} ${c.tipe}</td>
        <td style="font-family:monospace;font-size:.78rem">${c.imei}</td>
        <td>${fmtRp(c.harga)}</td>
        <td>${fmtDate(c.tglBeli)}</td>
        <td><span class="badge badge-${c.tier}">${c.tier === 'silver' ? 'Silver' : 'Gold'}</span></td>
        <td style="font-weight:600">${fmtRp(c.biaya)}</td>
      </tr>
    `).join('');
  }

  // Update statistik
  document.getElementById('stat-total').textContent  = claims.length;
  document.getElementById('stat-silver').textContent = claims.filter(c => c.tier === 'silver').length;
  document.getElementById('stat-gold').textContent   = claims.filter(c => c.tier === 'gold').length;

  const omset = claims.reduce((s, c) => s + c.biaya, 0);
  document.getElementById('stat-omset').textContent  = omset >= 1000000
    ? 'Rp ' + Math.round(omset / 1000) + 'rb'
    : fmtRp(omset);
}

/* ── INIT ─────────────────────────────────── */
renderHP(HP_LIST);
