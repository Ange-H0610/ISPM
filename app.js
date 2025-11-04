// ---------- Helpers ----------
function showError(message) {
  alert(message);
}

function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatNumber(n, lang = "fr") {
  try {
    const locale = (lang === "en") ? "en-US" : (lang === "mg" ? "fr-FR" : "fr-FR");
    return new Intl.NumberFormat(locale).format(n);
  } catch (e) {
    return String(n);
  }
}

/* ======================
   Traductions (simple)
   ====================== */
const TRANSLATIONS = {
  fr: { siteTitle: "Mon Dashboard - MyBudgetLocal", params: "Paramètres", logout: "Déconnexion",
        revenusTitle: "Revenus", depensesTitle: "Dépenses", calcBtn: "Total",
        totalRevenusLabel: "Total Revenus :", totalDepensesLabel: "Total Dépenses :", soldeLabel: "Solde restant :",
        langue: "Langue", theme: "Thème", objectifs: "Objectifs Financiers", visualisation: "Visualisation",
        clair: "Clair", sombre: "Sombre", epargne: "Épargne", emprunt: "Emprunt", investissement: "Investissement",
        tableau: "Tableau", graphique: "Graphique",
        revenu1:"Salaire et autres revenus", revenu2:"Pensions / Allocations", revenu3:"Loyers / Revenus du capital", revenu4:"Autres revenus",
        depense1:"Loyer et charges", depense2:"Alimentation", depense3:"Transports", depense4:"Loisirs / Culture", depense5:"Autres dépenses",
        mode_epargne: "Mode: Épargne", mode_emprunt:"Mode: Emprunt", mode_investissement:"Mode: Investissement"
      },
  en: { siteTitle: "My Dashboard - MyBudgetLocal", params: "Settings", logout: "Log out",
        revenusTitle: "Revenues", depensesTitle: "Expenses", calcBtn: "Total",
        totalRevenusLabel: "Total Revenues :", totalDepensesLabel: "Total Expenses :", soldeLabel: "Remaining balance :",
        langue: "Language", theme: "Theme", objectifs: "Financial Goals", visualisation: "View",
        clair: "Light", sombre: "Dark", epargne: "Savings", emprunt: "Loan", investissement: "Investment",
        tableau: "Table", graphique: "Chart",
        revenu1:"Salary & other incomes", revenu2:"Pensions / Allowances", revenu3:"Rents / Capital income", revenu4:"Other incomes",
        depense1:"Rent & utilities", depense2:"Food", depense3:"Transport", depense4:"Leisure / Culture", depense5:"Other expenses",
        mode_epargne: "Mode: Savings", mode_emprunt:"Mode: Loan", mode_investissement:"Mode: Investment"
      },
  mg: { siteTitle: "Tafatafa - MyBudgetLocal", params: "Fikirakirana", logout: "Hivoaka",
        revenusTitle: "Fidiram-bola", depensesTitle: "Fandaniana", calcBtn: "Kajy ny Totaly",
        totalRevenusLabel: "Total Fidiram-bola :", totalDepensesLabel: "Total Fandaniana :", soldeLabel: "Fahafahana sisa :",
        langue: "Fiteny", theme: "Lohahevitra", objectifs: "Tanjon'ny Vola", visualisation: "Fampisehoana",
        clair: "Mazava", sombre: "Maizina", epargne: "Tahiry", emprunt: "Trosa", investissement: "Fampiasam-bola",
        tableau: "Tabilao", graphique: "Sary",
        revenu1:"Karama sy hafa", revenu2:"Pension / Fanampiana", revenu3:"Hofan-trano / Vola mampanoa", revenu4:"Fidiram-bola hafa",
        depense1:"Hofan-trano sy saran'ny tolotra", depense2:"Sakafo", depense3:"Fitaterana", depense4:"Fialam-boly / Kolontsaina", depense5:"Fandaniana hafa",
        mode_epargne: "Mode: Tahiry", mode_emprunt:"Mode: Trosa", mode_investissement:"Mode: Fampiasam-bola"
      }
};

const defaultSettings = { lang: "fr", theme: "dark", goal: "epargne", view: "tableau" };

// storage helpers
function loadSettings(){ try { return {...defaultSettings, ...JSON.parse(localStorage.getItem("mb_settings")||"{}")}; } catch(e){ return {...defaultSettings}; } }
function saveSettings(s){ localStorage.setItem("mb_settings", JSON.stringify(s)); }

/* =========================
   MAIN
   ========================= */
