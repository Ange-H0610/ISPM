/* Données initiales : sans exemples (vide) */
const STORAGE_KEY = 'mbldata';

let state = {
  transactions: [],
  comptes: [],
  depensesMensuelles: { labels: [], series: [] }, // optionnel pour historique
  budget: { aDepenser: 0, depense: 0 }
};

/* Récupérer depuis localStorage si présent */
function chargerState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) state = JSON.parse(raw);
  } catch (e) {
    console.error('Erreur lecture storage', e);
  }
}

/* Sauvegarder */
function sauverState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) { console.error('Erreur sauvegarde', e); }
}

/* ---------- Rendu UI ---------- */
function afficherTransactions() {
  const el = document.getElementById('transactionsList');
  el.innerHTML = '';
  if (!state.transactions.length) {
    el.innerHTML = '<div class="empty">Aucune transaction enregistrée.</div>';
    return;
  }
  state.transactions.slice().reverse().forEach(tx => {
    const item = document.createElement('div');
    item.className = 'item';
    item.innerHTML = `
      <div class="left">
        <div class="icon-circle">💳</div>
        <div>
          <div style="font-weight:700">${tx.titre}</div>
          <div class="muted">${tx.date || '-'} • ${tx.categorie || '-'}</div>
        </div>
      </div>
      <div style="text-align:right">
        <div style="font-weight:700;color:${tx.montant<0?'var(--rouge)':'var(--vert)'}">
          ${tx.montant<0?'-':''}Ar${Math.abs(tx.montant).toFixed(2)}
        </div>
      </div>
    `;
    el.appendChild(item);
  });
}

function afficherComptes() {
  const el = document.getElementById('accountsList');
  el.innerHTML = '';
  if (!state.comptes.length) {
    el.innerHTML = '<div class="empty">Aucun compte créé.</div>';
    return;
  }
  state.comptes.forEach(c => {
    const d = document.createElement('div');
    d.className = 'acct';
    d.innerHTML = `<div>${c.nom}</div><div style="font-weight:700;color:${c.solde<0?'var(--rouge)':'var(--vert)'}">Ar${c.solde.toFixed(2)}</div>`;
    el.appendChild(d);
  });
  // Mettre à jour le select des comptes dans le formulaire transaction
  const sel = document.getElementById('txCompte');
  sel.innerHTML = '<option value="">— Compte (optionnel) —</option>';
  state.comptes.forEach((c, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = c.nom;
    sel.appendChild(opt);
  });
}

let chartDepense = null;
function dessinerGraphique() {
  // Si pas de données mensuelles, cacher/afficher message
  const chartArea = document.getElementById('chartArea');
  const emptyMsg = document.getElementById('emptyChartMsg');
  if (!state.depensesMensuelles.labels.length || !state.depensesMensuelles.series.length) {
    emptyMsg.style.display = 'flex';
    if (chartDepense) { chartDepense.destroy(); chartDepense = null; }
    return;
  }
  emptyMsg.style.display = 'none';
  const ctx = document.getElementById('spendingChart').getContext('2d');
  if (chartDepense) chartDepense.destroy();
  chartDepense = new Chart(ctx, {
    type: 'bar',
    data: { labels: state.depensesMensuelles.labels, datasets: [{ label: 'Dépenses', data: state.depensesMensuelles.series, borderRadius: 6, barThickness: 18, backgroundColor: 'rgb(107,99,255)' }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { display: false } } } }
  });
}

function dessinerDonut() {
  const c = document.getElementById('donutCanvas');
  const ctx = c.getContext('2d');
  const a = state.budget.aDepenser;
  const s = state.budget.depense;
  const ratio = Math.min(1, (a > 0 ? s / a : 0));
  ctx.clearRect(0, 0, c.width, c.height);
  const cx = c.width / 2, cy = c.height / 2, r = 48, ep = 18;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.lineWidth = ep; ctx.strokeStyle = '#f1f3f6'; ctx.stroke();
  const end = -Math.PI / 2 + ratio * Math.PI * 2;
  ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, end); ctx.lineWidth = ep; ctx.lineCap = 'round'; ctx.strokeStyle = 'rgb(107,99,255)'; ctx.stroke();
}

/* Mettre à jour tout */
function mettreAJourAffichage() {
  afficherTransactions();
  afficherComptes();
  // Totaux
  const total = state.comptes.reduce((s, c) => s + (c.solde || 0), 0);
  document.getElementById('totalBalance').textContent = total.toFixed(2);
  document.getElementById('currentMonth').textContent = (new Date()).toLocaleString('fr-FR', { month: 'long', year: 'numeric' });

  // Budget
  document.getElementById('toSpend').textContent = state.budget.aDepenser.toFixed(2);
  document.getElementById('spentVal').textContent = state.budget.depense.toFixed(2);
  document.getElementById('leftVal').textContent = Math.max(0, state.budget.aDepenser - state.budget.depense).toFixed(2);

  dessinerDonut();
  dessinerGraphique();
}

