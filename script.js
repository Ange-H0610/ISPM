// Smooth scroll
const links = document.querySelectorAll('a[href^="#"]');

links.forEach(link => {
    link.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Simulation paiement Premium
const premiumForm = document.getElementById("premiumForm");

if (premiumForm) {
    premiumForm.addEventListener("submit", function (e) {
        e.preventDefault();
        document.getElementById("successMsg").innerText =
            "✅ Paiement enregistré. Mode Premium activé (simulation).";
        premiumForm.reset();
    });
}

