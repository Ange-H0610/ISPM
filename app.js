const dateEl = document.getElementById("date");
const moisEl = document.getElementById("mois");

const now = new Date();
dateEl.textContent = "Dernière mise à jour : " + now.toLocaleString("fr-FR");
moisEl.textContent = now.toLocaleDateString("fr-FR",{month:"short",year:"numeric"});

/* Compteur animé */
function animateValue(el, to){
  let start = 0;
  const dur = 800;
  const t0 = performance.now();
  function tick(t){
    const p = Math.min((t - t0)/dur, 1);
    const v = Math.floor(start + (to-start)*p);
    el.textContent = v.toLocaleString('fr-FR') + " Ar";
    if(p<1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* Valeurs démo réalistes */
animateValue(document.querySelectorAll('.value')[0], 420000);
animateValue(document.querySelectorAll('.value')[1], 650000);
animateValue(document.querySelectorAll('.value')[2], 230000);
animateValue(document.querySelectorAll('.value')[3], 120000);
