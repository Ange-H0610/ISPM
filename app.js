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

  const totalRev = state.revenus.reduce((s, r) => s + Number(r.montant), 0);
  const totalDep = state.depenses.reduce((s, d) => s + Number(d.montant), 0);
  const solde = totalRev - totalDep;

  const values = document.querySelectorAll(".value");
  animate(values[0], solde);
  animate(values[1], totalRev);
  animate(values[2], totalDep);
  animate(values[3], solde);

  document.querySelectorAll(".stat-card small")[1].textContent =
    state.revenus.length + " transactions";
  document.querySelectorAll(".stat-card small")[2].textContent =
    state.depenses.length + " transactions";
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

/* ================= CHART ================= */
const monthlyChart = new Chart(document.getElementById("monthlyChart"), {
  type: "line",
  data: {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    datasets: [
      { label: "Revenus", data: Array(12).fill(0), borderColor: "#22c55e", tension: .4 },
      { label: "Dépenses", data: Array(12).fill(0), borderColor: "#ef4444", tension: .4 }
    ]
  },
  options: { responsive: true, maintainAspectRatio: false }
});

function updateChart() {
  const state = getState();
  const rev = Array(12).fill(0);
  const dep = Array(12).fill(0);

  state.revenus.forEach(r => rev[new Date(r.date).getMonth()] += Number(r.montant));
  state.depenses.forEach(d => dep[new Date(d.date).getMonth()] += Number(d.montant));

  monthlyChart.data.datasets[0].data = rev;
  monthlyChart.data.datasets[1].data = dep;
  monthlyChart.update();
}

/* ================= INIT ================= */
refreshStats();
loadLast();
updateChart();
