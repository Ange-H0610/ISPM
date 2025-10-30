// ---------- Helpers ----------
function showError(message) {
  alert(message);
}

function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatNumber(n, lang = "fr") {
  try {
    return new Intl.NumberFormat(lang === "mg" ? "fr-FR" : (lang || "fr")).format(n);
  } catch (e) {
    return String(n);
  }
}


const TRANSLATIONS = {
  fr: {
    siteTitle: "Mon Dashboard - MyBudgetLocal",
    params: "Paramètres",
    logout: "Déconnexion",
    revenusTitle: "Revenus",
    depensesTitle: "Dépenses",
    calcBtn: "Calculer Total",
    totalRevenusLabel: "Total Revenus:",
    totalDepensesLabel: "Total Dépenses:",
    soldeLabel: "Solde restant:",
    langue: "Langue",
    theme: "Thème",
    objectifs: "Objectifs Financiers",
    visualisation: "Visualisation",
    clair: "Clair",
    sombre: "Sombre",
    epargne: "Épargne",
    emprunt: "Emprunt",
    investissement: "Investissement",
    tableau: "Tableau",
    graphique: "Graphique",
    revenu1: "Salaire et autres revenus",
    revenu2: "Pensions / Allocations",
    revenu3: "Loyers / Revenus du capital",
    revenu4: "Autres revenus",
    depense1: "Loyer et charges",
    depense2: "Alimentation",
    depense3: "Transports",
    depense4: "Loisirs / Culture",
    depense5: "Autres dépenses",
    mode_epargne: "Mode: Épargne",
    mode_emprunt: "Mode: Emprunt",
    mode_investissement: "Mode: Investissement",
  },
  en: {
    siteTitle: "My Dashboard - MyBudgetLocal",
    params: "Settings",
    logout: "Log out",
    revenusTitle: "Revenues",
    depensesTitle: "Expenses",
    calcBtn: "Calculate Total",
    totalRevenusLabel: "Total Revenues:",
    totalDepensesLabel: "Total Expenses:",
    soldeLabel: "Remaining balance:",
    langue: "Language",
    theme: "Theme",
    objectifs: "Financial Goals",
    visualisation: "View",
    clair: "Light",
    sombre: "Dark",
    epargne: "Savings",
    emprunt: "Loan",
    investissement: "Investment",
    tableau: "Table",
    graphique: "Chart",
    revenu1: "Salary & other incomes",
    revenu2: "Pensions / Allowances",
    revenu3: "Rents / Capital income",
    revenu4: "Other incomes",
    depense1: "Rent & utilities",
    depense2: "Food",
    depense3: "Transport",
    depense4: "Leisure / Culture",
    depense5: "Other expenses",
    mode_epargne: "Mode: Savings",
    mode_emprunt: "Mode: Loan",
    mode_investissement: "Mode: Investment",
  },
  mg: {
    siteTitle: "Tafatafa - MyBudgetLocal",
    params: "Fikirakirana",
    logout: "Hivoaka",
    revenusTitle: "Fidiram-bola",
    depensesTitle: "Fandaniana",
    calcBtn: "Kajy ny Totaly",
    totalRevenusLabel: "Total Fidiram-bola:",
    totalDepensesLabel: "Total Fandaniana:",
    soldeLabel: "Fahafahana sisa:",
    langue: "Fiteny",
    theme: "Lohahevitra",
    objectifs: "Tanjon'ny Vola",
    visualisation: "Fampisehoana",
    clair: "Mazava",
    sombre: "Maizina",
    epargne: "Tahiry",
    emprunt: "Trosa",
    investissement: "Fampiasam-bola",
    tableau: "Tabilao",
    graphique: "Sary",
    revenu1: "Karama sy hafa",
    revenu2: "Pension / Fanampiana",
    revenu3: "Hofan-trano / Vola mampanoa",
    revenu4: "Fidiram-bola hafa",
    depense1: "Hofan-trano sy saran'ny tolotra",
    depense2: "Sakafo",
    depense3: "Fitaterana",
    depense4: "Fialam-boly / Kolontsaina",
    depense5: "Fandaniana hafa",
    mode_epargne: "Mode: Tahiry",
    mode_emprunt: "Mode: Trosa",
    mode_investissement: "Mode: Fampiasam-bola",
  }
};


function applyTranslations(lang) {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.fr;
  // innerText replacement
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.innerText = dict[key];
  });
  // title tag
  if (dict.siteTitle) document.title = dict.siteTitle;

  // Mise à jour du badge mode si présent
  updateModeBadgeText();

  // Reformat numbers according to locale (simple)
  const langForNum = (lang === "en") ? "en-US" : "fr-FR";
  // update numeric displayed totals if present
  const totalR = Number(document.getElementById("totalRevenus").dataset.raw || 0);
  const totalD = Number(document.getElementById("totalDepenses").dataset.raw || 0);
  const solde = Number(document.getElementById("soldeFinal").dataset.raw || 0);
  document.getElementById("totalRevenus").innerText = formatNumber(totalR, lang);
  document.getElementById("totalDepenses").innerText = formatNumber(totalD, lang);
  document.getElementById("soldeFinal").innerText = formatNumber(solde, lang);
}

