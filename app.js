// ---------- Helpers ----------
function showError(message) {
  alert(message);
}

function isEmailValid(email) {
  // Simple validation d'email 
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ---------- Signup page ----------
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPass").value;

    // Validation : tous les champs doivent être remplis
    if (!name || !email || !password) {
      showError("Veuillez remplir le nom, l'email et le mot de passe.");
      return;
    }

    // Validation simple de l'email
    if (!isEmailValid(email)) {
      showError("Veuillez entrer une adresse email valide.");
      return;
    }

    // Crée l'utilisateur et enregistre dans localStorage
    const user = { name, email, password };
    localStorage.setItem("user", JSON.stringify(user));

    alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
    window.location.href = "index.html";
  });
}


// ---------- Login page ----------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  // On peut pré-remplir le nom (pas le mot de passe) si on veut une petite aide
  const savedUser = JSON.parse(localStorage.getItem("user"));
  if (savedUser && savedUser.name) {
    document.getElementById("loginName").value = savedUser.name;
    // on évite de pré-remplir le champ mot de passe pour la sécurité
  }

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("loginName").value.trim();
    const password = document.getElementById("loginPass").value;

    // Validation champs remplis
    if (!name || !password) {
      showError("Veuillez entrer votre nom d'utilisateur et votre mot de passe.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    // Vérifier s'il y a un utilisateur enregistré
    if (!user) {
      showError("Aucun compte trouvé. Veuillez d'abord vous inscrire.");
      return;
    }

    // Vérifier correspondance nom + mot de passe (exigence demandée)
    if (user.name === name && user.password === password) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userName", user.name);
      window.location.href = "dashboard.html";
    } else {
      showError("Nom d'utilisateur ou mot de passe incorrect.");
    }
  });
}


// ---------- Dashboard page (protection et fonctionnalité) ----------
if (window.location.pathname.includes("dashboard.html")) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (!isLoggedIn) {
    // Pas connecté -> redirection vers la page de connexion
    window.location.href = "index.html";
  } else {
    // Afficher le nom de l'utilisateur connecté 
    const userName = localStorage.getItem("userName") || "Utilisateur";
    const greetingEl = document.getElementById("userGreeting");
    if (greetingEl) {
      greetingEl.textContent = `Bonjour, ${userName}`;
    }
  }

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

      if (elRevs) elRevs.innerText = totalRevenus;
      if (elDeps) elDeps.innerText = totalDepenses;
      if (elSolde) elSolde.innerText = solde;
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

  // Theme switcher (si présent)
  const themeSwitcher = document.getElementById("themeSwitcher");
  if (themeSwitcher) {
    themeSwitcher.addEventListener("change", function () {
      // nettoyer puis appliquer la classe sélectionnée
      document.body.classList.remove("gradient-theme", "light-theme", "dark-theme", "blue-theme");
      document.body.classList.add(this.value);
    });
  }
}