/* ---------- Actions utilisateur : ajouter compte / transaction / budget ---------- */
function ajouterCompte(nom, solde) {
  state.comptes.push({ nom: nom.trim(), solde: Number(solde) || 0 });
  sauverState();
  mettreAJourAffichage();
}
function ajouterTransaction(titre, montant, date, categorie, compteIndex) {
  const tx = { titre: titre.trim(), montant: Number(montant) || 0, date: date || new Date().toLocaleDateString('fr-FR'), categorie: categorie || '' };
  state.transactions.push(tx);
  // Mettre à jour le solde du compte si choisi
  if (typeof compteIndex === 'number' && state.comptes[compteIndex]) {
    state.comptes[compteIndex].solde += Number(montant) || 0;
  }
  // Mettre à jour budget dépensé autom. si montant < 0 (dépense)
  if (Number(montant) < 0) {
    state.budget.depense += Math.abs(Number(montant));
  }
  sauverState();
  mettreAJourAffichage();
}
function definirBudget(total) {
  state.budget.aDepenser = Number(total) || 0;
  state.budget.depense = 0; // réinitialise dépenses liées au budget (on pourrait garder les précédentes si désiré)
  // Optionnel: recalculer depense depuis transactions négatives
  const depenses = state.transactions.reduce((s, t) => s + (t.montant < 0 ? Math.abs(t.montant) : 0), 0);
  state.budget.depense = depenses;
  sauverState();
  mettreAJourAffichage();
}

/* ---------- Formulaires UI ---------- */
function hookupUI() {
  // Forms toggles
  const btnToggleAcct = document.getElementById('btnToggleAcctForm');
  const acctForm = document.getElementById('acctForm');
  const btnCancelAcct = document.getElementById('btnCancelAcct');

  btnToggleAcct.addEventListener('click', ()=> acctForm.classList.toggle('hidden'));
  btnCancelAcct.addEventListener('click', ()=> acctForm.classList.add('hidden'));

  acctForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const nom = document.getElementById('acctNom').value;
    const solde = document.getElementById('acctSolde').value;
    if (!nom) return alert('Donne un nom au compte');
    ajouterCompte(nom, solde);
    acctForm.reset(); acctForm.classList.add('hidden');
  });

  // Transactions
  const btnToggleTx = document.getElementById('btnToggleTxForm');
  const txForm = document.getElementById('txForm');
  const btnCancelTx = document.getElementById('btnCancelTx');

  btnToggleTx.addEventListener('click', ()=> txForm.classList.toggle('hidden'));
  btnCancelTx.addEventListener('click', ()=> txForm.classList.add('hidden'));

  txForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const titre = document.getElementById('txTitre').value;
    const montant = document.getElementById('txMontant').value;
    const date = document.getElementById('txDate').value;
    const categorie = document.getElementById('txCategorie').value;
    const compte = document.getElementById('txCompte').value;
    if (!titre || montant === '') return alert('Remplis le libellé et le montant');
    const idx = compte === '' ? undefined : Number(compte);
    ajouterTransaction(titre, Number(montant), date, categorie, idx);
    txForm.reset(); txForm.classList.add('hidden');
  });

  // Budget
  const btnToggleBudget = document.getElementById('btnToggleBudgetForm');
  const budgetForm = document.getElementById('budgetForm');
  const btnCancelBudget = document.getElementById('btnCancelBudget');

  btnToggleBudget.addEventListener('click', ()=> budgetForm.classList.toggle('hidden'));
  btnCancelBudget.addEventListener('click', ()=> budgetForm.classList.add('hidden'));

  budgetForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const total = document.getElementById('budgetTotal').value;
    if (total === '') return alert('Indique le montant du budget');
    definirBudget(Number(total));
    budgetForm.reset(); budgetForm.classList.add('hidden');
  });
}

/* ---------- Initialisation ---------- */
window.addEventListener('DOMContentLoaded', ()=>{
  chargerState();
  hookupUI();
  mettreAJourAffichage();
});

/* Rendre certaines fonctions accessibles globalement si besoin pour intégration backend */
window.mettreAJourAffichage = mettreAJourAffichage;
window.ajouterCompte = ajouterCompte;
window.ajouterTransaction = ajouterTransaction;
window.definirBudget = definirBudget;
