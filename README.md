# weather-wise
NASA-Powered Weather Decision Intelligence <br />
Agriculture • Outdoor Events • Construction • Sports • Tourism
# How to run the app Locally
Copy this repository into your local device.
Create a file named ".env" into the main folder.
Write the following and save it:
```bash
MY_APP_USERNAME=actual_user_name #In the groupchat
MY_APP_PASSWORD=password #In the groupchat
```
## ⚙️ Prerequisites

Make sure you have the following installed:

- [Python 3.8+](https://www.python.org/downloads/)
- [Node.js + npm](https://nodejs.org/)

---
**BACKEND**
1. Your path should look like: **C:\Users\Desktop\WeatherWise\backend>**
2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate      # On macOS/Linux
venv\Scripts\activate         # On Windows
```
3. Install dependencies:
```bash
pip install -r requirements.txt
```
4. Run the flask server:
```bash
flask run
```
By default, the server will run at: http://localhost:5000
<br />
⚠️ Make sure FLASK_APP=app.py is set. You can set it with:
```bash
export FLASK_APP=app.py       # macOS/Linux
set FLASK_APP=app.py          # Windows
```

---
**FRONTEND**
1. Open a new command prompt KEEP the backend terminal running. Navigate to the frontend folder. Your path should look like **C:\Users\Desktop\WeatherWise\frontend>**
2. Install React Dependencies
```bash
npm install
```
3. Start the React Develpoment Server
```bash
npm run dev
```
This will open your app in the browser at: http://localhost:3000
