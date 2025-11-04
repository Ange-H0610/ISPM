const STORAGE = 'mybudget_v2_state';
let state = {
  lang: 'fr',
  theme: 'light',
  fontSize: 'normal',
  user: { name: 'Andrew Forbist', email: 'user@example.com' },
  transactions: [
    { id:1, type:'income', label:'Salaire', amount:562000, date:'2025-10-01' },
    { id:2, type:'expense', label:'Courses', amount:42000, date:'2025-10-03' },
    { id:3, type:'expense', label:'Abonnement', amount:12000, date:'2025-10-05' }
  ],
  goals: { epargne:84500, emprunt:0, investissement:25000 }
};

// Charger l'état sauvegardé
try{
  const raw = localStorage.getItem(STORAGE);
  if(raw) state = JSON.parse(raw);
}catch(e){ console.warn('Erreur de chargement', e); }

// Traductions françaises
const i18 = {
  fr:{
    dashboard:'Tableau de bord',
    transactions:'Transactions',
    statistics:'Statistiques',
    profile:'Profil',
    goals:'Objectifs',
    settings:'Paramètres',
    currentBalance:'Solde actuel',
    recent:'Activités récentes',
    add:'Ajouter',
    income:'Revenu',
    expense:'Dépense',
    placeholderLabel:'Libellé (ex: Salaire)',
    placeholderAmount:'Montant',
    noTransactions:'Aucune transaction',
    saveProfile:'Sauvegarder',
    profileSaved:'Profil sauvegardé',
    amountRequired:'Montant requis',
    topUp:'Recharger',
    transfer:'Transférer',
    history:'Historique'
  }
};

function t(k){ return (i18[state.lang] && i18[state.lang][k]) || k; }

function save(){ try{ localStorage.setItem(STORAGE, JSON.stringify(state)); }catch(e){} }
function calc(){
  let inc=0, exp=0;
  state.transactions.forEach(tx => tx.type==='income' ? inc+=tx.amount : exp+=tx.amount);
  return { income: inc, expense: exp, balance: inc-exp };
}

/* RENDERERS */
function renderDashboard(){
  const s = calc();
  const recent = state.transactions.slice().reverse().slice(0,5);
  return `
    <div class="col-card profile-card">
      <div class="name">${state.user.name}</div>
      <div class="kv">Solde du compte</div>
      <div class="balance">${s.balance.toLocaleString()} Ar</div>
      <div style="display:flex; gap:8px; margin-top:8px;">
        <button class="btn small" onclick="mount('transactions')">${t('topUp')}</button>
        <button class="btn small" onclick="mount('transactions')">${t('transfer')}</button>
        <button class="btn small" onclick="mount('transactions')">${t('history')}</button>
      </div>
    </div>

    <div>
      <div style="display:flex; gap:12px; margin-bottom:12px;">
        <div class="stat-tile"><div class="kv">Revenu Total</div><div class="val">${s.income.toLocaleString()} Ar</div></div>
        <div class="stat-tile"><div class="kv">Dépense Totale</div><div class="val">${s.expense.toLocaleString()} Ar</div></div>
        <div class="stat-tile"><div class="kv">Épargne Totale</div><div class="val">${state.goals.epargne.toLocaleString()} Ar</div></div>
      </div>

      <div class="chart-card">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div class="kv">Flux de trésorerie</div>
          <div class="small kv">Cette année</div>
        </div>
        <div style="height:180px;margin-top:12px;"><canvas id="dashChart"></canvas></div>
      </div>

      <div class="table-card" style="margin-top:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div class="kv">Transactions récentes</div>
          <div class="small kv">Ce mois-ci</div>
        </div>
        <div style="margin-top:10px;">
          ${recent.map(tx=>`<div class="tx-row"><div><strong>${tx.label}</strong><div class="small kv">${tx.date}</div></div><div style="text-align:right">${tx.type==='income'?'+':'-'} ${tx.amount.toLocaleString()} Ar</div></div>`).join('')}
        </div>
      </div>
    </div>

    <div class="right-card">
      <div>
        <div class="kv">Statistique</div>
        <div style="display:flex;gap:10px;align-items:center;margin-top:8px;">
          <div style="flex:1">
            <canvas id="donutChart" height="120"></canvas>
          </div>
          <div style="width:120px">
            <div class="kv">Ce mois-ci</div>
            <div style="font-weight:800;margin-top:8px">${s.expense.toLocaleString()} Ar</div>
            <div class="small kv" style="margin-top:8px">Répartition</div>
            <div class="small kv">Loyer & Vie • 40%</div>
            <div class="small kv">Investissement • 20%</div>
            <div class="small kv">Alimentation & Boissons • 12%</div>
          </div>
        </div>
      </div>

      <div>
        <div class="kv">Activités récentes</div>
        <div style="margin-top:8px; display:flex;flex-direction:column; gap:8px;">
          <div class="activity-item"><div class="dot">JS</div><div><strong>Jamie Smith</strong><div class="kv">a mis à jour les paramètres</div></div></div>
          <div class="activity-item"><div class="dot">AJ</div><div><strong>Alex Johnson</strong><div class="kv">s’est connecté</div></div></div>
        </div>
      </div>
    </div>
  `;
}

