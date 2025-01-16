from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
import os
from werkzeug.utils import secure_filename
import random
import requests
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = 'your_secret_key'
app.config['UPLOAD_FOLDER'] = 'uploads'
CORS(app)

#This hides the flask output messages unless they are errors!!! Comment if you want to debug!!!!
#import logging
#log = logging.getLogger('werkzeug')
#log.setLevel(logging.ERROR)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

room_data = {
    "room_number": "101",
    "tenants": ["John Doe", "Jane Smith"],
    "capacity": 2
}

users = { 
    'john_doe': {'password': 'Password_1234'},
    'jane_smith': {'password': '1234_Password'}
} 

class User(UserMixin):
    def __init__(self, username):
        self.id = username

@login_manager.user_loader
def load_user(user_id):
    return User(user_id) if user_id in users else None

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()  
        username = data.get('username')  
        password = data.get('password')
        
        user = users.get(username)  
        if user and user['password'] == password:
            user_obj = User(username)
            login_user(user_obj)
            return jsonify({"message": "Login successful"}), 200  
        
        return jsonify({"message": "Invalid credentials"}), 401  

    return render_template('login.html')

@app.route('/')
@login_required
def home_page():
    return render_template('index.html', room_data={"room_number": "101", "tenants": ["John Doe", "Jane Smith"], "capacity": 2})

@app.route('/get_additional_info')
def get_additional_info():
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
    frequency = measurments['Frequency']
    totalEnergy = measurments['TotalEnergy'] 
    return jsonify({
        "voltage" : voltage,
        "power" : power,
	"frequency" : frequency,
	"totalEnergy" : totalEnergy
    })

@app.route('/electricity_consumption', methods=['GET'])
def electricity_consumption():
     
     return render_template('electricity_consumption.html')

@app.route('/turnon', methods=['PUT'])
def turnOn():
	print(request.json)
	res = requests.put("http://192.168.0.100/api/MIi0yX5pCq4oErmVf2pJVsddd71QXCVjTZ55xaQe/lights/1/state", json = request.json)
	print(res.json())
	return res.json()

@app.route('/policy')
def policy():
    return render_template('policy.html')

if __name__ == '__main__':
    app.run(debug=True ,port=5000)
