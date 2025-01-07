function updateSensorData() {
    fetch('/get_sensor_data')
        .then(response => response.json())
        .then(data => {
            document.getElementById('temperature').textContent = data.temperature;
            document.getElementById('humidity').textContent = data.humidity;
        });
}

function updateLampState(isOn) {
    const lampStateElement = document.getElementById('lamp-state');
    lampStateElement.textContent = isOn ? 'On' : 'Off';
    // Here you would send the lamp state to your backend/ESP32
    console.log(`Lamp turned ${isOn ? 'on' : 'off'}`);
}

function updateBrightness(brightness) {
    document.getElementById('brightness-value').textContent = `${brightness}%`;
    // Here you would send the brightness value to your backend/ESP32
    console.log(`Brightness set to ${brightness}%`);
}

function updateColor(color) {
    // Here you would send the color value to your backend/ESP32
    console.log(`Color set to ${color}`);
}

function setPreferredTemp(temp) {
    // Here you would send the preferred temperature to your backend/ESP32
    console.log(`Preferred temperature set to ${temp}°C`);
}

window.addEventListener('load', function() {
    const lampState = localStorage.getItem('lampState') === 'true';
    const brightness = localStorage.getItem('brightness') || 50;
    const color = localStorage.getItem('color') || '#ffffff';
    const preferredTemp = localStorage.getItem('preferredTemp') || 22;

    document.getElementById('lamp-switch').checked = lampState;
    document.getElementById('brightness').value = brightness;
    document.getElementById('color').value = color;
    document.getElementById('preferred-temp').value = preferredTemp;

    updateLampState(lampState);
    updateBrightness(brightness);
    updateColor(color);
    setPreferredTemp(preferredTemp);
});

setInterval(updateSensorData, 5000);  // Update every 5 seconds

document.getElementById('set-temp').addEventListener('click', function() {
    const preferredTemp = document.getElementById('preferred-temp').value;
    localStorage.setItem('preferredTemp', preferredTemp);
    setPreferredTemp(preferredTemp);
});

document.getElementById('lamp-switch').addEventListener('change', function() {
    const isOn = this.checked;
    localStorage.setItem('lampState', isOn);
    updateLampState(isOn);
});

document.getElementById('brightness').addEventListener('input', function() {
    const brightness = this.value;
    localStorage.setItem('brightness', brightness);
    updateBrightness(brightness);
});

document.getElementById('color').addEventListener('input', function() {
    const color = this.value;
    localStorage.setItem('color', color);
    updateColor(color);
});