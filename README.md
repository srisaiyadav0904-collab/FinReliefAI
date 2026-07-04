# 💳 FinRelief AI

<div align="center">

### AI-Powered Debt Relief & Financial Recovery Platform

Built with **React**, **FastAPI**, **SQLite**, and **Google Gemini AI**

![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?logo=sqlite)
![Gemini AI](https://img.shields.io/badge/Google-Gemini_AI-4285F4?logo=google)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

# 📖 Overview

**FinRelief AI** is a full-stack AI-powered financial assistance platform designed to help users manage their loans, evaluate financial health, estimate debt settlement opportunities, and generate professional negotiation letters using **Google Gemini AI**.

The application combines financial analytics with Generative AI to provide users with intelligent recommendations for debt management through a modern and user-friendly web interface.

---

# ✨ Features

## 🔐 Authentication

- User Registration
- Secure User Login
- JWT Authentication
- Password Hashing using bcrypt
- Protected API Endpoints

---

## 💼 Loan Management

- Add New Loans
- View Loan Portfolio
- Update Loan Details
- Delete Loans
- SQLite Database Storage

---

## 📊 Financial Analysis

Analyze your financial condition using:

- Monthly Income
- Monthly Expenses
- Monthly EMI
- Outstanding Balance

Automatically calculates:

- Debt-to-Income Ratio (DTI)
- Monthly Savings
- Financial Health Score
- Risk Level

---

## 📈 Settlement Prediction

Predict possible debt settlements using:

- Financial Health Score
- Outstanding Balance

Returns:

- Settlement Percentage
- Estimated Settlement Amount
- Settlement Recommendation

---

## 🤖 AI Negotiation Assistant

Powered by **Google Gemini AI**

Generates:

- Personalized Negotiation Strategy
- Settlement Recommendation
- Professional Debt Negotiation Letter

Additional Features:

- Copy Letter
- Download Letter (.txt)

---

## 🎨 Responsive Dashboard

- Modern Dark Theme
- Responsive Layout
- Interactive Dashboard
- Real-time API Communication
- User-friendly Forms

---

# 🛠 Tech Stack

| Layer | Technology |
|--------|------------|
| Frontend | React, Vite, Axios |
| Backend | FastAPI |
| Database | SQLite |
| ORM | SQLAlchemy |
| Validation | Pydantic |
| Authentication | JWT, bcrypt |
| AI | Google Gemini API |
| Language | Python, JavaScript |
| Version Control | Git & GitHub |

---

# 🏗 Project Architecture

```text
                React + Vite Frontend
                        │
                 Axios HTTP Requests
                        │
                FastAPI REST Backend
                        │
     ┌──────────┬──────────┬────────────┬────────────┐
     │          │          │            │            │
 Authentication Loans  Financial  Settlement   Gemini AI
                        Analysis   Prediction
     │
SQLite Database
```

---

# 📂 Project Structure

```text
FinReliefAI
│
├── backend
│   ├── app
│   │   ├── ai.py
│   │   ├── auth.py
│   │   ├── database.py
│   │   ├── financial.py
│   │   ├── loans.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── utils.py
│   │
│   ├── requirements.txt
│   ├── .env.example
│   └── ...
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── .gitignore
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/srisaiyadav0904-collab/FinReliefAI.git

cd FinReliefAI
```

---

## Backend Setup

Create Virtual Environment

```bash
python -m venv .venv
```

Activate Environment

Windows

```bash
.venv\Scripts\activate
```

Install Dependencies

```bash
pip install -r backend/requirements.txt
```

Run Backend

```bash
cd backend

uvicorn app.main:app --reload
```

Backend URL

```
http://127.0.0.1:8000
```

Swagger API

```
http://127.0.0.1:8000/docs
```

---

## Frontend Setup

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

# 🔑 Environment Variables

Create a `.env` file inside the **backend** directory.

```env
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
GEMINI_API_KEY=your_gemini_api_key
```

> **Note:** Never upload your `.env` file. Use `.env.example` as a template.

---

# 📡 REST API Endpoints

| Method | Endpoint | Description |
|----------|----------------------------|-----------------------------|
| POST | `/register` | Register User |
| POST | `/login` | User Login |
| GET | `/loans` | Get All Loans |
| POST | `/loans` | Create Loan |
| PUT | `/loans/{id}` | Update Loan |
| DELETE | `/loans/{id}` | Delete Loan |
| POST | `/financial-analysis` | Financial Analysis |
| POST | `/settlement-prediction` | Settlement Prediction |
| POST | `/ai-negotiation` | AI Negotiation |

---

# 🤖 Google Gemini AI Integration

Google Gemini AI analyzes the user's financial information and generates:

- Personalized Negotiation Strategy
- Settlement Recommendation
- Professional Negotiation Letter

If the Gemini API is unavailable, the application automatically returns a fallback response to ensure uninterrupted user experience.

---

# 🔒 Security Features

- JWT Authentication
- Password Hashing (bcrypt)
- Protected API Routes
- Environment Variable Configuration
- Secure Credential Storage

---

# 🗄 Database

The application uses **SQLite** with **SQLAlchemy ORM**.

Database stores:

- User Information
- Loan Details
- Authentication Data

---

# 🚀 Future Enhancements

- Email Verification
- Password Reset
- PostgreSQL Support
- PDF Report Generation
- Financial Charts & Analytics
- Loan Payment Tracking
- Multi-language Support
- Docker Deployment
- Cloud Hosting

---

⭐ Team Lead
──────────────────────────────
👤 Challa Srisai

Project Lead

• Project Architecture
• AI Integration
• Backend Development
• Team Coordination
• Deployment

──────────────────────────────

👤 Anand Kumar        Frontend Developer
👤 Annem Manoj Kumar Backend Developer
👤 Rithesh Pennaperuru Testing & Documentation
👤 Vishnu Vardhan Dandu UI Support
# 📄 License

This project is licensed under the **MIT License**.

---

# 🙏 Acknowledgements

- FastAPI
- React
- Vite
- SQLite
- SQLAlchemy
- Google Gemini AI

---

<div align="center">

### ⭐ If you found this project useful, consider giving it a star!

**Made with ❤️ using FastAPI, React & Google Gemini AI**

</div>