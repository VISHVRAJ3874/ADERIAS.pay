/* ══════════════════════════════════════
   ADERIAS — V-DEIYY Wallet Script
   wallet.js
══════════════════════════════════════ */

/* ── Currency switch ── */
function switchCurrency(cur) {
  document.querySelectorAll('.ctab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelector(`.ctab[data-cur="${cur}"]`).classList.add('active');
  document.getElementById(`panel-${cur}`).classList.add('active');
}

/* ── Desktop / Mobile mode ── */
function setMode(mode) {
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  document.body.classList.toggle('desktop', mode === 'desktop');
  document.body.classList.toggle('mobile',  mode !== 'desktop');
}

/* Auto-detect on load */
(function initMode() {
  if (window.innerWidth >= 768) {
    document.body.classList.add('desktop');
    document.querySelector('.mode-btn:last-child').classList.add('active');
    document.querySelector('.mode-btn:first-child').classList.remove('active');
  } else {
    document.querySelector('.mode-btn:first-child').classList.add('active');
    document.querySelector('.mode-btn:last-child').classList.remove('active');
  }
})();

/* ── View switch (wallet / history) ── */
function switchView(view) {
  document.querySelectorAll('.view-panel').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.bnav-item[id^="bnav-"]').forEach(b => b.classList.remove('active'));
  document.getElementById('view-' + view).classList.add('active');
  const nb = document.getElementById('bnav-' + view);
  if (nb) nb.classList.add('active');
  if (view === 'history') renderTxn('all');
}

/* ══════════════════════════════════════
   TRANSACTION DATA
══════════════════════════════════════ */
const TXN = [
  /* ── User-specified transactions ── */
  { id: 1,  type: 'credit', cur: 'dollar', icon: '🌐', name: 'Sell Site',           note: 'Digital asset sale · marketplace', amount: 2200,   symbol: '$', date: 'Today',     time: '11:42 AM', status: 'Completed' },
  { id: 2,  type: 'debit',  cur: 'euro',   icon: '🎵', name: 'Pytend Subscription', note: 'Monthly plan · auto-renewed',      amount: 1440,   symbol: '€', date: 'Today',     time: '09:18 AM', status: 'Completed' },
  { id: 3,  type: 'debit',  cur: 'inr',    icon: '📱', name: 'iPhone Purchase',     note: 'Apple Store · electronics',        amount: 119500, symbol: '₹', date: 'Today',     time: '08:05 AM', status: 'Completed' },

  /* ── Dollar transactions ── */
  { id: 4,  type: 'credit', cur: 'dollar', icon: '💼', name: 'Freelance Payment',   note: 'Client: NexaWorks LLC',            amount: 850,    symbol: '$', date: 'Yesterday', time: '06:30 PM', status: 'Completed' },
  { id: 5,  type: 'debit',  cur: 'dollar', icon: '☕', name: 'Starbucks',           note: 'Coffee & snacks · USD',            amount: 14,     symbol: '$', date: 'Yesterday', time: '08:55 AM', status: 'Completed' },
  { id: 6,  type: 'debit',  cur: 'dollar', icon: '🎮', name: 'Steam Purchase',      note: 'Game bundle · digital download',   amount: 49,     symbol: '$', date: 'Yesterday', time: '03:20 PM', status: 'Completed' },
  { id: 7,  type: 'credit', cur: 'dollar', icon: '📈', name: 'Dividend Credit',     note: 'Portfolio return · Q2',            amount: 320,    symbol: '$', date: '24 Jun',    time: '12:00 PM', status: 'Completed' },
  { id: 8,  type: 'debit',  cur: 'dollar', icon: '🍕', name: "Domino's",            note: 'Food order · home delivery',       amount: 27,     symbol: '$', date: '24 Jun',    time: '07:45 PM', status: 'Completed' },
  { id: 9,  type: 'debit',  cur: 'dollar', icon: '✈️', name: 'Flight Booking',      note: 'Round trip · BOM → JFK',           amount: 1180,   symbol: '$', date: '23 Jun',    time: '10:10 AM', status: 'Pending'   },
  { id: 10, type: 'credit', cur: 'dollar', icon: '🏠', name: 'Rental Income',       note: 'Property lease · monthly',         amount: 1500,   symbol: '$', date: '22 Jun',    time: '09:00 AM', status: 'Completed' },

  /* ── Euro transactions ── */
  { id: 11, type: 'credit', cur: 'euro',   icon: '🤝', name: 'Partner Payout',      note: 'EuroHub GmbH · project close',     amount: 3200,   symbol: '€', date: 'Yesterday', time: '04:00 PM', status: 'Completed' },
  { id: 12, type: 'debit',  cur: 'euro',   icon: '🍺', name: 'Hofbräuhaus',         note: 'Dinner & drinks · Munich',         amount: 62,     symbol: '€', date: 'Yesterday', time: '08:30 PM', status: 'Completed' },
  { id: 13, type: 'debit',  cur: 'euro',   icon: '🛍', name: 'Kaufhof Shopping',    note: 'Clothing & lifestyle',             amount: 215,    symbol: '€', date: '24 Jun',    time: '02:15 PM', status: 'Completed' },
  { id: 14, type: 'credit', cur: 'euro',   icon: '📦', name: 'Export Invoice',      note: 'B2B goods shipment · DE',          amount: 780,    symbol: '€', date: '23 Jun',    time: '11:00 AM', status: 'Completed' },
  { id: 15, type: 'debit',  cur: 'euro',   icon: '☕', name: 'Costa Coffee',        note: 'Daily coffee · Paris',             amount: 9,      symbol: '€', date: '23 Jun',    time: '07:30 AM', status: 'Completed' },
  { id: 16, type: 'debit',  cur: 'euro',   icon: '🏨', name: 'Hotel Booking',       note: 'Berlin Marriott · 2 nights',       amount: 390,    symbol: '€', date: '22 Jun',    time: '01:45 PM', status: 'Pending'   },

  /* ── INR transactions ── */
  { id: 17, type: 'credit', cur: 'inr',    icon: '💰', name: 'UPI Transfer In',     note: 'From Rajan · family',              amount: 5000,   symbol: '₹', date: 'Yesterday', time: '01:10 PM', status: 'Completed' },
  { id: 18, type: 'debit',  cur: 'inr',    icon: '🍛', name: "Haldiram's",          note: 'Food order · Swiggy',              amount: 340,    symbol: '₹', date: 'Yesterday', time: '01:00 PM', status: 'Completed' },
  { id: 19, type: 'debit',  cur: 'inr',    icon: '⛽', name: 'Fuel — HPCL',         note: 'Petrol fill · vehicle',            amount: 2100,   symbol: '₹', date: '24 Jun',    time: '07:00 AM', status: 'Completed' },
  { id: 20, type: 'credit', cur: 'inr',    icon: '🏧', name: 'Salary Credit',       note: 'June 2025 · ADERIAS Corp',         amount: 85000,  symbol: '₹', date: '22 Jun',    time: '09:00 AM', status: 'Completed' },
  { id: 21, type: 'debit',  cur: 'inr',    icon: '🛒', name: 'Amazon India',        note: 'Accessories order',                amount: 1850,   symbol: '₹', date: '22 Jun',    time: '11:30 AM', status: 'Completed' },
  { id: 22, type: 'debit',  cur: 'inr',    icon: '🎬', name: 'Netflix India',       note: 'Monthly subscription',             amount: 649,    symbol: '₹', date: '21 Jun',    time: '12:00 PM', status: 'Completed' },
  { id: 23, type: 'debit',  cur: 'inr',    icon: '🏪', name: 'Select Citywalk',     note: 'Retail shopping · Delhi',          amount: 4700,   symbol: '₹', date: '20 Jun',    time: '03:00 PM', status: 'Completed' },
];

/* ── Filter handler ── */
function filterTxn(filter, btn) {
  document.querySelectorAll('.hf-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderTxn(filter);
}

/* ── Render transaction list ── */
function renderTxn(filter) {
  const list = document.getElementById('txn-list');

  let filtered = TXN;
  if (filter === 'credit') filtered = TXN.filter(t => t.type === 'credit');
  else if (filter === 'debit') filtered = TXN.filter(t => t.type === 'debit');
  else if (['dollar', 'euro', 'inr'].includes(filter)) filtered = TXN.filter(t => t.cur === filter);

  /* Update summary strip */
  document.getElementById('hist-credit').textContent = '+' + fmtAmt(filtered.filter(t => t.type === 'credit'));
  document.getElementById('hist-debit').textContent  = '-' + fmtAmt(filtered.filter(t => t.type === 'debit'));
  document.getElementById('hist-count').textContent  = filtered.length;

  /* Group by date */
  const groups = {};
  filtered.forEach(t => {
    if (!groups[t.date]) groups[t.date] = [];
    groups[t.date].push(t);
  });

  let html = '';
  for (const [date, items] of Object.entries(groups)) {
    html += `<div class="txn-group-label">${date}</div>`;
    items.forEach(t => {
      const arrow      = t.type === 'credit' ? '↑' : '↓';
      const amtStr     = t.symbol + t.amount.toLocaleString('en-IN');
      const statusColor = t.status === 'Pending' ? '#c9a84c' : '#9e8e80';
      html += `
        <div class="txn-item">
          <div class="txn-icon ${t.type}">${t.icon}</div>
          <div class="txn-body">
            <div class="txn-name">${t.name}</div>
            <div class="txn-meta">${t.note} · ${t.time}</div>
          </div>
          <div class="txn-right">
            <div class="txn-amount ${t.type}">
              <span class="txn-arrow">${arrow}</span>${amtStr}
            </div>
            <div class="txn-status" style="color:${statusColor}">${t.status}</div>
          </div>
        </div>`;
    });
  }

  list.innerHTML = html || `<div style="text-align:center;color:var(--text-muted);padding:40px 0;font-size:0.85rem;">No transactions found</div>`;
}

/* ── Format mixed-currency totals ── */
function fmtAmt(items) {
  if (!items.length) return '0';
  const byCur = {};
  items.forEach(t => { byCur[t.cur] = (byCur[t.cur] || 0) + t.amount; });
  return Object.entries(byCur).map(([cur, sum]) => {
    const sym = cur === 'dollar' ? '$' : cur === 'euro' ? '€' : '₹';
    return sym + sum.toLocaleString('en-IN');
  }).join(' + ');
}
