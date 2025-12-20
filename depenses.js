/* ================= STORAGE ================= */
const STORAGE_KEY = "mybudget_depenses";

/* ================= DOM ================= */
const tbody = document.querySelector("#depensesTable tbody");
const emptyState = document.getElementById("emptyDepenses");
const totalEl = document.getElementById("totalDepenses");
const totalHeader = document.getElementById("totalHeader");
const countEl = document.getElementById("countDepenses");
const avgEl = document.getElementById("avgDepenses");
const addBtn = document.getElementById("addDepenseBtn");

/* ================= DATA ================= */
let depenses = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

/* ================= SAVE ================= */
function save(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(depenses));
}

/* ================= RENDER ================= */
function render(){
  tbody.innerHTML = "";

  if(depenses.length === 0){
    emptyState.style.display = "flex";
    depensesTable.classList.add("hidden");
  }else{
    emptyState.style.display = "none";
    depensesTable.classList.remove("hidden");
  }

  let total = 0;

  depenses.forEach((d,i)=>{
    total += d.montant;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${new Date(d.date).toLocaleDateString("fr-FR")}</td>
      <td>${d.motif}</td>
      <td class="text-red">${d.montant.toLocaleString()} Ar</td>
      <td>
        <button onclick="removeDepense(${i})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  totalEl.textContent = total.toLocaleString()+" Ar";
  totalHeader.textContent = total.toLocaleString()+" Ar";
  countEl.textContent = depenses.length;
  avgEl.textContent = depenses.length
    ? Math.floor(total / depenses.length).toLocaleString()+" Ar"
    : "0 Ar";
}

/* ================= ADD ================= */
addBtn.onclick = ()=>{
  const motif = prompt("Motif de la dépense (ex: Transport, Nourriture)");
  if(!motif) return;

  const montant = Number(prompt("Montant de la dépense"));
  if(!montant || montant <= 0){
    alert("Montant invalide");
    return;
  }

  depenses.unshift({
    motif,
    montant,
    date: new Date().toISOString()
  });

  save();
  render();
};

/* ================= DELETE ================= */
function removeDepense(index){
  if(!confirm("Supprimer cette dépense ?")) return;
  depenses.splice(index,1);
  save();
  render();
}

/* ================= INIT ================= */
render();
