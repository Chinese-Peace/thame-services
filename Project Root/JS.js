// Fichier : Project Root/JS.js

// ----------------------------------------------------
// 1. FONCTIONNALITÉ DU DIAPORAMA (SLIDER)
// ----------------------------------------------------

function initSlider() {
    const sliderContainer = document.querySelector('.slider-container');
    if (!sliderContainer) return; // S'assurer que le slider existe sur la page

    const slider = sliderContainer.querySelector('.slider');
    const slides = sliderContainer.querySelectorAll('.slide');
    const prevButton = sliderContainer.querySelector('.prev-button');
    const nextButton = sliderContainer.querySelector('.next-button');
    const dotsContainer = sliderContainer.querySelector('.dots-container');
    
    let currentSlideIndex = 0;
    const totalSlides = slides.length;
    const slideDuration = 10000; // 10 secondes pour le changement automatique

    // Vérification : si moins de 2 slides, désactiver les flèches et l'auto
    if (totalSlides < 2) {
        if (prevButton) prevButton.style.display = 'none';
        if (nextButton) nextButton.style.display = 'none';
        return; 
    }

    // Fonction pour générer les points de navigation (dots)
    function createDots() {
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.setAttribute('data-index', index);
            dotsContainer.appendChild(dot);
            
            // Ajouter un événement pour naviguer en cliquant sur le point
            dot.addEventListener('click', () => {
                showSlide(index);
            });
        });
    }

    // Fonction principale pour afficher une diapositive spécifique
    function showSlide(index) {
        currentSlideIndex = index;
        
        // Gérer le bouclage : si l'index dépasse les limites
        if (currentSlideIndex >= totalSlides) {
            currentSlideIndex = 0;
        } else if (currentSlideIndex < 0) {
            currentSlideIndex = totalSlides - 1;
        }

        // Déplacer la bande d'images (le .slider)
        // La translation est un pourcentage négatif basé sur l'index de la slide
        slider.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

        // Mettre à jour les points actifs
        document.querySelectorAll('.dot').forEach(dot => {
            dot.classList.remove('active');
        });
        document.querySelector(`.dot[data-index="${currentSlideIndex}"]`).classList.add('active');
    }

    // Gestion des boutons Précédent/Suivant
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            showSlide(currentSlideIndex - 1);
            resetAutoSlide(); // Réinitialiser le timer après une action manuelle
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            showSlide(currentSlideIndex + 1);
            resetAutoSlide(); // Réinitialiser le timer après une action manuelle
        });
    }

    // ----------------------------------------------------
    // Changement Automatique (Auto-slide)
    // ----------------------------------------------------
    let slideInterval;

    function startAutoSlide() {
        slideInterval = setInterval(() => {
            showSlide(currentSlideIndex + 1);
        }, slideDuration);
    }

    function stopAutoSlide() {
        clearInterval(slideInterval);
    }

    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    // Initialisation
    createDots(); // Crée les points pour chaque slide
    showSlide(0); // Affiche la première slide
    startAutoSlide(); // Démarre le changement automatique
    
    // Pause de l'auto-slide au survol
    sliderContainer.addEventListener('mouseenter', stopAutoSlide);
    sliderContainer.addEventListener('mouseleave', startAutoSlide);
}


// ----------------------------------------------------
// 2. FONCTIONNALITÉ MULTILINGUE
// ----------------------------------------------------
// (Le code de la fonction loadTranslations que nous avions précédemment)
function loadTranslations(lang) {

    const path = '../Project Root/Langue/lang-' + lang + '.json'; 
    
    // Utilisez ce chemin si vos pages sont TRES imbriquées :
    // const path = '/Project Root/Langue/lang-' + lang + '.json'; // Chemin absolu (déconseillé en local)
    
    return fetch(path)
        .then(response => {
            if (!response.ok) {
                // ... gestion de l'erreur ...
                throw new Error('could not load language file: ' + path);
            }
            return response.json();
        })
        .then(translations => {
            // Appliquer les traductions
            document.querySelectorAll('[data-key]').forEach(element => {
                const key = element.getAttribute('data-key');
                if (translations[key]) {
                    // Utiliser innerHTML pour le copyright (qui contient &copy;)
                    if (key.includes("copyright")) {
                         element.innerHTML = translations[key];
                    } else {
                         element.textContent = translations[key];
                    }
                }
            });

            // Mettre à jour les boutons de langue actifs
            document.querySelectorAll('.lang-button').forEach(button => {
                button.classList.remove('active');
            });
            const activeBtn = document.querySelector(`.lang-button[data-lang="${lang}"]`);
            if (activeBtn) activeBtn.classList.add('active');

            // Stocker la langue dans le navigateur
            localStorage.setItem('preferredLang', lang);
        })
        .catch(error => {
            console.error("Error loading translations:", error);
        });
}


// ----------------------------------------------------
// 3. INITIALISATION GÉNÉRALE
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // A. Initialisation du Multilingue
    const initialLang = localStorage.getItem('preferredLang') || 'eng';
    loadTranslations(initialLang);

    // B. Écouter les clics sur les boutons de langue
    document.querySelectorAll('.lang-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const newLang = event.target.getAttribute('data-lang');
            loadTranslations(newLang);
        });
    });

    // C. Initialisation du Diaporama (NOUVEAU)
    initSlider();
});

// À ajouter à la fin de votre bloc document.addEventListener('DOMContentLoaded', ... )
document.addEventListener('DOMContentLoaded', () => {
    const currentLang = localStorage.getItem('preferredLang') || 'en';
    const btn = document.getElementById('menu-toggle');
    const menu = document.querySelector('.nav-links');

// On attend un tout petit peu que les traductions chargent
    setTimeout(() => {
        const btnToActivate = document.querySelector(`.lang-button[data-lang="${currentLang}"]`);
        if (btnToActivate) {
            btnToActivate.classList.add('active');
            console.log("Bouton activé pour : " + currentLang);
        }
    }, 100);
    
    if(btn && menu) {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Empêche des bugs de clic
            menu.classList.toggle('active');
            btn.textContent = menu.classList.contains('active') ? '✕' : '☰';
        });
    }

});
