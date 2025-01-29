# Project Setup

This project consists of three main services:
- **PostgreSQL** (Database)
- **Backend** (Node.js + Express)
- **Frontend** (React.js)

## Prerequisites

Ensure you have the following installed on your system:
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

## Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Environment Configuration

Create a `.env` file in both **backend** and **frontend** directories.

#### Backend `.env`:
```env
PORT=5000
DB_HOST=postgres
DB_PORT=5432
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
FRONTEND_URL=http://localhost:3000
```

#### Frontend `.env`:
```env
REACT_APP_BACKEND_URL=http://backend:5000
```

---

### 3. Run the Application using Docker Compose

Start the containers:
```bash
docker-compose up --build
```

Stop the containers:
```bash
docker-compose down
```

---

## Project Structure
```
/project-root
│── backend
│   ├── src
│   ├── .env
│   ├── Dockerfile
│   └── package.json
│
│── frontend
│   ├── src
│   ├── .env
│   ├── Dockerfile
│   └── package.json
│
│── docker-compose.yml
└── README.md
```

---

## API Endpoints

### 1. Health Check
- **Endpoint:** `GET /api/health`
- **Response:** `{ "status": "ok" }`

### 2. Example API Call in Frontend
Update your React component:
```javascript
const API_URL = process.env.REACT_APP_BACKEND_URL;
fetch(`${API_URL}/api/health`)
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((err) => console.error("API error:", err));
```

---

## Debugging Common Issues

### 1. Backend Not Connecting to PostgreSQL
- Ensure database credentials are correct.
- Run `docker logs backend-container` to check logs.

### 2. Frontend Fails to Connect to Backend
- Ensure API URL is correctly set in `frontend/.env`.
- Open the browser's **Developer Console > Network Tab** and check for CORS errors.

### 3. CORS Issues
If the frontend can't call the backend due to CORS, ensure your backend has this configuration:
```javascript
const cors = require("cors");
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
```

---

## Useful Commands

### Rebuild and Restart Containers
```bash
docker-compose down && docker-compose up --build
```

### View Logs
```bash
docker logs backend-container
```

### Open a Shell in a Container
```bash
docker exec -it backend-container sh
```

---

## License
This project is open-source. Feel free to modify and distribute it.

