document.addEventListener('DOMContentLoaded', function() {
    // Simulated data - replace with actual data fetching logic
    function fetchConsumptionData() {
        return {
            currentPower: Math.random() * 1000 + 500,
            todayUsage: Math.random() * 10 + 5,
            historicalData: [
                {date: '2023-01-01', usage: 7.2},
                {date: '2023-01-02', usage: 6.8},
                {date: '2023-01-03', usage: 7.5},
                {date: '2023-01-04', usage: 8.1},
                {date: '2023-01-05', usage: 7.7},
                {date: '2023-01-06', usage: 6.9},
                {date: '2023-01-07', usage: 7.3}
            ]
        };
    }

    async function fetchConsumptionData1() {
        const url = 'http://217.105.38.174:8080/electricity_stats_update'
        //fetch(url)
        //.then(response => response.json())
        //.then(json => {
	const resp = await fetch(url);
	const data = resp.json();
            //console.log('fetch: ', data)
            return data
        //})
    }

    function updateCurrentConsumption1() {
      fetchConsumptionData1()
	.then(data => {
  	   //console.log('data: ', data)
      	   document.getElementById('currentPower').textContent = data['power'];
      	   document.getElementById('todayUsage').textContent = data['voltage'];
	   document.getElementById('frequency').textContent = data['frequency'];
	   document.getElementById('totalEnergy').textContent = data['totalEnergy'];

    	})
    }

    function createConsumptionChart() {
        const data = fetchConsumptionData();
        const ctx = document.getElementById('consumptionChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.historicalData.map(d => d.date),
                datasets: [{
                    label: 'Daily Consumption (kWh)',
                    data: data.historicalData.map(d => d.usage),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function displayEnergyTips() {
        const tips = [
            "Turn off lights when not in use",
            "Use energy-efficient LED bulbs",
            "Unplug devices when not in use to avoid standby power consumption",
            "Use natural light when possible",
            "Adjust thermostat settings to optimize energy use"
        ];
        const tipsList = document.getElementById('energyTips');
        tips.forEach(tip => {
            const li = document.createElement('li');
            li.textContent = tip;
            tipsList.appendChild(li);
        });
    }

    updateCurrentConsumption1();
    createConsumptionChart();
    displayEnergyTips();

    // Update current consumption every 5 seconds
    setInterval(updateCurrentConsumption1, 5000);
});
