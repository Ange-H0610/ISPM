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
// Simulation paiement Premium
const premiumForm = document.getElementById("premiumForm");

if (premiumForm) {
    premiumForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Simulation validation paiement
        setTimeout(() => {
            window.location.href = "premium-dashboard.html";
        }, 800);
    });
}