function renderTransactions(){
  const rows = state.transactions.slice().reverse().map(tx => `
    <div class="tx-row">
      <div><strong>${tx.label}</strong><div class="kv">${tx.date} • ${tx.type==='income'?t('income'):t('expense')}</div></div>
      <div style="text-align:right">
        <div style="font-weight:800">${tx.type==='income'?'+':'-'} ${tx.amount.toLocaleString()} Ar</div>
        <div class="small" style="margin-top:6px;"><button class="btn small" onclick="removeTx(${tx.id})">Supprimer</button></div>
      </div>
    </div>
  `).join('');

  return `
    <div class="card" style="grid-column:1 / -1;">
      <h3>${t('transactions')}</h3>
      <div style="margin-top:12px;" class="col-card">
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <input id="txLabel" type="text" placeholder="${t('placeholderLabel')}" style="padding:10px;border-radius:8px;border:1px solid rgba(0,0,0,0.06);flex:1;" />
          <input id="txAmount" type="number" placeholder="${t('placeholderAmount')}" style="padding:10px;border-radius:8px;border:1px solid rgba(0,0,0,0.06);width:160px;" />
          <select id="txType" style="padding:10px;border-radius:8px;border:1px solid rgba(0,0,0,0.06);">
            <option value="income">${t('income')}</option>
            <option value="expense">${t('expense')}</option>
          </select>
          <button id="addTx" class="btn small">${t('add')}</button>
        </div>

        <div style="margin-top:16px;">
          <div class="kv">${t('currentBalance')}</div>
          <div style="font-weight:800;font-size:1.2rem;color:var(--green-600)">${calc().balance.toLocaleString()} Ar</div>
        </div>

        <div style="margin-top:12px;">
          <div class="kv">Historique</div>
          <div style="margin-top:8px;">${rows || `<div class="kv">${t('noTransactions')}</div>`}</div>
        </div>
      </div>
    </div>
  `;
}

function renderStatistics(){
  return `
    <div class="card" style="grid-column:1 / -1;">
      <h3>${t('statistics')}</h3>
      <div style="margin-top:12px;">
        <label class="kv">Année:
          <select id="yearSelect" style="padding:8px;border-radius:8px;border:1px solid rgba(0,0,0,0.06);">
            ${[2023,2024,2025,2026].map(y=>`<option value="${y}">${y}</option>`).join('')}
          </select>
        </label>
      </div>
      <div style="height:300px;margin-top:12px;"><canvas id="statMain" height="260"></canvas></div>
    </div>
  `;
}

function renderProfile(){
  return `
    <div class="card" style="grid-column:1 / -1;">
      <h3>${t('profile')}</h3>
      <div style="margin-top:12px; display:flex; gap:12px; align-items:center;">
        <div style="flex:1;">
          <label>Nom<input id="profileName" value="${state.user.name}" style="width:100%;padding:10px;border-radius:8px;border:1px solid rgba(0,0,0,0.06);" /></label>
          <label style="display:block;margin-top:8px;">Email<input id="profileEmail" value="${state.user.email}" style="width:100%;padding:10px;border-radius:8px;border:1px solid rgba(0,0,0,0.06);" /></label>
          <div style="margin-top:12px;"><button id="saveProfile" class="btn small">${t('saveProfile')}</button></div>
        </div>
        <div style="width:160px;text-align:center;">
          <div style="width:96px;height:96px;border-radius:14px;background:var(--accent-grad);display:inline-flex;align-items:center;justify-content:center;font-weight:800;color:var(--green-600);">IMG</div>
          <div class="small kv" style="margin-top:8px;">Photo (optionnelle)</div>
        </div>
      </div>
    </div>
  `;
}

