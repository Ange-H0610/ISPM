// ==========================
// auth.js (Login & Signup)
// ==========================

function showError(message){
  alert(message);
}

function isEmailValid(email){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

document.addEventListener("DOMContentLoaded", ()=>{

  /* ================= SIGNUP ================= */
  const signupForm = document.getElementById("signupForm");

  if(signupForm){
    signupForm.addEventListener("submit", e=>{
      e.preventDefault();

      const name = document.getElementById("signupName").value.trim();
      const email = document.getElementById("signupEmail").value.trim();
      const password = document.getElementById("signupPass").value;

      if(!name || !email || !password){
        return showError("Veuillez remplir tous les champs.");
      }

      if(!isEmailValid(email)){
        return showError("Adresse email invalide.");
      }

      const user = {
        name,
        email,
        password,
        isLoggedIn: false
      };

      localStorage.setItem("mybudget_user", JSON.stringify(user));
      alert("✅ Inscription réussie !");
      window.location.href = "login.html";
    });
  }

  /* ================= LOGIN ================= */
  const loginForm = document.getElementById("loginForm");

  if(loginForm){
    const savedUser = JSON.parse(localStorage.getItem("mybudget_user"));

    loginForm.addEventListener("submit", e=>{
      e.preventDefault();

      const name = document.getElementById("loginName").value.trim();
      const password = document.getElementById("loginPass").value;

      if(!name || !password){
        return showError("Veuillez entrer votre nom et mot de passe.");
      }

      if(!savedUser){
        return showError("Aucun compte trouvé. Veuillez vous inscrire.");
      }

      if(savedUser.name === name && savedUser.password === password){
        savedUser.isLoggedIn = true;
        localStorage.setItem("mybudget_user", JSON.stringify(savedUser));
        window.location.href = "dashboard.html";
      }else{
        showError("Nom ou mot de passe incorrect.");
      }
    });
  }

});