document.addEventListener("DOMContentLoaded", function() {
  // Signup / Login (index.html) logic (kept minimal, unchanged)
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", function(e){
      e.preventDefault();
      const name = document.getElementById("signupName").value.trim();
      const email = document.getElementById("signupEmail").value.trim();
      const password = document.getElementById("signupPass").value;
      if (!name || !email || !password) { showError("Veuillez remplir le nom, l'email et le mot de passe."); return; }
      if (!isEmailValid(email)) { showError("Veuillez entrer une adresse email valide."); return; }
      localStorage.setItem("user", JSON.stringify({ name, email, password }));
      alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
      window.location.href = "index.html";
    });
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (savedUser && savedUser.name) document.getElementById("loginName").value = savedUser.name;
    loginForm.addEventListener("submit", function(e){
      e.preventDefault();
      const name = document.getElementById("loginName").value.trim();
      const password = document.getElementById("loginPass").value;
      if (!name || !password) { showError("Veuillez entrer votre nom d'utilisateur et votre mot de passe."); return; }
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (!user) { showError("Aucun compte trouvé. Veuillez d'abord vous inscrire."); return; }
      if (user.name === name && user.password === password) {
        localStorage.setItem("isLoggedIn","true"); localStorage.setItem("userName", user.name);
        window.location.href = "dashboard.html";
      } else showError("Nom d'utilisateur ou mot de passe incorrect.");
    });
  }

  // If dashboard page
  if (window.location.pathname.includes("dashboard.html")) {
    // load settings, protect page
    let settings = loadSettings();
    if (!localStorage.getItem("isLoggedIn")) window.location.href = "index.html";
    else {
      const userName = localStorage.getItem("userName") || "Utilisateur";
      const greetingEl = document.getElementById("userGreeting");
      if (greetingEl) greetingEl.textContent = `${userName}`;
    }

    // apply theme
    function applyTheme(theme){
      document.body.classList.remove("light-theme","dark-theme","gradient-theme");
      if (theme === "light") document.body.classList.add("light-theme");
      else { document.body.classList.add("gradient-theme"); document.body.classList.add("dark-theme"); }
    }
    applyTheme(settings.theme);

    // mode badge update
    function updateModeBadgeText(){
      const dict = TRANSLATIONS[settings.lang] || TRANSLATIONS.fr;
      const badge = document.getElementById("modeBadge");
      if (!badge) return;
      if (settings.goal === "epargne") badge.innerText = dict.mode_epargne;
      else if (settings.goal === "emprunt") badge.innerText = dict.mode_emprunt;
      else if (settings.goal === "investissement") badge.innerText = dict.mode_investissement;
      else badge.innerText = "";
    }
    updateModeBadgeText();

    // translations apply
    function applyTranslations(lang){
      const dict = TRANSLATIONS[lang] || TRANSLATIONS.fr;
      document.querySelectorAll("[data-i18n]").forEach(el=>{
        const key = el.getAttribute("data-i18n");
        if (dict[key]) el.innerText = dict[key];
      });
      if (dict.siteTitle) document.title = dict.siteTitle;
      // reformat numeric displays (if present)
      const elTR = document.getElementById("totalRevenusDisplay");
      const elTD = document.getElementById("totalDepensesDisplay");
      const elSol = document.getElementById("soldeFinalDisplay");
      if (elTR && elTR.dataset.raw) elTR.innerText = formatNumber(Number(elTR.dataset.raw), lang);
      if (elTD && elTD.dataset.raw) elTD.innerText = formatNumber(Number(elTD.dataset.raw), lang);
      if (elSol && elSol.dataset.raw) elSol.innerText = formatNumber(Number(elSol.dataset.raw), lang);
    }
    applyTranslations(settings.lang);

    // SETTINGS modal controls
    const settingsBtn = document.getElementById("settingsBtn");
    const settingsModal = document.getElementById("settingsModal");
    const closeSettings = document.querySelector(".close-settings");

    settingsBtn.addEventListener("click", () => {
      settingsModal.style.display = "flex";
      settingsModal.setAttribute("aria-hidden", "false");
      // when opening modal ensure visualization state is in sync
      setVizMode(settings.view === "graphique" ? "graphique" : "tableau");
      updateViz(); // refresh visualization content
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

    // Lang buttons
    document.querySelectorAll(".lang-btn").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        document.querySelectorAll(".lang-btn").forEach(b=>b.classList.remove("active"));
        btn.classList.add("active");
        settings.lang = btn.dataset.lang;
        saveSettings(settings);
        applyTranslations(settings.lang);
      });
      // mark active initial
      if (btn.dataset.lang === settings.lang) btn.classList.add("active");
    });

    // Theme buttons
    document.querySelectorAll(".theme-btn").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        document.querySelectorAll(".theme-btn").forEach(b=>b.classList.remove("active"));
        btn.classList.add("active");
        settings.theme = btn.dataset.theme;
        saveSettings(settings);
        applyTheme(settings.theme);
      });
      if (btn.dataset.theme === settings.theme) btn.classList.add("active");
    });

    // Goals
    document.querySelectorAll(".goal-btn").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        document.querySelectorAll(".goal-btn").forEach(b=>b.classList.remove("active"));
        btn.classList.add("active");
        settings.goal = btn.dataset.goal;
        saveSettings(settings);
        updateModeBadgeText();
      });
      if (btn.dataset.goal === settings.goal) btn.classList.add("active");
    });

    // Visualization mode (tableau / graphique) inside modal
    const vizButtons = document.querySelectorAll(".viz-btn");
    let currentVizMode = settings.view || "tableau";
    function setVizMode(mode){
      document.querySelectorAll(".viz-btn").forEach(b=>b.classList.remove("active"));
      document.querySelectorAll(".viz-btn").forEach(b=>{ if (b.dataset.view === mode) b.classList.add("active"); });
      currentVizMode = mode;
      // show/hide chart preview
      document.getElementById("vizChartWrap").style.display = (mode === "graphique") ? "block" : "none";
      document.getElementById("viewArea").style.display = (mode === "graphique") ? "block" : "none";
    }
    vizButtons.forEach(btn=>{
      btn.addEventListener("click", ()=>{
        settings.view = btn.dataset.view;
        saveSettings(settings);
        setVizMode(settings.view);
      });
    });
    setVizMode(currentVizMode);

    // CALCULATION logic (shared)
    function computeTotals(){
      let totalRevenus = 0, totalDepenses = 0;
      document.querySelectorAll(".revenu").forEach(input => { totalRevenus += Number(input.value) || 0; });
      document.querySelectorAll(".depense").forEach(input => { totalDepenses += Number(input.value) || 0; });
      const solde = totalRevenus - totalDepenses;
      // update displays and dataset.raw for translation formatting
      const elTR = document.getElementById("totalRevenusDisplay");
      const elTD = document.getElementById("totalDepensesDisplay");
      const elSol = document.getElementById("soldeFinalDisplay");
      if (elTR) { elTR.dataset.raw = totalRevenus; elTR.innerText = formatNumber(totalRevenus, settings.lang); }
      if (elTD) { elTD.dataset.raw = totalDepenses; elTD.innerText = formatNumber(totalDepenses, settings.lang); }
      if (elSol) { elSol.dataset.raw = solde; elSol.innerText = formatNumber(solde, settings.lang); }
      return { totalRevenus, totalDepenses, solde };
    }

    // Calc button in main dashboard
    const calcBtn = document.getElementById("calcBtn");
    if (calcBtn) {
      calcBtn.addEventListener("click", () => {
        computeTotals();
        // if chart visible on main area, redraw
        if (settings.view === "graphique") drawChart();
      });
    }

    // LOGOUT
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userName");
        window.location.href = "index.html";
      });
    }

    // Simple chart (main area) - re-used from earlier
    const financeChartCanvas = document.getElementById("financeChart");
    const financeCtx = financeChartCanvas ? financeChartCanvas.getContext("2d") : null;
    function drawChart(){
      if (!financeCtx) return;
      const totals = computeTotals();
      const totalRevenus = totals.totalRevenus, totalDepenses = totals.totalDepenses;
      const w = financeChartCanvas.width = Math.min(900, document.getElementById("viewArea").clientWidth || 700);
      const h = financeChartCanvas.height = 300;
      const pad = 40, chartW = w - pad*2, chartH = h - pad*2;
      financeCtx.clearRect(0,0,w,h);
      const maxVal = Math.max(totalRevenus, totalDepenses, 1);
      financeCtx.strokeStyle = "rgba(0,0,0,0.08)";
      for (let i=0;i<=4;i++){ const y = pad + (chartH*i)/4; financeCtx.beginPath(); financeCtx.moveTo(pad,y); financeCtx.lineTo(pad+chartW,y); financeCtx.stroke(); }
      const barWidth = Math.min(120, chartW/3), x1 = pad + chartW/4 - barWidth/2, x2 = pad + (chartW*3)/4 - barWidth/2;
      const themeIsLight = document.body.classList.contains("light-theme");
      const revColor = themeIsLight ? "#1b7a3a" : "#8ef08e";
      const depColor = themeIsLight ? "#b71c1c" : "#ff8a8a";
      const revH = (totalRevenus/maxVal)*chartH, depH = (totalDepenses/maxVal)*chartH;
      financeCtx.fillStyle = revColor; financeCtx.fillRect(x1, pad + (chartH - revH), barWidth, revH);
      financeCtx.fillStyle = depColor; financeCtx.fillRect(x2, pad + (chartH - depH), barWidth, depH);
      financeCtx.fillStyle = themeIsLight ? "#111" : "#fff"; financeCtx.font = "14px sans-serif";
      const dict = TRANSLATIONS[settings.lang] || TRANSLATIONS.fr;
      financeCtx.fillText(dict.totalRevenusLabel || "Revenus", x1, pad + chartH + 20);
      financeCtx.fillText(dict.totalDepensesLabel || "Dépenses", x2, pad + chartH + 20);
      financeCtx.font = "bold 13px sans-serif";
      financeCtx.fillText(formatNumber(totalRevenus, settings.lang), x1, pad + (chartH - revH) - 8);
      financeCtx.fillText(formatNumber(totalDepenses, settings.lang), x2, pad + (chartH - depH) - 8);
    }
    window.addEventListener("resize", () => { if (settings.view === "graphique") drawChart(); });

    // --- VISUALISATION modal content update ---
    function updateViz(){
      // compute totals from current inputs
      const totals = computeTotals();
      // For now (no transactions history), we show the totals as representative for the selected period.
      const vizTR = document.getElementById("vizTotalRevenus");
      const vizTD = document.getElementById("vizTotalDepenses");
      const vizSol = document.getElementById("vizSolde");
      if (vizTR) vizTR.innerText = formatNumber(totals.totalRevenus, settings.lang);
      if (vizTD) vizTD.innerText = formatNumber(totals.totalDepenses, settings.lang);
      if (vizSol) vizSol.innerText = formatNumber(totals.solde, settings.lang);

      // If chart preview is visible, draw a small bar chart in the vizChart canvas
      const vizChartEl = document.getElementById("vizChart");
      if (vizChartEl && currentVizMode === "graphique") {
        const ctx = vizChartEl.getContext("2d");
        ctx.clearRect(0,0,vizChartEl.width, vizChartEl.height);
        const w = vizChartEl.width, h = vizChartEl.height, pad = 30;
        const chartW = w - pad*2, chartH = h - pad*2;
        const maxVal = Math.max(totals.totalRevenus, totals.totalDepenses, 1);
        const barW = Math.min(80, chartW/3);
        const x1 = pad + chartW/3 - barW/2, x2 = pad + (chartW*2)/3 - barW/2;
        ctx.fillStyle = "#8ef08e";
        ctx.fillRect(x1, pad + (chartH - (totals.totalRevenus/maxVal)*chartH), barW, (totals.totalRevenus/maxVal)*chartH);
        ctx.fillStyle = "#ff8a8a";
        ctx.fillRect(x2, pad + (chartH - (totals.totalDepenses/maxVal)*chartH), barW, (totals.totalDepenses/maxVal)*chartH);
        ctx.fillStyle = "#111"; ctx.font = "12px sans-serif";
        ctx.fillText(formatNumber(totals.totalRevenus, settings.lang), x1, pad + (chartH - (totals.totalRevenus/maxVal)*chartH) - 8);
        ctx.fillText(formatNumber(totals.totalDepenses, settings.lang), x2, pad + (chartH - (totals.totalDepenses/maxVal)*chartH) - 8);
      }
    }

    // refresh viz button
    const refreshViz = document.getElementById("refreshViz");
    if (refreshViz) refreshViz.addEventListener("click", updateViz);

    // initial update
    updateViz();

    // when modal viz mode changes via select (period) - currently not used to change totals (no history),
    // but the UI is ready for future extension where you'll keep transaction history and filter by date.
    const periodSelect = document.getElementById("periodSelect");
    if (periodSelect) periodSelect.addEventListener("change", () => {
      // placeholder: could filter history here
      updateViz();
    });

    // If user toggles between tableau/graphique we update immediately
    document.querySelectorAll(".viz-btn").forEach(b => b.addEventListener("click", () => updateViz()));

    // ensure initial style for navbar title & logo (fix visibility)
    const siteTitle = document.querySelector(".site-title");
    if (siteTitle) {
      siteTitle.style.color = (settings.theme === "light") ? "#111" : "#fff";
      // ensure logo visible
      const navLogo = document.querySelector(".nav-logo");
      if (navLogo) navLogo.style.zIndex = 120;
    }
  } // end dashboard
}); // end DOMContentLoaded
