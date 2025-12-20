/* ================= STORAGE ================= */
const STORAGE_KEY = "mybudget_revenus";

/* ================= DOM ================= */
const tbody = document.querySelector("#revenusTable tbody");
const emptyState = document.getElementById("emptyRevenus");
const totalEl = document.getElementById("totalRevenus");
const totalHeader = document.getElementById("totalHeader");
const countEl = document.getElementById("countRevenus");
const avgEl = document.getElementById("avgRevenus");
const addBtn = document.getElementById("addRevenuBtn");

/* ================= DATA ================= */
let revenus = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

/* ================= SAVE ================= */
function save(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(revenus));
}

/* ================= RENDER ================= */
function render(){
  tbody.innerHTML = "";

  if(revenus.length === 0){
    emptyState.style.display = "flex";
    revenusTable.classList.add("hidden");
  }else{
    emptyState.style.display = "none";
    revenusTable.classList.remove("hidden");
  }

  let total = 0;

  revenus.forEach((r,i)=>{
    total += r.montant;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${new Date(r.date).toLocaleDateString("fr-FR")}</td>
      <td>${r.source}</td>
      <td class="text-green">${r.montant.toLocaleString()} Ar</td>
      <td>
        <button onclick="removeRevenu(${i})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  totalEl.textContent = total.toLocaleString()+" Ar";
  totalHeader.textContent = total.toLocaleString()+" Ar";
  countEl.textContent = revenus.length;
  avgEl.textContent = revenus.length
    ? Math.floor(total / revenus.length).toLocaleString()+" Ar"
    : "0 Ar";
}

/* ================= ADD ================= */
addBtn.onclick = ()=>{
  const source = prompt("Source du revenu (ex: Salaire, Business)");
  if(!source) return;

  const montant = Number(prompt("Montant du revenu"));
  if(!montant || montant <= 0){
    alert("Montant invalide");
    return;
  }

  revenus.unshift({
    source,
    montant,
    date: new Date().toISOString()
  });

  save();
  render();
};

/* ================= DELETE ================= */
function removeRevenu(index){
  if(!confirm("Supprimer ce revenu ?")) return;
  revenus.splice(index,1);
  save();
  render();
}

/* ================= INIT ================= */
render();
