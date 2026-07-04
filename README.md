# 💳 FinRelief AI

<div align="center">

### AI-Powered Debt Relief & Financial Recovery Platform

Built with **React**, **FastAPI**, **SQLite**, and **Google Gemini API**

![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?logo=sqlite)
![Gemini](https://img.shields.io/badge/Google-Gemini_API-4285F4?logo=google)

</div>

---

## 📖 About

**FinRelief AI** is an AI-powered financial assistance platform that helps users manage loans, analyze their financial condition, estimate debt settlement opportunities, and generate professional negotiation letters using **Google Gemini API**.

The application combines a **React** frontend with a **FastAPI** backend and stores data in **SQLite**, providing a simple and secure debt management experience.

---

## ✨ Features

### 🔐 Authentication

- User Registration
- Secure Login
- JWT Authentication
- Password Hashing

### 💼 Loan Management

- Add Loans
- View Loans
- Update Loans
- Delete Loans

### 📊 Financial Analysis

- Debt-to-Income Ratio
- Monthly Savings
- Financial Health Score
- Risk Level

### 📈 Settlement Prediction

- Settlement Percentage
- Estimated Settlement Amount
- Recommendation

### 🤖 AI Negotiation

Using Google Gemini API:

- Negotiation Strategy
- Settlement Recommendation
- Professional Negotiation Letter
- Copy Letter
- Download Letter

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React, Vite, Axios |
| Backend | FastAPI |
| Database | SQLite |
| ORM | SQLAlchemy |
| AI | Google Gemini API |
| Authentication | JWT |
| Language | Python, JavaScript |
| Version Control | Git & GitHub |

---

## 📂 Project Structure

```text
FinReliefAI
│
├── backend
│   ├── app
│   ├── requirements.txt
│   └── .env.example
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── README.md
└── .gitignore
```

---
## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/srisaiyadav0904-collab/FinReliefAI.git

cd FinReliefAI
```

---

## 🔧 Backend Setup

Create a virtual environment:

```bash
python -m venv .venv
```

Activate the environment:

**Windows**

```powershell
.venv\Scripts\activate
```

**Linux / macOS**

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r backend/requirements.txt
```

Run the backend:

```bash
cd backend

uvicorn app.main:app --reload
```

Backend URL

```
http://127.0.0.1:8000
```

API Documentation

```
http://127.0.0.1:8000/docs
```

---

## 💻 Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend URL

```
http://localhost:5173
```

---

## 🔑 Environment Variables

Copy the example environment file.

**Windows**

```powershell
Copy-Item .env.example .env
```

**Linux / macOS**

```bash
cp .env.example .env
```

Update your `.env` file with your own values.

```env
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
GEMINI_API_KEY=your_gemini_api_key
```

> **Note:** Never upload your `.env` file. Use `.env.example` as a template.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/register` | Register User |
| POST | `/login` | User Login |
| GET | `/loans` | Get User Loans |
| POST | `/loans` | Add New Loan |
| PUT | `/loans/{id}` | Update Loan |
| DELETE | `/loans/{id}` | Delete Loan |
| POST | `/financial-analysis` | Analyze Financial Health |
| POST | `/settlement-prediction` | Predict Settlement |
| POST | `/ai-negotiation` | Generate AI Negotiation |

---
## 🤖 AI Integration

FinRelief AI uses **Google Gemini API** to generate intelligent debt negotiation content based on the user's financial details.

The AI module generates:

- Negotiation Strategy
- Settlement Recommendation
- Professional Negotiation Letter

If the Gemini API is unavailable, the application automatically returns a fallback response.

---

## 👥 Team

### ⭐ Team Lead

**Challa Srisai**

**Responsibilities**

- Project Architecture
- Backend Development
- Google Gemini API Integration
- Team Coordination
- Deployment

### 👨‍💻 Team Members

| Member | Role |
|--------|------|
| Annem Manoj Kumar | Backend Developer |
| Rithesh Pennaperuru | Testing & Documentation |
| Vishnu Vardhan Dandu | UI Support |

---

## 🚀 Future Scope

- Email Verification
- Password Reset
- PostgreSQL Support
- PDF Report Generation
- Financial Dashboard
- Docker Deployment
- Cloud Deployment

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

### ⭐ If you found this project useful, consider giving it a star!

Made with ❤️ using **FastAPI**, **React**, and **Google Gemini API**

</div>