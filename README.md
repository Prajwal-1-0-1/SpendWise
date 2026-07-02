# SpendWise

An AI-powered full stack expense tracker that extracts receipt data using Google Gemini and helps users organize and visualize their spending.

## Features

- JWT Authentication
- Expense CRUD (Create, Read, Update, Delete)
- AI-powered receipt parsing using Google Gemini
- Dashboard with expense analytics and charts
- Receipt image upload
- Search, filter, and sort expenses
- Responsive user interface

## Tech Stack

### Backend
- FastAPI
- PostgreSQL
- SQLAlchemy
- JWT Authentication
- Google Gemini API

### Frontend
- React (Vite)
- Tailwind CSS
- React Router
- Axios
- Recharts

## Project Structure

```text
smart-expense-tracker/
├── Backend/
├── Frontend/
└── README.md
```

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/<your-github-username>/SpendWise.git
cd SpendWise
```

---

### Backend Setup

Navigate to the backend directory.

```bash
cd Backend
```

Create and activate a virtual environment.

**Windows**

```bash
python -m venv .venv
.venv\Scripts\activate
```

**Linux/macOS**

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install the required dependencies.

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the `Backend` directory.

```env
GEMINI_API_KEY=your_gemini_api_key
```

Configure your PostgreSQL database by updating the database connection settings.

Run the backend server.

```bash
uvicorn app.main:app --reload
```

The backend will be available at:

```
http://127.0.0.1:8000
```

---

### Frontend Setup

Open a new terminal and navigate to the frontend directory.

```bash
cd Frontend
```

Install the dependencies.

```bash
npm install
```

Create a `.env` file (or copy `.env.example`).

```env
VITE_API_URL=
```

Leave `VITE_API_URL` empty during development if using the Vite development proxy.

Start the development server.

```bash
npm run dev
```

The frontend will be available at:

```
http://127.0.0.1:5173
```

## Environment Variables

### Backend

Create a `.env` file inside the `Backend` directory.

```env
GEMINI_API_KEY=your_gemini_api_key
```

### Frontend

Create a `.env` file inside the `Frontend` directory.

```env
VITE_API_URL=
```

For local development, leave `VITE_API_URL` empty if using the Vite proxy. For production, set it to the deployed backend URL.

## API Documentation

After starting the backend, FastAPI automatically generates interactive API documentation.

Swagger UI:

```
http://127.0.0.1:8000/docs

```

## Future Improvements

- Docker support
- Budget tracking and spending limits
- Monthly and yearly expense reports
- Cloud storage for receipt images

## Author
Prajwal Y S
