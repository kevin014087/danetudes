// Script pour afficher le bouton Clapay une seule fois avec apparition retardée
document.addEventListener('DOMContentLoaded', function() {
    const clapayFloats = document.querySelectorAll('.clapay-float');
    
    // Masquer initialement tous les boutons
    clapayFloats.forEach(button => {
        button.style.display = 'none';
        button.style.opacity = '0';
        button.style.transform = 'scale(0.8)';
    });
    
    // Vérifier si le bouton a déjà été vu
    const hasSeenClapay = localStorage.getItem('danetudes_clapay_seen');
    
    if (!hasSeenClapay) {
        // Afficher le bouton après 5 secondes de navigation
        setTimeout(() => {
            clapayFloats.forEach(button => {
                button.style.display = 'flex';
                button.style.opacity = '0';
                button.style.transform = 'scale(0.8)';
                
                // Animation d'apparition douce
                setTimeout(() => {
                    button.style.transition = 'all 0.5s ease';
                    button.style.opacity = '1';
                    button.style.transform = 'scale(1)';
                }, 100);
                
                // Marquer comme vu au premier clic
                button.addEventListener('click', function() {
                    localStorage.setItem('danetudes_clapay_seen', 'true');
                    
                    // Animation de disparition
                    button.style.transition = 'all 0.3s ease';
                    button.style.opacity = '0';
                    button.style.transform = 'scale(0.5)';
                    
                    setTimeout(() => {
                        button.style.display = 'none';
                    }, 300);
                });
            });
        }, 5000); // 5 secondes avant d'apparaître
    }
});
