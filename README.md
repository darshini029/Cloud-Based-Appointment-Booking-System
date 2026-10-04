# Cloud-Based Appointment Booking System

A simple college-level appointment booking website built with HTML, CSS, JavaScript, Node.js, Express and MongoDB.

## Features
- User registration and login
- Appointment booking
- Service and time selection
- Appointment history
- Cancel appointments
- Appointment status
- MongoDB cloud database
- Responsive light-blue interface

## Run locally

1. Install Node.js.
2. Open this project folder in VS Code.
3. Open Terminal.
4. Run:

```bash
npm install
```

5. Rename `.env.example` to `.env`.
6. Add your MongoDB Atlas connection string:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=3000
```

7. Start:

```bash
npm start
```

8. Open `http://localhost:3000`

## GitHub + Render

Upload the project files to GitHub.

On Render, create a new Web Service and connect the GitHub repository.

Build Command:
`npm install`

Start Command:
`npm start`

Add these environment variables in Render:
- `MONGODB_URI`
- `JWT_SECRET`

## Project Title

**Cloud-Based Appointment Booking System**

This project is intended as a simple academic demonstration and can be extended later with email/SMS notifications, payments, calendar integration and separate staff dashboards.
