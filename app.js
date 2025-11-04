// === Transactions simulées ===
const transactions = [
  { nom: "Facture d'électricité", date: "02/11/2025", montant: "275 $", statut: "Payée" },
  { nom: "Courses hebdomadaires", date: "28/10/2025", montant: "142 $", statut: "Payée" },
  { nom: "Sortie cinéma", date: "25/10/2025", montant: "40 $", statut: "En attente" },
  { nom: "Visite médicale", date: "22/10/2025", montant: "120 $", statut: "Payée" },
];

const activites = [
  "Jamie Smith a mis à jour les paramètres du compte",
  "Alex Johnson s’est connecté",
  "Morgan Lee a ajouté un nouvel objectif d’épargne",
  "Taylor Green a revu les transactions récentes",
];

// === Injection des données dans le tableau ===
const tbody = document.querySelector("#transactions tbody");
transactions.forEach(t => {
  const row = document.createElement("tr");
  row.innerHTML = `<td>${t.nom}</td><td>${t.date}</td><td>${t.montant}</td><td>${t.statut}</td>`;
  tbody.appendChild(row);
});

// === Liste des activités ===
const act = document.getElementById("activity");
activites.forEach(a => {
  const div = document.createElement("div");
  div.textContent = a;
  act.appendChild(div);
});

// === Graphique simple (barres) ===
const chart = document.getElementById("chart");
const mois = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
const valeurs = [10, 30, 45, 55, 40, 70, 65, 80, 72, 60, 42, 30];

chart.innerHTML = `
  <div style="display:flex;gap:8px;align-items:end;height:180px;padding:10px;">
    ${valeurs.map((v,i)=>`
      <div style="text-align:center;">
        <div style="background:#1b6b4f;height:${v*2}px;width:20px;border-radius:6px 6px 0 0;margin-bottom:6px;"></div>
        <small style="color:#60736b">${mois[i]}</small>
      </div>
    `).join('')}
  </div>
`;

// === Donut (SVG) ===
const donut = document.getElementById("donut");
const sections = [
  { couleur:"#1b6b4f", valeur:40 },
  { couleur:"#4caf7a", valeur:25 },
  { couleur:"#9ad7b3", valeur:15 },
  { couleur:"#c3e5d2", valeur:10 },
  { couleur:"#e2f3e9", valeur:10 },
];
let total = 0, angle = 0;
sections.forEach(s => total += s.valeur);
sections.forEach(s => {
  const cercle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  cercle.setAttribute("r", "50");
  cercle.setAttribute("cx", "60");
  cercle.setAttribute("cy", "60");
  cercle.setAttribute("fill", "transparent");
  cercle.setAttribute("stroke", s.couleur);
  cercle.setAttribute("stroke-width", "18");
  cercle.setAttribute("stroke-dasharray", `${(s.valeur/total)*314} 314`);
  cercle.setAttribute("transform", `rotate(${angle-90} 60 60)`);
  angle += (s.valeur/total)*360;
  donut.appendChild(cercle);
});
