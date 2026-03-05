# DevHire -- Real-Time Technical Interview Platform

DevHire is a full-stack web application designed to conduct structured,
real-time technical interviews with integrated video communication and
collaborative coding. The platform enables seamless interaction between
interviewers and candidates through secure scheduling, authentication,
and low-latency real-time collaboration.

------------------------------------------------------------------------

## 🚀 Project Overview

DevHire provides a unified environment for conducting live coding
interviews by combining:

-   Secure authentication & role-based access
-   Interview scheduling & management
-   Integrated video calling
-   Real-time collaborative code editor

The system is designed using production-grade architecture principles
with clear separation between REST APIs, real-time communication, and
database layers.

------------------------------------------------------------------------

## 🏗️ System Architecture

The application follows a client-server architecture with a dedicated
real-time communication layer.

### Frontend

-   React
-   TailwindCSS
-   Monaco Editor
-   Socket.IO Client
-   Stream Video SDK

### Backend

-   Node.js
-   Express.js
-   JWT Authentication
-   Socket.IO Server (WebSockets)

### Database

-   PostgreSQL (Supabase)
-   Supabase Transaction Pooler for connection management

### Deployment

-   Frontend: Vercel
-   Backend: Render
-   Database: Supabase

------------------------------------------------------------------------

## 🔧 Tech Stack

-   React
-   Node.js
-   Express.js
-   PostgreSQL
-   Supabase
-   Socket.IO (WebSockets)
-   Stream Video API
-   Monaco Editor
-   TailwindCSS
-   JWT Authentication
-   Bcrypt

------------------------------------------------------------------------

## 🔑 Core Features

### 🔐 Authentication & Authorization

-   JWT-based authentication
-   Secure password hashing
-   Role-based access (Interviewer / Candidate)

### 📅 Interview Scheduling

-   Create and manage interviews
-   Join interviews using secure room IDs
-   Controlled access per user role

### 🎥 Live Video Communication

-   Integrated real-time video using Stream API
-   WebRTC-based low-latency communication

### 💻 Real-Time Collaborative Coding

-   Monaco Editor integration
-   Live code synchronization via WebSockets
-   Language switching
-   Typing indicators
-   Room-based event broadcasting

------------------------------------------------------------------------

## 🔄 Real-Time Workflow

1.  Users join an interview room via `interviewId`
2.  Socket.IO establishes a persistent connection
3.  Code updates are emitted via `editor-change`
4.  Updates are broadcast to all users in the same room
5.  Language changes and typing indicators are synchronized in real time

This ensures low-latency, bidirectional communication between
participants.

------------------------------------------------------------------------

## 🗃️ Database Schema (Core Entities)

### User

-   id
-   email
-   passwordHash
-   role

### Interview

-   id
-   interviewerId
-   candidateId
-   scheduledAt
-   status

------------------------------------------------------------------------

## 🛠️ Local Setup

### 1️⃣ Clone Repository

``` bash
https://github.com/Aryan-web-tech/DevHire-Interview-Platform.git
cd DevHire-Interview-Platform
```

### 2️⃣ Backend Setup

``` bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

    PORT=8000
    DATABASE_URL=your_supabase_pooler_connection_string
    JWT_SECRET=your_secret_key
    FRONTEND_URL=http://localhost:3000

Run backend:

``` bash
npm start
```

### 3️⃣ Frontend Setup

``` bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

    REACT_APP_BASE_URL=http://localhost:8000
    REACT_APP_STREAM_API_KEY=your_stream_api_key

Run frontend:

``` bash
npm start
```

------------------------------------------------------------------------

## 🌍 Production Deployment

-   Frontend deployed on Vercel
-   Backend deployed on Render
-   Database hosted on Supabase
-   Supabase Transaction Pooler used to prevent connection exhaustion
-   Environment variables configured separately for production
-   Website URL = https://dev-hire-interview-platform.vercel.app/
