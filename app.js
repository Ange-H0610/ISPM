// ----- données d'exemple -----
const transactions = [
  {icon: '🎧', title:'iTunes subscription', sub:'Bills', amount:-2.30},
  {icon: '🚗', title:'Uber ride', sub:'Transport', amount:-14.25},
  {icon: '🛒', title:'Countdown', sub:'Groceries', amount:-40.10},
  {icon: '🛠️', title:'Auto Repairs', sub:'Maintenance', amount:-160.00},
  {icon: '📱', title:'BP Mobile', sub:'Petrol', amount:-54.00},
  {icon: '✈️', title:'Ticket Direct', sub:'Vacation', amount:-669.99},
  {icon: '🛍️', title:'Countdown', sub:'Groceries', amount:130.83}
];

const accounts = [
  {name:'Debit', amount:14.25},
  {name:'Cash', amount:5.30},
  {name:'Credit Card', amount:-270.00},
  {name:'Savings', amount:12690.10}
];

const barData = [
  {month:'JAN', val:1200},
  {month:'FEB', val:2300},
  {month:'MAR', val:4200},
  {month:'APR', val:3300},
  {month:'MAY', val:2600},
  {month:'JUN', val:1800},
];

// ----- render transactions -----
function renderTransactions(){
  const ul = document.getElementById('transactions-list');
  ul.innerHTML = '';
  transactions.forEach(tx=>{
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="tx-left">
        <div class="tx-icon">${tx.icon}</div>
        <div>
          <div class="tx-title">${tx.title}</div>
          <div class="tx-sub">${tx.sub}</div>
        </div>
      </div>
      <div class="tx-right">
        <div class="amount" style="font-weight:700; color:${tx.amount<0? '#ff5c7a':'#20b06b'}">
          ${tx.amount < 0 ? '-' : '+'}$${Math.abs(tx.amount).toFixed(2)}
        </div>
      </div>
    `;
    ul.appendChild(li);
  });
}

// ----- render accounts -----
function renderAccounts(){
  const container = document.getElementById('accounts-list');
  container.innerHTML = '';
  accounts.forEach(ac=>{
    const div = document.createElement('div');
    div.className = 'account-row';
    div.innerHTML = `
      <div>${ac.name}</div>
      <div style="font-weight:700; color:${ac.amount<0? '#ff6b6b':'#1e9a6a'}">${ac.amount<0? '-':'+'}$${Math.abs(ac.amount).toFixed(2)}</div>
    `;
    container.appendChild(div);
  });
}

// ----- render recent small -----
function renderRecent(){
  const ul = document.getElementById('recent-list');
  ul.innerHTML = '';
  transactions.slice(0,5).forEach(t=>{
    const li = document.createElement('li');
    li.style.padding = '10px 0';
    li.style.borderBottom = '1px dashed #eef2ff';
    li.innerHTML = `<div style="display:flex;justify-content:space-between">
      <div style="display:flex;gap:10px; align-items:center"><span style="width:26px">${t.icon}</span><div><div style="font-weight:600">${t.title}</div><div style="font-size:0.85rem;color:#7b8096">${t.sub}</div></div></div>
      <div style="font-weight:700; color:${t.amount<0? '#ff5c7a':'#20b06b'}">${t.amount<0?'-':'+'}$${Math.abs(t.amount).toFixed(2)}</div>
    </div>`;
    ul.appendChild(li);
  });
}

// ----- simple bar chart (svg) -----
function renderBarChart(){
  const el = document.getElementById('bar-chart');
  const w = el.clientWidth || 500;
  const h = 220;
  const max = Math.max(...barData.map(d=>d.val));
  const pad = 30;
  const colW = (w - pad*2) / barData.length;
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', h);
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

  barData.forEach((d,i)=>{
    const x = pad + i * colW + colW*0.1;
    const bw = colW*0.7;
    const barH = (d.val / max) * (h - 60);
    const y = h - 30 - barH;
    const rect = document.createElementNS(svgNS, 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', bw);
    rect.setAttribute('height', barH);
    rect.setAttribute('rx', 6);
    rect.setAttribute('fill', i % 2 === 0 ? '#6b72ff' : '#97a0ff');
    svg.appendChild(rect);

    // label
    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('x', x + bw/2);
    text.setAttribute('y', h - 10);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '11');
    text.setAttribute('fill', '#7b8096');
    text.textContent = d.month;
    svg.appendChild(text);
  });

  el.innerHTML = '';
  el.appendChild(svg);
}

// ----- donut chart by drawing stroke-dash -----
function renderDonut(){
  const el = document.getElementById('donut');
  const size = 140;
  const pct = 75; // 75% example
  const stroke = 16;
  const radius = (size - stroke)/2;
  const circ = 2 * Math.PI * radius;
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS,'svg');
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);

  // bg circle
  const bg = document.createElementNS(svgNS,'circle');
  bg.setAttribute('cx', size/2);
  bg.setAttribute('cy', size/2);
  bg.setAttribute('r', radius);
  bg.setAttribute('stroke','#eef2ff');
  bg.setAttribute('stroke-width', stroke);
  bg.setAttribute('fill','none');
  svg.appendChild(bg);

  // fg
  const fg = document.createElementNS(svgNS,'circle');
  fg.setAttribute('cx', size/2);
  fg.setAttribute('cy', size/2);
  fg.setAttribute('r', radius);
  fg.setAttribute('stroke','#6b72ff');
  fg.setAttribute('stroke-width', stroke);
  fg.setAttribute('fill','none');
  fg.setAttribute('stroke-linecap','round');
  fg.setAttribute('transform', `rotate(-90 ${size/2} ${size/2})`);
  fg.setAttribute('stroke-dasharray', `${circ} ${circ}`);
  const dash = (pct/100)*circ;
  fg.setAttribute('stroke-dashoffset', `${circ - dash}`);
  svg.appendChild(fg);

  // center text
  const text = document.createElementNS(svgNS,'text');
  text.setAttribute('x', size/2);
  text.setAttribute('y', size/2 + 6);
  text.setAttribute('font-size','20');
  text.setAttribute('text-anchor','middle');
  text.setAttribute('fill','#273044');
  text.textContent = `${pct}%`;
  svg.appendChild(text);

  el.innerHTML = '';
  el.appendChild(svg);
}

// ----- sidebar collapse (mobile) -----
function setupInteractions(){
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  const collapseBtn = document.getElementById('collapse-btn');

  hamburger?.addEventListener('click', ()=>{
    sidebar.classList.toggle('open');
    sidebar.style.display = sidebar.classList.contains('open') ? 'flex' : 'none';
  });

  collapseBtn?.addEventListener('click', ()=>{
    if (sidebar.style.width === '80px'){
      sidebar.style.width = '260px';
      collapseBtn.textContent = '‹';
    } else {
      sidebar.style.width = '80px';
      collapseBtn.textContent = '›';
    }
  });

  // simple responsive re-render of svg when width changes
  window.addEventListener('resize', ()=>{
    renderBarChart();
  });
}

// ----- init -----
function init(){
  renderTransactions();
  renderAccounts();
  renderRecent();
  renderBarChart();
  renderDonut();
  setupInteractions();
  // set username if available
  const username = localStorage.getItem('username') || 'Hayley';
  document.getElementById('user-name').textContent = username;
}

document.addEventListener('DOMContentLoaded', init);
