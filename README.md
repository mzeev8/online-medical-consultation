# 🏥 Online Medical Consultation Platform

A full-stack online medical consultation platform that enables patients and doctors to connect through real-time video consultations, appointment scheduling, and secure authentication.

This project was built as a **team project (5 members)** during a **Web Development Hackathon** conducted by our department.

---

## ✨ Features

- Secure authentication using Email/Password & Google
- Doctor and Patient onboarding workflows
- Appointment booking, cancellation, and status tracking
- Real-time video consultations
- Real-time communication using Socket.IO
- Role-based dashboards for Doctors and Patients

---

## 🛠 Tech Stack

### Frontend
- React (Next.js)
- Tailwind CSS
- Firebase Authentication
- Socket.IO (Client)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Firebase Admin SDK
- Socket.IO

---

## 📁 Project Structure

```text
online-medical-consultation/
│
├── client/                     # Frontend (Next.js)
│   ├── public/
│   └── src/
│       ├── app/                # Routing & pages
│       │   ├── appointment/
│       │   ├── auth/
│       │   ├── consultation/
│       │   ├── doctor/
│       │   ├── onboarding/
│       │   └── patient/
│       │
│       ├── components/         # Reusable UI components
│       │   ├── forms/
│       │   └── ui/
│       │
│       ├── context/            # React contexts
│       ├── hooks/              # Custom hooks
│       ├── lib/                # Utilities & Firebase setup
│       │   └── socket/
│       └── utils/              # Helper functions
│
└── server/                     # Backend (Express.js)
    └── src/
        ├── lib/                # Firebase Admin setup
        ├── middleware/         # Authentication middleware
        ├── models/             # Database models
        ├── routes/             # API routes
        └── socket/             # Real-time communication
````

---

## ⚙️ Environment Variables

### Client (`/client/.env`)

```env
NEXT_PUBLIC_API_KEY=
NEXT_PUBLIC_AUTH_DOMAIN=
NEXT_PUBLIC_PROJECT_ID=
NEXT_PUBLIC_STORAGE_BUCKET=
NEXT_PUBLIC_MESSAGING_SENDER_ID=
NEXT_PUBLIC_APP_ID=
NEXT_PUBLIC_MEASUREMENT_ID=

NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Server (`/server/.env`)

```env
FRONTEND_URL=http://localhost:3000
PORT=5000
MONGO_URI=
```

---

## 🔥 Firebase Setup

1. Create a Firebase project from the Firebase Console
2. Enable Authentication (Email/Password & Google)
3. Register a Web App and copy config values to the client `.env`
4. Go to **Project Settings → Service Accounts**
5. Generate a new private key and save it as:
```text
/server/serviceAccountKey.json
```

---

## ▶️ Running the Project Locally

### Start the Client

```bash
cd client
npm install
npm run dev
```

### Start the Server

```bash
cd server
npm install
npm run dev
```

* Frontend: `http://localhost:3000`
* Backend: `http://localhost:5000`
