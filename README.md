🚀 WipeX Prototype

This project has two parts: frontend (React) and backend (Flask/Python).
Follow the setup instructions below to get started.

wipex_prototype/
│── backend/        # Flask API
│   ├── app.py
│   ├── requirements.txt
│   └── venv/ (ignored in git)
│
│── frontend/       # React app
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── node_modules/ (ignored in git)


⚡ Frontend (React)
cd frontend
npm install
npm start

Build for Production
npm run build

⚡ Backend (Flask API)
cd backend
python -m venv venv
.\venv\Scripts\activate   # (Windows)
pip install -r requirements.txt
python app.py


If you add or update dependencies:
pip freeze > requirements.txt

🛠 Environment Notes:

Frontend dependencies are stored in package.json.
Backend dependencies are stored in requirements.txt.
Do not commit node_modules/ or venv/.


👩‍💻 Development Workflow

1. Clone the repo
2. Set up frontend and backend separately
3. Start backend (python app.py)
4. Start frontend (npm start)
5. Access app at http://localhost:3000
