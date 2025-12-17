// ==========================
//   auth.js (Login & Signup)
// ==========================

// ---------- Helpers ----------
function showError(message) {
  alert(message);
}

function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

document.addEventListener("DOMContentLoaded", function () {
  // --- SIGNUP ---
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

      localStorage.setItem("user", JSON.stringify({ name, email, password }));
      alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
      window.location.href = "login.html";
    });
  }

  // --- LOGIN ---
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
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

      const user = JSON.parse(localStorage.getItem("user") || "null");
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
});
