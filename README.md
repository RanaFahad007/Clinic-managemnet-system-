🏥 Clinic Management System (MERN Stack)

A full-stack Clinic Management System built using the MERN Stack (MongoDB, Express.js, React.js, Node.js).
This system helps clinics manage patients, doctors, appointments, and medical records efficiently through a clean and user-friendly interface.

🚀 Tech Stack
🔹 Frontend

React.js

Axios

React Router

Bootstrap / Tailwind CSS

Context API / Redux (if used)

🔹 Backend

Node.js

Express.js

MongoDB

Mongoose

JWT Authentication

bcrypt (Password hashing)

📌 Project Overview

The Clinic Management System provides:

Secure user authentication (Admin / Doctor / Receptionist)

Patient registration and management

Doctor management

Appointment booking and tracking

Medical record storage

Dashboard with real-time data

The system is divided into Frontend (Client Side) and Backend (Server Side) with proper separation of concerns.

🎨 Frontend (Client Side)

The frontend is built with React.js and provides a clean, responsive UI.

📁 Frontend Structure
client/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── services/
│   ├── App.js
│   └── index.js
✨ Key Features

🔐 Login / Register pages

📊 Dashboard with statistics

👨‍⚕️ Doctor listing & management

🧑‍🤝‍🧑 Patient registration form

📅 Appointment booking interface

📄 Medical history view

Responsive design (Mobile + Desktop)

🔄 Frontend Responsibilities

Handling UI and user interactions

Sending API requests to backend

Storing JWT token in localStorage

Role-based routing (Protected Routes)

⚙️ Backend (Server Side)

The backend is built using Node.js + Express.js and connects to MongoDB database.

📁 Backend Structure
server/
│
├── config/
├── controllers/
├── models/
├── routes/
├── middleware/
├── server.js
🗂️ Database Models

User Model (Admin / Doctor / Staff)

Patient Model

Doctor Model

Appointment Model

Medical Record Model

🔑 Backend Features

RESTful APIs

JWT Authentication

Password Hashing using bcrypt

CRUD operations (Create, Read, Update, Delete)

Role-based access control

Error handling middleware

Secure API structure

🔌 API Endpoints Example
Auth Routes

POST /api/auth/register

POST /api/auth/login

Patient Routes

GET /api/patients

POST /api/patients

PUT /api/patients/:id

DELETE /api/patients/:id

Appointment Routes

POST /api/appointments

GET /api/appointments

PUT /api/appointments/:id

DELETE /api/appointments/:id

🔐 Authentication & Security

JWT-based authentication

Password hashing using bcrypt

Protected routes using middleware

Role-based access (Admin / Doctor / Staff)

📊 System Roles
👨‍💼 Admin

Manage doctors

Manage staff

View all appointments

View reports

👨‍⚕️ Doctor

View assigned appointments

Update patient records

Add prescriptions

🧑‍💻 Receptionist / Staff

Register patients

Book appointments

Manage patient details
