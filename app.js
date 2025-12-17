const dateEl = document.getElementById("date");
const moisEl = document.getElementById("mois");

const now = new Date();
dateEl.textContent = "Dernière mise à jour : " + now.toLocaleString("fr-FR");
moisEl.textContent = now.toLocaleDateString("fr-FR",{month:"short",year:"numeric"});

// Animation chiffres
function animateValue(el, to){
  let start = 0;
  const duration = 800;
  const startTime = performance.now();

  function update(time){
    const progress = Math.min((time - startTime)/duration, 1);
    const value = Math.floor(progress * to);
    el.textContent = value.toLocaleString("fr-FR") + " Ar";
    if(progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

document.querySelectorAll(".value").forEach((el,i)=>{
  const values = [420000,650000,230000,120000];
  animateValue(el, values[i]);
});

// CHART OPTIONS
const commonOptions = {
  responsive:true,
  maintainAspectRatio:false,
  plugins:{ legend:{ display:false } }
};

// ÉVOLUTION
new Chart(monthlyChart,{
  type:"line",
  data:{
    labels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    datasets:[
      { label:"Revenus", data:Array(12).fill(0), borderColor:"#22c55e", tension:.4 },
      { label:"Dépenses", data:Array(12).fill(0), borderColor:"#ef4444", tension:.4 }
    ]
  },
  options:commonOptions
});

// CATÉGORIES
new Chart(categoryChart,{
  type:"doughnut",
  data:{
    labels:["Alimentation","Transport","Loisirs","Autres"],
    datasets:[{
      data:[0,0,0,0],
      backgroundColor:["#6366f1","#22c55e","#f59e0b","#ef4444"]
    }]
  },
  options:{ responsive:true, maintainAspectRatio:false }
});
// REVENUS PAR CATÉGORIE
const revenusCategoryChart = document.getElementById("revenusCategoryChart");

new Chart(revenusCategoryChart,{
  type:"doughnut",
  data:{
    labels:["Salaire","Business","Autres"],
    datasets:[{
      data:[0,0,0],
      backgroundColor:["#22c55e","#6366f1","#f59e0b"]
    }]
  },
  options:{
    responsive:true,
    maintainAspectRatio:false
  }
});

// MENU MOBILE
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", ()=>{
  navMenu.classList.toggle("show");
});

