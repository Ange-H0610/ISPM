// Récupération des budgets depuis localStorage
let budgets = JSON.parse(localStorage.getItem("budgets")) || {
  alimentation: {spent:0, limit:50000, notif:true},
  transport: {spent:0, limit:50000, notif:true},
  logement: {spent:0, limit:50000, notif:true}
};

// Fonction pour afficher
function refreshBudgets() {
  document.getElementById("alimentationSpent").textContent = budgets.alimentation.spent + " Ar";
  document.getElementById("alimentationLimit").value = budgets.alimentation.limit;
  document.getElementById("alimentationNotif").checked = budgets.alimentation.notif;

  document.getElementById("transportSpent").textContent = budgets.transport.spent + " Ar";
  document.getElementById("transportLimit").value = budgets.transport.limit;
  document.getElementById("transportNotif").checked = budgets.transport.notif;

  document.getElementById("logementSpent").textContent = budgets.logement.spent + " Ar";
  document.getElementById("logementLimit").value = budgets.logement.limit;
  document.getElementById("logementNotif").checked = budgets.logement.notif;
}

// Sauvegarde automatique à chaque changement
document.querySelectorAll("input[type=number]").forEach(input=>{
  input.addEventListener("input", e=>{
    if(e.target.id.includes("alimentation")) budgets.alimentation.limit = +e.target.value;
    if(e.target.id.includes("transport")) budgets.transport.limit = +e.target.value;
    if(e.target.id.includes("logement")) budgets.logement.limit = +e.target.value;
    localStorage.setItem("budgets", JSON.stringify(budgets));
  });
});

document.querySelectorAll("input[type=checkbox]").forEach(box=>{
  box.addEventListener("change", e=>{
    if(e.target.id.includes("alimentation")) budgets.alimentation.notif = e.target.checked;
    if(e.target.id.includes("transport")) budgets.transport.notif = e.target.checked;
    if(e.target.id.includes("logement")) budgets.logement.notif = e.target.checked;
    localStorage.setItem("budgets", JSON.stringify(budgets));
  });
});

refreshBudgets();
