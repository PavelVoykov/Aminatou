function updateSensorData() {
    fetch('/get_sensor_data')
        .then(response => response.json())
        .then(data => {
            document.getElementById('temperature').textContent = data.temperature;
            document.getElementById('humidity').textContent = data.humidity;
        });
}

async function updateLampState(isOn) {
    const bridgeIp = '217.105.38.174:8080';
    const username = 'JSElU8MvwfUi76c1RhKArNlfEbp89Fa8bUp0b95A';
    const lightId = '1';

    const resp = await fetch(`${bridgeIp}/turnon`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            on: isOn
        })
    })
    const resData = await resp.json()
    return resData;
  //  .then(response => response.json())
    //.then(data => {
     //   console.log(`Lamp turned ${isOn ? 'on' : 'off'}`, data);
       // const lampStateElement = document.getElementById('lamp-state');
       // if (lampStateElement) {
        //    lampStateElement.textContent = isOn ? 'On' : 'Off';
      //  }
    //})
   // .catch(error => {
    //    console.error('Error updating lamp state:', error);
  //  });
}

function updateBrightness(brightness) {
    const bridgeIp = '192.168.0.105';
    const username = 'JSElU8MvwfUi76c1RhKArNlfEbp89Fa8bUp0b95A';
    const lightId = '1';

    const hueBrightness = Math.round((brightness / 100) * 254);

    fetch(`https://${bridgeIp}/api/${username}/lights/${lightId}/state`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            on: true,
            bri: hueBrightness
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(`Brightness set to ${brightness}%`, data);
        const brightnessElement = document.getElementById('brightness-value');
        if (brightnessElement) {
            brightnessElement.textContent = `${brightness}%`;
        }
    })
    .catch(error => {
        console.error('Error updating brightness:', error);
    });
}

function updateColor(color) {
    const bridgeIp = '192.168.0.105';
    const username = 'JSElU8MvwfUi76c1RhKArNlfEbp89Fa8bUp0b95A';
    const lightId = '1';
     fetch(`https://${bridgeIp}/api/${username}/lights/${lightId}/state`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            on: true,
            sat: 254,
            bri: 254,
            hue: color
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(`Color set to ${color}`, data);
    })
    .catch(error => {
        console.error('Error updating color:', error);
    });
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
