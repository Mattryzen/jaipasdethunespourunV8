let previousPosition = null;
let previousTimestamp = null;

function calculateSpeed(position) {
    const currentTimestamp = position.timestamp;
    const currentPosition = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    };

    if (previousPosition && previousTimestamp) {
        const distance = calculateDistance(previousPosition, currentPosition);
        const timeElapsed = (currentTimestamp - previousTimestamp) / 1000; // en secondes
        const speed = (distance / timeElapsed) * 3.6; // Conversion en km/h

        return speed;
    }

    // Mise à jour de la position et du timestamp précédents
    previousPosition = currentPosition;
    previousTimestamp = currentTimestamp;

    return 0; // Si c'est la première mesure
}

function calculateDistance(pos1, pos2) {
    const R = 6371e3; // Rayon de la Terre en mètres
    const φ1 = pos1.latitude * (Math.PI / 180);
    const φ2 = pos2.latitude * (Math.PI / 180);
    const Δφ = (pos2.latitude - pos1.latitude) * (Math.PI / 180);
    const Δλ = (pos2.longitude - pos1.longitude) * (Math.PI / 180);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // en mètres
    return distance;
}

function updateSpeed() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            (position) => {
                const speed = calculateSpeed(position);
                document.getElementById('speed').textContent = speed.toFixed(2) + ' km/h';
            },
            (error) => {
                console.error('Erreur lors de la récupération de la position : ', error);
                document.getElementById('speed').textContent = "Impossible de récupérer la vitesse";
            },
            {
                enableHighAccuracy: true,
                maximumAge: 1000,
                timeout: 5000
            }
        );
    } else {
        document.getElementById('speed').textContent = "La géolocalisation n'est pas supportée";
    }
}

// Lancer l'actualisation de la vitesse au chargement de la page
updateSpeed();
