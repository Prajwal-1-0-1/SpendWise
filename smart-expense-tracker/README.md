# Smart Expense Tracker

A FastAPI backend for tracking expenses with user authentication, receipt upload, and AI-powered receipt parsing.

## Overview

This repository contains a backend service that enables users to:

- register and login with JWT authentication
- upload receipt images
- parse receipt data using Google Gemini
- store expenses in PostgreSQL
- view, retrieve, and delete expenses per user

## Project Structure

```
smart-expense-tracker/
├── Backend/
│   ├── app/
│   │   ├── analytics.py
│   │   ├── auth.py
│   │   ├── auth_routes.py
│   │   ├── crud.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── services/
│   │       ├── gemini_service.py
│   │       └── receipt_ai.py
│   ├── requirements.txt
│   └── uploads/
├── Frontend/
└── README.md
```

## Features

- user registration and login
- JWT bearer token authentication
- receipt image upload
- AI parsing of merchant, amount, category, and purchase date
- PostgreSQL-backed expense storage
- per-user expense retrieval and deletion

## Prerequisites

- Python 3.11+
- PostgreSQL
- pip
- Google Gemini API key

## Setup

1. Open a terminal at the repository root:

```bash
cd smart-expense-tracker\Backend
```

2. Create and activate a virtual environment:

```bash
python -m venv .venv
.venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

## Configuration

### Database

Open `Backend/app/database.py` and update the `DATABASE_URL` with your PostgreSQL credentials.

Example:

```python
DATABASE_URL = "postgresql://postgres:password@localhost/smart_expense"
```

### Gemini API Key

Create a `.env` file in `Backend/` with:

```env
GEMINI_API_KEY=your_gemini_api_key
```

The key is used by `Backend/app/services/gemini_service.py` to parse receipts.

## Run the Application

From `smart-expense-tracker/Backend`:

```bash
uvicorn app.main:app --reload
```

Visit the interactive docs:

```text
http://127.0.0.1:8000/docs
```

## API Endpoints

### Authentication

- `POST /register`
  - Body: `{ "username": "user", "password": "pass" }`
  - Response: `{ "message": "User created" }`

- `POST /login`
  - Form fields: `username`, `password`
  - Response: `{ "access_token": "...", "token_type": "bearer" }`

### Expense Routes (authenticated)

All expense endpoints require the header:

```http
Authorization: Bearer <access_token>
```

- `POST /crud/upload-receipt`
  - Form field: `file`
  - Upload a receipt image and save parsed expense data.

- `GET /crud/get_expenses`
  - Returns all expenses for the authenticated user.

- `GET /crud/get_expense/{id}`
  - Returns a single expense by ID for the authenticated user.

- `DELETE /crud/delete_expenses/{id}`
  - Deletes an expense by ID for the authenticated user.

## Notes

- Uploaded receipts are temporarily saved to `uploads/` and removed after parsing.

## Future Improvements

- build a frontend in `Frontend/`
- containerize with Docker

## Author

Prajwal Y S