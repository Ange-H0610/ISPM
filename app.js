/* ================= DATE ================= */
const dateEl = document.getElementById("date");
const moisEl = document.getElementById("mois");

const now = new Date();
dateEl.textContent = "Dernière mise à jour : " + now.toLocaleString("fr-FR");
moisEl.textContent = now.toLocaleDateString("fr-FR",{month:"long",year:"numeric"});

/* ================= DATA FAKE (TEMPORAIRE) ================= */
let data = {
  revenus: [],
  depenses: []
};

/* ================= NOTIFICATION ================= */
document.querySelector(".fa-bell").addEventListener("click", ()=>{
  alert("🔔 Aucune notification pour le moment");
});

/* ================= AVATAR ================= */
document.querySelector(".avatar").addEventListener("click", ()=>{
  const user = JSON.parse(localStorage.getItem("mybudget_user"));
  alert(
    `👤 Profil utilisateur\nNom : ${user?.name || "Utilisateur"}\nStatut : Actif`
  );
});


/* ================= BOUTON AJOUTER ================= */
document.querySelector(".btn-add").addEventListener("click", ()=>{
  const type = prompt("Ajouter : revenu ou dépense ?");
  if(!type) return;

  const montant = Number(prompt("Montant ?"));
  if(!montant) return alert("Montant invalide");

  if(type.toLowerCase().includes("rev")){
    data.revenus.push(montant);
    alert("✅ Revenu ajouté");
  }else{
    data.depenses.push(montant);
    alert("❌ Dépense ajoutée");
  }
  refreshStats();
});

/* ================= ACTIONS RAPIDES ================= */
const qa = document.querySelectorAll(".qa");

qa[0].onclick = ()=> fakeAdd("revenu");
qa[1].onclick = ()=> fakeAdd("dépense");
qa[2].onclick = ()=> showList("revenus");
qa[3].onclick = ()=> showList("dépenses");

function fakeAdd(type){
  const m = Number(prompt("Montant du "+type));
  if(!m) return;
  type === "revenu" ? data.revenus.push(m) : data.depenses.push(m);
  refreshStats();
}

function showList(type){
  const list = data[type];
  alert(
    `📋 ${type.toUpperCase()}\n` +
    (list.length ? list.join(" Ar\n")+" Ar" : "Aucune donnée")
  );
}

/* ================= EMPTY STATE BOUTONS ================= */
document.querySelectorAll(".empty-state .btn").forEach(btn=>{
  btn.onclick = ()=> alert("➕ Fonction ajout déclenchée");
});

/* ================= STATS CLICK ================= */
document.querySelectorAll(".stat-card").forEach(card=>{
  card.onclick = ()=>{
    alert("📊 Détail statistique\n(Fonction prête)");
  };
});

/* ================= ANIMATION CHIFFRES ================= */
function animate(el, to){
  let n = 0;
  const i = setInterval(()=>{
    n += Math.ceil(to/30);
    if(n >= to){ n = to; clearInterval(i); }
    el.textContent = n.toLocaleString("fr-FR")+" Ar";
  },20);
}

function refreshStats(){
  const totalRev = data.revenus.reduce((a,b)=>a+b,0);
  const totalDep = data.depenses.reduce((a,b)=>a+b,0);
  const solde = totalRev - totalDep;

  const values = document.querySelectorAll(".value");
  animate(values[0], solde);
  animate(values[1], totalRev);
  animate(values[2], totalDep);
  animate(values[3], solde);
}

/* ================= CHARTS ================= */
const monthlyChart = new Chart(document.getElementById("monthlyChart"),{
  type:"line",
  data:{
    labels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    datasets:[
      {label:"Revenus",data:Array(12).fill(0),borderColor:"#22c55e",tension:.4},
      {label:"Dépenses",data:Array(12).fill(0),borderColor:"#ef4444",tension:.4}
    ]
  },
  options:{responsive:true,maintainAspectRatio:false}
});

const categoryChart = new Chart(document.getElementById("categoryChart"),{
  type:"doughnut",
  data:{
    labels:["Alimentation","Transport","Loisirs","Autres"],
    datasets:[{data:[0,0,0,0],backgroundColor:["#6366f1","#22c55e","#f59e0b","#ef4444"]}]
  },
  options:{responsive:true,maintainAspectRatio:false}
});

/* ================= AGRANDIR CHART ================= */
document.querySelectorAll(".expand").forEach(btn=>{
  btn.onclick = ()=>{
    alert("🔍 Mode agrandi (à brancher modal)");
  };
});

/* ================= MENU MOBILE ================= */
menuToggle.onclick = ()=> navMenu.classList.toggle("show");

/* ================= INIT ================= */
refreshStats();
/* ================= USER ================= */
const user = JSON.parse(localStorage.getItem("mybudget_user"));
const userNameEl = document.getElementById("userName");

if(!user || !user.isLoggedIn){
  window.location.href = "login.html";
}else{
  userNameEl.textContent = user.name;
}