/* =========================
   Sauvegarde 
   ========================= */
const defaultSettings = {
  lang: "fr",
  theme: "dark", // 'dark' or 'light'
  goal: "epargne", // epargne / emprunt / investissement
  view: "tableau" // tableau / graphique
};

function loadSettings() {
  try {
    const s = JSON.parse(localStorage.getItem("mb_settings") || "{}");
    return { ...defaultSettings, ...s };
  } catch (e) {
    return { ...defaultSettings };
  }
}
function saveSettings(s) {
  localStorage.setItem("mb_settings", JSON.stringify(s));
}


// ---------- Signup page ----------
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPass").value;

    if (!name || !email || !password) {
      showError("Veuillez remplir le nom, l'email et le mot de passe.");
      return;
    }

    if (!isEmailValid(email)) {
      showError("Veuillez entrer une adresse email valide.");
      return;
    }

    const user = { name, email, password };
    localStorage.setItem("user", JSON.stringify(user));

    alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
    window.location.href = "index.html";
  });
}

// ---------- Login page ----------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  const savedUser = JSON.parse(localStorage.getItem("user"));
  if (savedUser && savedUser.name) {
    document.getElementById("loginName").value = savedUser.name;
  }

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("loginName").value.trim();
    const password = document.getElementById("loginPass").value;

    if (!name || !password) {
      showError("Veuillez entrer votre nom d'utilisateur et votre mot de passe.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      showError("Aucun compte trouvé. Veuillez d'abord vous inscrire.");
      return;
    }

    if (user.name === name && user.password === password) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userName", user.name);
      window.location.href = "dashboard.html";
    } else {
      showError("Nom d'utilisateur ou mot de passe incorrect.");
    }
  });
}


