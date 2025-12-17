document.getElementById("date").textContent =
  new Date().toLocaleString();

const revenus = 0;
const depenses = 0;

const solde = revenus - depenses;

document.getElementById("revenus").textContent = revenus.toFixed(2) + " Ar";
document.getElementById("depenses").textContent = depenses.toFixed(2) + " Ar";
document.getElementById("solde").textContent = solde.toFixed(2) + " Ar";

new Chart(document.getElementById("lineChart"), {
  type: "line",
  data: {
    labels: ["Jan","Fev","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"],
    datasets: [
      {
        label: "Revenus",
        data: Array(12).fill(0),
        borderColor: "#22c55e",
        tension: .4
      },
      {
        label: "Dépenses",
        data: Array(12).fill(0),
        borderColor: "#ef4444",
        tension: .4
      }
    ]
  }
});

new Chart(document.getElementById("pieChart"), {
  type: "pie",
  data: {
    labels: ["Alimentation","Transport","Loyer","Autres"],
    datasets: [{
      data: [0,0,0,0],
      backgroundColor: ["#22c55e","#3b82f6","#8b5cf6","#f97316"]
    }]
  }
});
