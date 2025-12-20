let objectifs = JSON.parse(localStorage.getItem("objectifs")) || {
  epargne:{cible:0, actuel:0},
  invest:{cible:0, actuel:0},
  emprunt:{cible:0, actuel:0}
};

function calc(cible, actuel){
  if(cible===0) return 0;
  return Math.min(100, Math.round((actuel/cible)*100));
}

function refresh(){
  // Épargne
  epargneCible.textContent = objectifs.epargne.cible+" Ar";
  epargneActuel.textContent = objectifs.epargne.actuel+" Ar";
  let ep = calc(objectifs.epargne.cible, objectifs.epargne.actuel);
  epargnePct.textContent = ep+"%";
  epargneBar.style.width = ep+"%";
  epargneTotal.textContent = objectifs.epargne.actuel+" Ar";

  // Invest
  investCible.textContent = objectifs.invest.cible+" Ar";
  investActuel.textContent = objectifs.invest.actuel+" Ar";
  let ip = calc(objectifs.invest.cible, objectifs.invest.actuel);
  investPct.textContent = ip+"%";
  investBar.style.width = ip+"%";
  investTotal.textContent = objectifs.invest.actuel+" Ar";

  // Emprunt
  empruntCible.textContent = objectifs.emprunt.cible+" Ar";
  empruntActuel.textContent = objectifs.emprunt.actuel+" Ar";
  let rp = calc(objectifs.emprunt.cible, objectifs.emprunt.actuel);
  empruntPct.textContent = rp+"%";
  empruntBar.style.width = rp+"%";
  empruntTotal.textContent = (objectifs.emprunt.cible - objectifs.emprunt.actuel)+" Ar";
}

addObjectifBtn.onclick = ()=>{
  objectifs.epargne.cible = +prompt("Objectif épargne ?", objectifs.epargne.cible);
  objectifs.epargne.actuel = +prompt("Épargne actuelle ?", objectifs.epargne.actuel);

  objectifs.invest.cible = +prompt("Objectif investissement ?", objectifs.invest.cible);
  objectifs.invest.actuel = +prompt("Investissement actuel ?", objectifs.invest.actuel);

  objectifs.emprunt.cible = +prompt("Montant emprunt ?", objectifs.emprunt.cible);
  objectifs.emprunt.actuel = +prompt("Déjà remboursé ?", objectifs.emprunt.actuel);

  localStorage.setItem("objectifs", JSON.stringify(objectifs));
  refresh();
};

refresh();
const modal = document.getElementById("updateModal");
const btn = document.getElementById("addObjectifBtn");
const closeBtn = document.querySelectorAll(".close, .close-btn");

btn.onclick = () => {
  // Remplir les inputs avec les valeurs actuelles
  epargneCibleInput.value = objectifs.epargne.cible;
  epargneActuelInput.value = objectifs.epargne.actuel;
  investCibleInput.value = objectifs.invest.cible;
  investActuelInput.value = objectifs.invest.actuel;
  empruntCibleInput.value = objectifs.emprunt.cible;
  empruntActuelInput.value = objectifs.emprunt.actuel;

  modal.style.display = "block";
};

closeBtn.forEach(el => el.onclick = () => modal.style.display = "none");

// Valider formulaire
updateForm.onsubmit = e => {
  e.preventDefault();
  objectifs.epargne.cible = +epargneCibleInput.value;
  objectifs.epargne.actuel = +epargneActuelInput.value;
  objectifs.invest.cible = +investCibleInput.value;
  objectifs.invest.actuel = +investActuelInput.value;
  objectifs.emprunt.cible = +empruntCibleInput.value;
  objectifs.emprunt.actuel = +empruntActuelInput.value;

  localStorage.setItem("objectifs", JSON.stringify(objectifs));
  refresh();
  modal.style.display = "none";
};

// Fermer modal si click any ivelany
window.onclick = e => {
  if(e.target == modal) modal.style.display = "none";
};
