let map, routePath;
let routeCoordinates = [];
let watchID;

document.getElementById('start-monitoring-btn').addEventListener('click', function() {
    const phoneNumber = document.getElementById('phone-number').value;
    if (phoneNumber) {
        document.getElementById('phone-number-display').textContent = phoneNumber;
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('route-screen').classList.remove('hidden');
        startMonitoring();
    } else {
        alert('Por favor, insira o número de celular.');
    }
});

document.getElementById('panic-btn').addEventListener('click', function() {
    window.location.href = 'tel:190';
});

document.getElementById('end-monitoring-btn').addEventListener('click', function() {
    stopMonitoring();
    alert('Monitoramento finalizado!');
    document.getElementById('route-screen').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
});

function startMonitoring() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(initMap, showError);
        watchID = navigator.geolocation.watchPosition(updatePosition, showError, {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
        });
    } else {
        alert("Geolocalização não é suportada por este navegador.");
    }
}

function stopMonitoring() {
    if (watchID) {
        navigator.geolocation.clearWatch(watchID);
    }
}

function initMap(position) {
    const { latitude, longitude } = position.coords;
    const initialLocation = { lat: latitude, lng: longitude };
    
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: initialLocation
    });
    
    routePath = new google.maps.Polyline({
        path: routeCoordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 4
    });
    
    routePath.setMap(map);
    updatePosition(position);
}

function updatePosition(position) {
    const { latitude, longitude } = position.coords;
    const newLocation = { lat: latitude, lng: longitude };
    
    routeCoordinates.push(newLocation);
    routePath.setPath(routeCoordinates);
    map.setCenter(newLocation);

    // Aqui você pode enviar a localização atual para um servidor que gerencia o envio de SMS
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("Usuário negou a solicitação de Geolocalização.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Informação de localização não está disponível.");
            break;
        case error.TIMEOUT:
            alert("A solicitação de localização expirou.");
            break;
        case error.UNKNOWN_ERROR:
            alert("Ocorreu um erro desconhecido.");
            break;
    }
}
