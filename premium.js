// ===== NAVIGATION PREMIUM =====
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".premium-section");

navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();

        navLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");

        sections.forEach(sec => sec.classList.remove("active-section"));
        document.getElementById(link.dataset.section).classList.add("active-section");
    });
});

// ===== DONNÉES SIMULÉES =====
let revenus = 0;
let depenses = 0;

const soldeEl = document.getElementById("solde");
const revenusEl = document.getElementById("revenus");
const depensesEl = document.getElementById("depenses");
const epargneEl = document.getElementById("epargne");

function updateStats() {
    soldeEl.textContent = (revenus - depenses) + " Ar";
    revenusEl.textContent = revenus + " Ar";
    depensesEl.textContent = depenses + " Ar";
    epargneEl.textContent = Math.max(0, revenus - depenses) + " Ar";
}

// ===== AJOUT TRANSACTION =====
document.getElementById("addTransaction").addEventListener("click", () => {
    let type = prompt("Type de transaction (revenu ou dépense) :");

if (!type) return;

type = type.toLowerCase().trim();
type = type.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const montant = parseInt(prompt("Montant en Ariary :"));

    if (!montant || montant <= 0) {
        alert("Montant invalide");
        return;
    }

  if (type === "revenu") {
    revenus += montant;
} else if (type === "depense") {
    depenses += montant;
} else {
    alert("Type invalide. Écrivez : revenu ou dépense");
    return;
}


    updateStats();
});


// ===== RETOUR À L’ACCUEIL =====
document.getElementById("homeBtn").addEventListener("click", () => {
    window.location.href = "index.html";
});


// Initialisation
updateStats();
document.getElementById("analyseBtn").addEventListener("click", () => {
    let message = "";

    if (revenus === 0 && depenses === 0) {
        message = "Aucune donnée disponible pour l’analyse.";
    } else if (revenus === 0) {
        message = "⚠️ Aucun revenu enregistré.";
    } else if (depenses > revenus) {
        message = "⚠️ Vos dépenses dépassent vos revenus.";
    } else {
        const taux = Math.round((depenses / revenus) * 100);
        message = `✔️ Situation saine. Dépenses : ${taux}% des revenus.`;
    }

    document.getElementById("analyseResult").innerHTML = `
        <div class="analysis-box">${message}</div>
    `;
});

const reportBtn = document.getElementById("reportBtn");
const reportResult = document.getElementById("reportResult");

// ===== RAPPORTS =====
function getReports() {
    return JSON.parse(localStorage.getItem("reports")) || [];
}

function saveReport(report) {
    const reports = getReports();
    reports.unshift(report); // dernier en haut
    localStorage.setItem("reports", JSON.stringify(reports));
}

function deleteReport(index) {
    const reports = getReports();
    reports.splice(index, 1); // esorina ilay rapport amin'ny index
    localStorage.setItem("reports", JSON.stringify(reports));
    renderReports(); // havaozina ny affichage
}

function renderReports() {
    const reports = getReports();
    reportResult.innerHTML = "";

    if (reports.length === 0) {
        reportResult.innerHTML = "<p class='empty-report'>Aucun rapport sauvegardé.</p>";
        return;
    }

    reports.forEach((r, index) => {
        reportResult.innerHTML += `
            <div class="report-card">
                <div class="report-header">
                    <span class="report-date">${r.date}</span>
                    <span class="report-badge">Rapport sauvegardé</span>
                </div>
                <div class="report-body">
                    <p><strong>Revenus :</strong> ${r.revenus} Ar</p>
                    <p><strong>Dépenses :</strong> ${r.depenses} Ar</p>
                    <p><strong>Solde :</strong> ${r.solde} Ar</p>
                </div>
                <button class="delete-report-btn" data-index="${index}">Supprimer le rapport</button>
            </div>
        `;
    });

    // Ajouter listener ho an'ny bouton supprimer
    const deleteBtns = document.querySelectorAll(".delete-report-btn");
    deleteBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const idx = parseInt(btn.dataset.index);
            if (confirm("Voulez-vous vraiment supprimer ce rapport ?")) {
                deleteReport(idx);
            }
        });
    });
}

// Bouton pour générer un rapport
reportBtn.addEventListener("click", () => {
    const report = {
        date: new Date().toLocaleDateString("fr-FR"),
        revenus,
        depenses,
        solde: revenus - depenses
    };

    saveReport(report);
    renderReports();
});

// affichage automatique au chargement
renderReports();

// affichage automatique au chargement
renderReports();


document.getElementById("cloudBtn").addEventListener("click", () => {

    const cloudData = {
        revenus,
        depenses,
        rapports: JSON.parse(localStorage.getItem("reports")) || [],
        lastSync: new Date().toLocaleString("fr-FR")
    };

    localStorage.setItem("cloudBackup", JSON.stringify(cloudData));

    document.getElementById("cloudStatus").innerHTML = `
        <strong>☁️ Sauvegarde réussie</strong><br>
        Dernière synchronisation : ${cloudData.lastSync}
    `;
});
const cloudBackup = localStorage.getItem("cloudBackup");
if (cloudBackup) {
    const data = JSON.parse(cloudBackup);
    revenus = data.revenus || 0;
    depenses = data.depenses || 0;
    updateStats();
}

const saved = localStorage.getItem("premiumData");
if (saved) {
    const data = JSON.parse(saved);
    revenus = data.revenus;
    depenses = data.depenses;
    updateStats();
}

const navLinksContainer = document.querySelector(".nav-links");

function adjustMenu() {
    if (window.innerWidth > 992) {
        // Pour écran large, afficher menu complet
        navLinksContainer.style.display = "flex";
    } else {
        // Pour écran petit, cacher menu
        navLinksContainer.style.display = "none";
    }
}

// Appeler au chargement
window.addEventListener("load", adjustMenu);

// Appeler à chaque redimensionnement
window.addEventListener("resize", adjustMenu);

// Etat du menu (true = ouvert, false = fermé)
const burgerMenu = document.getElementById("burgerMenu");
let menuOpen = false;

burgerMenu.addEventListener("click", () => {
    menuOpen = !menuOpen;
    if (menuOpen) {
        navLinksContainer.style.display = "flex";
    } else {
        navLinksContainer.style.display = "none";
    }
});


// Fermer le menu si clic sur un lien
document.querySelectorAll(".nav-link, .nav-links button").forEach(item => {
    item.addEventListener("click", () => {
        if (menuOpen) {
            navLinksContainer.classList.remove("show");
            menuOpen = false;
        }
    });
});
