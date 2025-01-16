function updateSensorData() {
    fetch('/get_sensor_data')
        .then(response => response.json())
        .then(data => {
            document.getElementById('temperature').textContent = data.temperature;
            document.getElementById('humidity').textContent = data.humidity;
        });
}


async function updateLampState(isOn) {
    const bridgeIp = 'http://192.168.0.105:80';
    const lampStateElement = document.getElementById('lamp-state');
    let lampStatus
    if (lampStateElement) {
        lampStateElement.textContent = isOn ? 'On' : 'Off';
    }
    if (lampStateElement.textContent == "On"){
	lampStatus = true;
	console.log(lampStatus)
    }else{
        lampStatus = false;
	console.log(lampStatus)
    }
    const resp = await fetch(bridgeIp + `/turnon`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "on": lampStatus
        })
    })
    const resData = await resp.json()
    //This should be revisited. The state and the text of the slider button don't change.
    return resData;
}

async function updateBrightness(brightness) {
    const bridgeIp = 'http://192.168.0.105:80';

    const hueBrightness = Math.round((brightness / 100) * 254);
    const brightnessElement = document.getElementById('brightness-value');
    if (brightnessElement) {
            brightnessElement.textContent = `${brightness}%`;
    }
    const resp = await fetch(bridgeIp + `/turnon`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "on": true,
            "bri": hueBrightness
        })
    })
    const resData = await resp.json();
    return resData;
}

async function updateColor(color) {
    const bridgeIp = 'http://192.168.0.105:80';
    console.log(color)
    hslValue = hexToHSL(color)
    const resp = await fetch(bridgeIp + `/turnon`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "on": true,
	    "bri":Math.round(hslValue['l']*254),
	    "hue":Math.round(hslValue['h']*65535),
	    "sat":Math.round(hslValue['s']*254)
        })
    })
    const resData = await resp.json();
    return resData;
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


function hexToHSL(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    r = parseInt(result[1], 16);
    g = parseInt(result[2], 16);
    b = parseInt(result[3], 16);
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if(max == min){
      h = s = 0; // achromatic
    }else{
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max){
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
  var HSL = new Object();
  HSL['h']=h;
  HSL['s']=s;
  HSL['l']=l;
  return HSL;
}
