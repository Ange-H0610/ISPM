/* ================= GLOBAL STATE ================= */
function getState() {
  return JSON.parse(localStorage.getItem("mybudget_state")) || {
    revenus: [],
    depenses: [],
    listeAchat: []
  };
}

function saveState(state) {
  localStorage.setItem("mybudget_state", JSON.stringify(state));
}

/* ================= USER ================= */
const user = JSON.parse(localStorage.getItem("mybudget_user"));
const userNameEl = document.getElementById("userName");

if (!user || !user.isLoggedIn) {
  window.location.href = "login.html";
} else {
  userNameEl.textContent = user.name;
}

/* ================= DATE ================= */
const now = new Date();
document.getElementById("date").textContent =
  "Dernière mise à jour : " + now.toLocaleString("fr-FR");
document.getElementById("mois").textContent =
  now.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

/* ================= UTILS ================= */
function animate(el, to) {
  let n = 0;
  const step = Math.max(1, Math.ceil(to / 30));
  const i = setInterval(() => {
    n += step;
    if (n >= to) {
      n = to;
      clearInterval(i);
    }
    el.textContent = n.toLocaleString("fr-FR") + " Ar";
  }, 20);
}

/* ================= STATS ================= */
function refreshStats() {
  const state = getState();
  const values = document.querySelectorAll(".value");

  let totalRevenus = 0;
  let totalDepenses = 0;
  let totalMois = 0;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  /* === REVENUS === */
  state.revenus.forEach(r => {
    const montant = Number(r.montant) || 0;
    totalRevenus += montant;

    const d = new Date(r.date);
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      totalMois += montant;
    }
  });

  /* === DEPENSES === */
  state.depenses.forEach(d => {
    const montant = Number(d.montant) || 0;
    totalDepenses += montant;

    const date = new Date(d.date);
    if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
      totalMois -= montant;
    }
  });

  const soldeTotal = totalRevenus - totalDepenses;

  /* === AFFICHAGE === */
  animate(values[0], soldeTotal);      // Solde total
  animate(values[1], totalRevenus);   // Revenus totaux
  animate(values[2], totalDepenses);  // Dépenses totales
  animate(values[3], totalMois);      // Ce mois-ci

  /* === TRANSACTIONS === */
  document.querySelectorAll(".stat-card small")[1].textContent =
    state.revenus.length + " transactions";

  document.querySelectorAll(".stat-card small")[2].textContent =
    state.depenses.length + " transactions";

  /* === COULEURS AUTO === */
  values[0].classList.toggle("text-red", soldeTotal < 0);
  values[0].classList.toggle("text-green", soldeTotal >= 0);

  values[3].classList.toggle("text-red", totalMois < 0);
  values[3].classList.toggle("text-green", totalMois >= 0);
}

/* ================= LAST TRANSACTIONS ================= */
function loadLast() {
  const state = getState();

  const revBox = document.getElementById("lastRevenus");
  const depBox = document.getElementById("lastDepenses");

  if (state.revenus.length) {
    revBox.innerHTML = "";
    state.revenus.slice(-5).reverse().forEach(r => {
      const d = document.createElement("div");
      d.textContent = `${r.source} • ${Number(r.montant).toLocaleString()} Ar`;
      revBox.appendChild(d);
    });
  }

  if (state.depenses.length) {
    depBox.innerHTML = "";
    state.depenses.slice(-5).reverse().forEach(d => {
      const div = document.createElement("div");
      div.textContent = `${d.label} • ${Number(d.montant).toLocaleString()} Ar`;
      depBox.appendChild(div);
    });
  }
}


/* ================= MENU MOBILE ================= */
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("show");
  });
}

/* ================= DASHBOARD GRAPHIQUE ================= */
let dashboardChart;

function renderDashboardGraph() {
  const state = getState();
  const canvas = document.getElementById("dashboardChart");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (!state.revenus.length && !state.depenses.length) return;

  const allDates = [
    ...state.revenus.map(r => r.date),
    ...state.depenses.map(d => d.date)
  ].sort();

  const labels = [...new Set(
    allDates.map(d => new Date(d).toLocaleDateString("fr-FR"))
  )];

  const revenusData = labels.map(date =>
    state.revenus
      .filter(r => new Date(r.date).toLocaleDateString("fr-FR") === date)
      .reduce((s, r) => s + Number(r.montant), 0)
  );

  const depensesData = labels.map(date =>
    state.depenses
      .filter(d => new Date(d.date).toLocaleDateString("fr-FR") === date)
      .reduce((s, d) => s + Number(d.montant), 0)
  );

  if (dashboardChart) dashboardChart.destroy();

  dashboardChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Revenus",
          data: revenusData,
          borderColor: "#22c55e",
          backgroundColor: "rgba(34,197,94,.18)",
          fill: true,
          tension: 0.55,
          borderWidth: 3
        },
        {
          label: "Dépenses",
          data: depensesData,
          borderColor: "#ef4444",
          backgroundColor: "rgba(239,68,68,.18)",
          fill: true,
          tension: 0.55,
          borderWidth: 3
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { usePointStyle: true } }
      },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true }
      }
    }
  });
}

// Bouton mise à jour
document.getElementById("updateDashboardGraph").addEventListener("click", renderDashboardGraph);

document.addEventListener("DOMContentLoaded", () => {
  refreshStats();
  loadLast();
  renderDashboardGraph();
});
