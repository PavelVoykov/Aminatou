from flask import Flask, render_template, request, jsonify
import os
from werkzeug.utils import secure_filename
import random
import requests
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
CORS(app)

# Simulated room data (replace with actual data source)
room_data = {
    "room_number": "101",
    "tenants": ["John Doe", "Jane Smith"],
    "capacity": 2
}

@app.route('/')
def login():
    return render_template('index.html', room_data=room_data)

@app.route('/get_additional_info')
def get_additional_info():
    # In a real application, you'd fetch this from a database
    return jsonify({"info": "Additional info about the tenant."})

@app.route('/access_denied')
def access_denied():
    return render_template('access_denied.html')

@app.route('/smart_room')
def smart_room():
    return render_template('smart_room.html')

@app.route('/useful_links')
def useful_links():
    return render_template('useful_links.html')

@app.route('/file_manager')
def file_manager():
    files = os.listdir(app.config['UPLOAD_FOLDER'])
    return render_template('file_manager.html', files=files)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file:
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return jsonify({"message": "File uploaded successfully"}), 200

@app.route('/get_sensor_data')
def get_sensor_data():
    # Here you would typically make a request to your ESP32
    # For now, we'll return dummy data
    return jsonify({
        "temperature": 22.5,
        "humidity": 45
    })

@app.route('/electricity_stats_update', methods=['GET'])
def electricity_stats_update():
    res = requests.get('http://192.168.0.106/netio.json')
    measurments = res.json()['GlobalMeasure']
    voltage = measurments['Voltage']
    power = measurments['TotalLoad']
    return jsonify({ 
        "voltage" : voltage, 
        "power" : power 
    })

@app.route('/electricity_consumption', methods=['GET'])
def electricity_consumption():
     
     return render_template('electricity_consumption.html')




if __name__ == '__main__':
    app.run(debug=True ,port=5000)
