# Clinic Management System - Backend

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend folder (optional - defaults will be used if not created):
```
MONGO_URI=mongodb://localhost:27017/clinic-management-system
PORT=5000
```

Note: The default database name is `clinic-management-system` if MONGO_URI is not set.

3. Make sure MongoDB is running on your system

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### User Operations (CRUD)
- `GET /api/user/all-user` - Get all users
- `GET /api/user/get-user/:reqID` - Get single user by ID
- `PUT /api/user/update-user/:reqID4Update` - Update user by ID
- `DELETE /api/user/delete-user/:reqID4Delete` - Delete user by ID

## Database Schema

User model includes:
- ownerName (for clinicAdmin)
- clinicName (for clinicAdmin)
- name (for patient)
- email (required, unique)
- password (required, hashed)
- role (clinicAdmin or patient)
- phone
- address