function renderGoals(){
  const total = (state.goals.epargne + state.goals.emprunt + state.goals.investissement) || 1;
  const pct = v => Math.round((v / total) * 100);
  return `
    <div class="card" style="grid-column:1 / -1;">
      <h3>${t('goals')}</h3>
      <div style="display:flex;gap:12px;margin-top:12px;">
        <div class="col-card"><div class="kv">Épargne</div><div style="font-weight:800">${state.goals.epargne.toLocaleString()} Ar</div><div class="kv">${pct(state.goals.epargne)}%</div></div>
        <div class="col-card"><div class="kv">Emprunt</div><div style="font-weight:800">${state.goals.emprunt.toLocaleString()} Ar</div><div class="kv">${pct(state.goals.emprunt)}%</div></div>
        <div class="col-card"><div class="kv">Investissement</div><div style="font-weight:800">${state.goals.investissement.toLocaleString()} Ar</div><div class="kv">${pct(state.goals.investissement)}%</div></div>
      </div>
    </div>
  `;
}

function renderSettings(){
  return `
    <div class="card" style="grid-column:1 / -1;">
      <h3>${t('settings')}</h3>
      <div style="display:flex;gap:12px;margin-top:12px;flex-wrap:wrap;">
        <div style="min-width:200px;">
          <label class="kv">Langue
            <select id="langSelect" style="padding:8px;border-radius:8px;border:1px solid rgba(0,0,0,0.06);">
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="mg">Malagasy</option>
            </select>
          </label>
        </div>
        <div style="min-width:200px;">
          <label class="kv">Thème
            <select id="themeSelect" style="padding:8px;border-radius:8px;border:1px solid rgba(0,0,0,0.06);">
              <option value="light">Clair</option>
              <option value="dark">Sombre</option>
            </select>
          </label>
        </div>
        <div style="min-width:200px;">
          <label class="kv">Taille du texte
            <select id="fontSelect" style="padding:8px;border-radius:8px;border:1px solid rgba(0,0,0,0.06);">
              <option value="small">Petit</option>
              <option value="normal">Normal</option>
              <option value="large">Grand</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  `;
}

/* MOUNT / ROUTER */
function mount(page){
  const content = document.getElementById('content');
  document.querySelectorAll('.menu-item').forEach(m => m.classList.toggle('active', m.dataset.page === page));
  document.getElementById('pageTitle').textContent = t(page);
  let html = '';
  if(page === 'dashboard') html = renderDashboard();
  else if(page === 'transactions') html = renderTransactions();
  else if(page === 'statistics') html = renderStatistics();
  else if(page === 'profile') html = renderProfile();
  else if(page === 'goals') html = renderGoals();
  else if(page === 'settings') html = renderSettings();
  content.innerHTML = html;
  bind(page);
  drawCharts(page);
  applyTheme();
  applyFont();
}

function currentPage(){ return location.hash.replace('#','') || 'dashboard'; }

/* BIND events per page */
function bind(page){
  const langQuick = document.getElementById('langQuick');
  if(langQuick){ langQuick.value = state.lang; langQuick.onchange = e=>{ state.lang = e.target.value; save(); mount(currentPage()); } }
  const themeToggle = document.getElementById('themeToggle');
  if(themeToggle){ themeToggle.onclick = ()=>{ state.theme = state.theme==='dark'?'light':'dark'; save(); applyTheme(); } }

  if(page === 'transactions'){
    const add = document.getElementById('addTx');
    if(add) add.onclick = ()=> {
      const label = document.getElementById('txLabel').value.trim() || 'Sans libellé';
      const amount = Math.abs(Number(document.getElementById('txAmount').value || 0));
      const type = document.getElementById('txType').value;
      if(!amount){ alert(t('amountRequired')); return; }
      state.transactions.push({ id: Date.now(), type, label, amount, date: new Date().toISOString().slice(0,10) });
      save(); mount('transactions');
    };
  }

  if(page === 'profile'){
    const btn = document.getElementById('saveProfile');
    if(btn) btn.onclick = ()=> {
      state.user.name = document.getElementById('profileName').value;
      state.user.email = document.getElementById('profileEmail').value;
      save(); alert(t('profileSaved')); mount('profile');
    };
  }

  if(page === 'settings'){
    document.getElementById('langSelect').value = state.lang;
    document.getElementById('themeSelect').value = state.theme;
    document.getElementById('fontSelect').value = state.fontSize;

    document.getElementById('langSelect').onchange = e=>{ state.lang=e.target.value; save(); mount('settings'); };
    document.getElementById('themeSelect').onchange = e=>{ state.theme=e.target.value; save(); applyTheme(); };
    document.getElementById('fontSelect').onchange = e=>{ state.fontSize=e.target.value; save(); applyFont(); };
  }

  document.querySelectorAll('.menu-item').forEach(a => a.addEventListener('click', ()=> setTimeout(()=> mount(currentPage()),80)));
}