if (window.location.pathname.includes("dashboard.html")) {
  // Settings load
  let settings = loadSettings();

  // Protect page
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (!isLoggedIn) {
    window.location.href = "index.html";
  } else {
    const userName = localStorage.getItem("userName") || "Utilisateur";
    const greetingEl = document.getElementById("userGreeting");
    if (greetingEl) greetingEl.textContent = `${userName}`;
  }

  // apply theme setting
  function applyTheme(theme) {
    document.body.classList.remove("light-theme", "dark-theme", "gradient-theme");
    if (theme === "light") {
      document.body.classList.add("light-theme");
    } else {
    
      document.body.classList.add("gradient-theme");
    
      document.body.classList.add("dark-theme");
    }
  }

  // Mode badge (objectif)
  function updateModeBadgeText() {
    const dict = TRANSLATIONS[settings.lang] || TRANSLATIONS.fr;
    const badge = document.getElementById("modeBadge");
    if (!badge) return;
    if (settings.goal === "epargne") badge.innerText = dict.mode_epargne;
    else if (settings.goal === "emprunt") badge.innerText = dict.mode_emprunt;
    else if (settings.goal === "investissement") badge.innerText = dict.mode_investissement;
    else badge.innerText = "";
  }

  // apply translations
  applyTranslations(settings.lang);
  applyTheme(settings.theme);
  updateModeBadgeText();

  // Paramètres modal logic
  const settingsBtn = document.getElementById("settingsBtn");
  const settingsModal = document.getElementById("settingsModal");
  const closeSettings = document.querySelector(".close-settings");

  settingsBtn.addEventListener("click", () => {
    settingsModal.style.display = "flex";
    settingsModal.setAttribute("aria-hidden", "false");
  });

  closeSettings.addEventListener("click", () => {
    settingsModal.style.display = "none";
    settingsModal.setAttribute("aria-hidden", "true");
  });

  window.addEventListener("click", (e) => {
    if (e.target === settingsModal) {
      settingsModal.style.display = "none";
      settingsModal.setAttribute("aria-hidden", "true");
    }
  });

  // Langue selection
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      settings.lang = lang;
      saveSettings(settings);
      applyTranslations(settings.lang);
      // Update chart if visible
      if (settings.view === "graphique") drawChart();
    });
  });

  // Theme selection
  document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      settings.theme = btn.dataset.theme;
      saveSettings(settings);
      applyTheme(settings.theme);
    });
  });

  // Goals selection
  document.querySelectorAll(".goal-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      settings.goal = btn.dataset.goal;
      saveSettings(settings);
      updateModeBadgeText();
     
    });
  });

  // View selection (tableau / graphique)
  const chartCanvas = document.getElementById("financeChart");
  const ctx = chartCanvas ? chartCanvas.getContext("2d") : null;

  function showTableView() {
    // Show tables and hide canvas
    document.getElementById("revenusTable").style.display = "";
    document.getElementById("depensesTable").style.display = "";
    if (chartCanvas) chartCanvas.style.display = "none";
  }

  function showChartView() {
    document.getElementById("revenusTable").style.display = "none";
    document.getElementById("depensesTable").style.display = "none";
    if (chartCanvas) {
      chartCanvas.style.display = "block";
      drawChart();
    }
  }

  document.querySelectorAll(".view-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      settings.view = btn.dataset.view;
      saveSettings(settings);
      if (settings.view === "graphique") showChartView();
      else showTableView();
    });
  });

  // Initialize view mode on load
  if (settings.view === "graphique") showChartView();
  else showTableView();

  // Calcul du solde
  const calcBtn = document.getElementById("calcBtn");
  if (calcBtn) {
    calcBtn.addEventListener("click", function () {
      let totalRevenus = 0;
      let totalDepenses = 0;

      document.querySelectorAll(".revenu").forEach((input) => {
        const v = Number(input.value) || 0;
        totalRevenus += v;
      });

      document.querySelectorAll(".depense").forEach((input) => {
        const v = Number(input.value) || 0;
        totalDepenses += v;
      });

      const solde = totalRevenus - totalDepenses;

      const elRevs = document.getElementById("totalRevenus");
      const elDeps = document.getElementById("totalDepenses");
      const elSolde = document.getElementById("soldeFinal");

      if (elRevs) {
        elRevs.dataset.raw = totalRevenus;
        elRevs.innerText = formatNumber(totalRevenus, settings.lang);
      }
      if (elDeps) {
        elDeps.dataset.raw = totalDepenses;
        elDeps.innerText = formatNumber(totalDepenses, settings.lang);
      }
      if (elSolde) {
        elSolde.dataset.raw = solde;
        elSolde.innerText = formatNumber(solde, settings.lang);
      }

      if (settings.view === "graphique") drawChart();
    });
  }

  // Déconnexion
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userName");
      window.location.href = "index.html";
    });
  }

  function drawChart() {
    if (!ctx) return;
    // compute totals
    let totalRevenus = 0;
    let totalDepenses = 0;
    document.querySelectorAll(".revenu").forEach((input) => {
      totalRevenus += Number(input.value) || 0;
    });
    document.querySelectorAll(".depense").forEach((input) => {
      totalDepenses += Number(input.value) || 0;
    });

    const w = chartCanvas.width = Math.min(900, document.getElementById("viewArea").clientWidth || 700);
    const h = chartCanvas.height = 300;
    chartCanvas.style.maxWidth = "100%";

    // clear
    ctx.clearRect(0, 0, w, h);

    // axis and padding
    const pad = 40;
    const chartW = w - pad * 2;
    const chartH = h - pad * 2;

    const maxVal = Math.max(totalRevenus, totalDepenses, 1);
    // background grid
    ctx.strokeStyle = "rgba(0,0,0,0.08)";
    for (let i = 0; i <= 4; i++) {
      const y = pad + (chartH * i) / 4;
      ctx.beginPath();
      ctx.moveTo(pad, y);
      ctx.lineTo(pad + chartW, y);
      ctx.stroke();
    }

    // Bars width
    const barWidth = Math.min(120, chartW / 3);
    const gap = 40;
    const x1 = pad + chartW / 4 - barWidth / 2;
    const x2 = pad + (chartW * 3) / 4 - barWidth / 2;

    // Colors based on theme
    const themeIsLight = document.body.classList.contains("light-theme");
    const revColor = themeIsLight ? "#1b7a3a" : "#8ef08e";
    const depColor = themeIsLight ? "#b71c1c" : "#ff8a8a";
    // draw revenues
    const revH = (totalRevenus / maxVal) * chartH;
    ctx.fillStyle = revColor;
    ctx.fillRect(x1, pad + (chartH - revH), barWidth, revH);
    // draw depenses
    const depH = (totalDepenses / maxVal) * chartH;
    ctx.fillStyle = depColor;
    ctx.fillRect(x2, pad + (chartH - depH), barWidth, depH);

    // labels
    ctx.fillStyle = themeIsLight ? "#111" : "#fff";
    ctx.font = "14px sans-serif";
    const dict = TRANSLATIONS[settings.lang] || TRANSLATIONS.fr;
    ctx.fillText(dict.totalRevenusLabel || "Revenus", x1, pad + chartH + 20);
    ctx.fillText(dict.totalDepensesLabel || "Dépenses", x2, pad + chartH + 20);

    // values on top of bars
    ctx.font = "bold 13px sans-serif";
    ctx.fillText(formatNumber(totalRevenus, settings.lang), x1, pad + (chartH - revH) - 8);
    ctx.fillText(formatNumber(totalDepenses, settings.lang), x2, pad + (chartH - depH) - 8);
  }

  // If user resizes, redraw chart for responsiveness
  window.addEventListener("resize", () => {
    if (settings.view === "graphique") drawChart();
  });
}
