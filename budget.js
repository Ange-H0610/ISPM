const defaultBudgets = {
  alimentation:{spent:0,limit:0},
  transport:{spent:0,limit:0},
  logement:{spent:0,limit:0}
};

let budgets = JSON.parse(localStorage.getItem("budgets")) || defaultBudgets;

function refreshCard(key){
  const spent = budgets[key].spent;
  const limit = budgets[key].limit;
  const reste = limit - spent;

  document.getElementById(key+"Spent").textContent = spent.toLocaleString();
  document.getElementById(key+"Reste").textContent = "Reste : " + reste.toLocaleString() + " Ar";

  const percent = limit > 0 ? Math.min((spent/limit)*100,100) : 0;
  const bar = document.getElementById(key+"Progress");
  bar.style.width = percent+"%";
  bar.style.background = spent>limit ? "#dc2626" : "linear-gradient(135deg,#7c3aed,#5b21b6)";

  if(spent>limit){
    alert("⚠️ Budget " + key + " depasse !");
  }
}

function addExpense(key){
  const limitInput = document.getElementById(key+"Limit");
  const addInput = document.getElementById(key+"Add");

  const limit = Number(limitInput.value) || 0;
  const add = Number(addInput.value) || 0;

  budgets[key].limit = limit;
  budgets[key].spent += add;

  addInput.value = "";

  refreshCard(key);
  updateSummary();
  localStorage.setItem("budgets",JSON.stringify(budgets));
}

function refreshAll(){
  for(const key in budgets){
    document.getElementById(key+"Limit").value = budgets[key].limit;
    refreshCard(key);
  }
  updateSummary();
}

function updateSummary(){
  const tbody = document.getElementById("summaryTable");
  tbody.innerHTML = "";
  for(const key in budgets){
    const reste = budgets[key].limit - budgets[key].spent;
    tbody.innerHTML += `<tr>
      <td>${key}</td>
      <td>${budgets[key].spent.toLocaleString()}</td>
      <td>${budgets[key].limit.toLocaleString()}</td>
      <td class="${reste>=0?'positive':'negative'}">${reste.toLocaleString()}</td>
    </tr>`;
  }
}

function saveBudgets(){
  localStorage.setItem("budgets",JSON.stringify(budgets));
  alert("Budgets sauvegardes !");
}

function resetBudgets(){
  budgets = JSON.parse(JSON.stringify(defaultBudgets));
  refreshAll();
}

refreshAll();
function goToDashboard(){
  window.location.href = "dashboard.html"; // Soloina araka ny anaran'ny dashboard anao
}