/* CHARTS */
let dashChart=null, donutChart=null, statMain=null;
function drawCharts(page){
  if(page==='dashboard'){
    const ctx = document.getElementById('dashChart')?.getContext('2d');
    if(ctx){
      const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const inc=new Array(12).fill(0), exp=new Array(12).fill(0);
      state.transactions.forEach(tx=>{
        const d=new Date(tx.date); if(isNaN(d)) return;
        const m=d.getMonth();
        tx.type==='income'?inc[m]+=tx.amount:exp[m]+=tx.amount;
      });
      if(dashChart) dashChart.destroy();
      dashChart = new Chart(ctx,{ type:'bar', data:{ labels:months, datasets:[ { label:'Revenu', data:inc, backgroundColor:'rgba(47,180,95,0.8)' }, { label:'Dépense', data:exp, backgroundColor:'rgba(15,122,58,0.15)' } ] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false} } } });
    }

    const dctx = document.getElementById('donutChart')?.getContext('2d');
    if(dctx){
      const s = calc();
      if(donutChart) donutChart.destroy();
      donutChart = new Chart(dctx,{ type:'doughnut', data:{ labels:['Dépense','Revenu'], datasets:[{ data:[s.expense, Math.max(s.income,1)], backgroundColor:['#0f7a3a','#bdeec6'] }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{position:'bottom'} } } });
    }
  }

  if(page==='statistics'){
    const ctx=document.getElementById('statMain')?.getContext('2d');
    if(!ctx) return;
    const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const inc=new Array(12).fill(0), exp=new Array(12).fill(0);
    state.transactions.forEach(tx=>{
      const d=new Date(tx.date); if(isNaN(d)) return;
      const m=d.getMonth();
      tx.type==='income'?inc[m]+=tx.amount:exp[m]+=tx.amount;
    });
    if(statMain) statMain.destroy();
    statMain = new Chart(ctx,{ type:'line', data:{ labels:months, datasets:[ { label:'Revenus', data:inc, tension:0.3, fill:true }, { label:'Dépenses', data:exp, tension:0.3, fill:true } ] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{position:'bottom'} } } });
  }
}

function removeTx(id){ state.transactions = state.transactions.filter(x=>x.id!==id); save(); mount(currentPage()); }

/* THEME / FONT */
function applyTheme(){
  if(state.theme==='dark'){
    document.documentElement.style.setProperty('--bg','#071814');
    document.documentElement.style.setProperty('--panel','#0b2a21');
    document.documentElement.style.setProperty('--text','#e8fff4');
    document.documentElement.style.setProperty('--green-600','#34d399');
  } else {
    document.documentElement.style.removeProperty('--bg');
    document.documentElement.style.removeProperty('--panel');
    document.documentElement.style.removeProperty('--text');
    document.documentElement.style.removeProperty('--green-600');
  }
}
function applyFont(){
  if(state.fontSize==='small') document.documentElement.style.fontSize='14px';
  else if(state.fontSize==='normal') document.documentElement.style.fontSize='16px';
  else document.documentElement.style.fontSize='18px';
}

/* INIT */
window.addEventListener('hashchange',()=>mount(currentPage()));
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.menu-item').forEach(a=>{ a.dataset.page=(a.getAttribute('href')||'#dashboard').replace('#','')||'dashboard'; });
  applyTheme(); applyFont(); mount(currentPage());
});
