# 🔎 Findrly

### A modern full-stack Lost & Found platform for reporting, discovering, and reclaiming lost items.

**Findrly** is a full-stack web application that helps users report lost or found items, search through listings, connect with item owners, and manage claims through a secure and user-friendly platform.

> 🔍 **Lost something? Findrly helps you find it.**

### 🌐 Live Demo

🚀 **Try Findrly:** https://findrly.vercel.app/

---

## ✨ Features

### 📦 Lost & Found Management

* Report lost items
* Report found items
* Browse available listings
* Search and filter items
* View detailed item information
* Update and manage posted items

### 🔐 Authentication & Security

* User registration and login
* JWT-based authentication
* Protected routes
* Secure user authorization
* Password hashing

### 🖼️ Image Uploads

* Upload images for lost and found items
* Display item images in listings
* Improve item identification with visual information

### 🤝 Claim Management

* Submit claims for found items
* Verify ownership information
* Manage claim requests
* Track claim status

### 💬 Real-Time Communication

* Real-time chat functionality
* Communication between users
* Socket.IO-based messaging

### 🔎 Search & Discovery

* Search items using keywords
* Filter lost and found listings
* Quickly discover relevant items

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │    React + Vite     │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │   Node.js + Express │
                    │       Backend       │
                    └──────────┬──────────┘
                               │
                  ┌────────────┴────────────┐
                  ▼                         ▼
        ┌──────────────────┐      ┌──────────────────┐
        │     MongoDB      │      │    Socket.IO     │
        │     Database     │      │   Real-Time Chat │
        └──────────────────┘      └──────────────────┘
```

---

## 🛠️ Tech Stack

### 🎨 Frontend

* ⚛️ React.js
* ⚡ Vite
* 🎨 Tailwind CSS
* 🔄 React Router
* 🌐 Axios

### ⚙️ Backend

* 🟢 Node.js
* 🚂 Express.js
* 🍃 MongoDB
* 🗄️ Mongoose
* 🔐 JSON Web Token
* 🔒 bcrypt
* 📁 Multer
* 🔌 Socket.IO

---

## 📁 Project Structure

```text
findrly/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── ...
│   │
│   ├── public/
│   └── package.json
│
└── backend/
    ├── config/
    ├── controllers/
    ├── middlewares/
    ├── models/
    ├── routes/
    ├── uploads/
    └── server.js
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have:

* Node.js
* npm
* MongoDB or MongoDB Atlas

---

## ⚙️ Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file and add your environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
```

Start the backend:

```bash
npm run dev
```

---

# 🎨 Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Configure the backend API URL.

For local development:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

---

# 🔌 API Structure

The backend provides APIs for:

```text
/api/auth
/api/items
/api/claims
/api/users
```

### 🔐 Authentication

* Register users
* Login users
* JWT authentication
* Protected routes

### 📦 Items

* Create lost/found items
* Get item listings
* Search and filter items
* Update item details
* Delete items

### 🤝 Claims

* Submit ownership claims
* Manage claim requests
* Update claim status

### 👤 Users

* User profile management
* Access user-related information

---

# 💬 Real-Time Chat

Findrly uses **Socket.IO** to enable real-time communication between users.

```text
User A
   │
   │ Send Message
   ▼
Socket.IO Server
   │
   ▼
User B
```

---

# 🔒 Security

Findrly includes:

* 🔐 JWT authentication
* 🔒 Password hashing
* 🛡️ Protected API routes
* 👤 Authorization checks
* 🌍 CORS configuration
* 📁 Controlled file uploads

---

# 🌐 Deployment

The project is deployed using:

```text
Frontend → Vercel
Backend  → Render
Database → MongoDB Atlas
```

### Production API

```text
Frontend:
https://findrly.vercel.app

Backend:
https://findrly.onrender.com
```

---

# 🐛 Deployment Lessons

A few production issues that were addressed during deployment:

* Fixed CORS origin mismatch between Vercel and Render
* Configured the correct `/api` base path for frontend requests
* Enabled real-time Socket.IO communication across deployments
* Configured frontend and backend environment variables for production

---

# 🔮 Future Improvements

* [ ] Advanced AI-based item matching
* [ ] Location-based item discovery
* [ ] Email notifications
* [ ] Push notifications
* [ ] Improved claim verification
* [ ] Cloud-based image storage
* [ ] Advanced search filters
* [ ] Mobile application
* [ ] Admin dashboard
* [ ] Item recommendation system

---

# 👨‍💻 Author

**Pankaj Kumar**

MCA Student | Full-Stack Developer | AI Enthusiast

---

# ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!

It helps and motivates future improvements.

---

<div align="center">

### 🔎 Findrly

**Lost it? Found it? Findrly.**

Made with ❤️ and JavaScript

</div>

## 📄 License

This project is licensed under the **MIT License**.
