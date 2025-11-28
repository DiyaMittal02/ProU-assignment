# 🏛️ Legal Awareness Portal

> **"Know Your Rights, Empower Your Life"**

A premium, full-stack web application designed to make legal education accessible, engaging, and rewarding. Built with the MERN stack (MongoDB, Express, React, Node.js) and featuring a unique "Bold Legal-Tech" design system.

---

## ✨ Key Features

### 📚 **Interactive Learning**
- **Daily Legal Facts**: Bite-sized legal knowledge delivered daily.
- **Comprehensive Articles**: In-depth guides on Constitutional Law, Consumer Rights, Criminal Law, and more.
- **Comment System**: Engage in discussions, ask questions, and reply to others.

### 🎮 **Gamified Quizzes**
- **Timed Challenges**: Test your knowledge under pressure.
- **Instant Feedback**: Get detailed explanations for every answer.
- **Difficulty Levels**: Progress from Easy to Hard.
- **Scoring System**: Earn points based on accuracy and speed.

### 🏆 **Certificates & Achievements**
- **Auto-Generated Certificates**: Pass a quiz with 70%+ score to earn a downloadable certificate.
- **Profile Dashboard**: Track your progress, view earned certificates, and monitor your learning streak.
- **Badges**: Unlock badges like "Novice", "Rising Star", and "Legal Expert".

### 🎨 **Premium Design System**
- **"Bold Legal-Tech" Aesthetic**: A unique visual identity combining serif typography with modern tech vibes.
- **Cinematic Animations**: Staggered entrances, 3D card tilts, and fluid backgrounds.
- **Glassmorphism**: Modern frosted glass effects for a sleek look.
- **Responsive**: Flawless experience on mobile, tablet, and desktop.

---

## 🚀 Quick Start Guide

Follow these steps to get the project running locally in minutes.

### Prerequisites
- **Node.js** (v16+)
- **MongoDB** (Local or Atlas URL)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd legalspace
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/legal-awareness-portal
JWT_SECRET=your_super_secret_key_123
```

Seed the database with sample content (Articles & Quizzes):
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
```
*Server will run on `http://localhost:5000`*

### 3. Frontend Setup
Open a new terminal, navigate to the client directory, and install dependencies:
```bash
cd client
npm install
```

Start the frontend development server:
```bash
npm run dev
```
*Frontend will run on `http://localhost:5173` (or similar)*

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18**: Component-based UI library.
- **Vite**: Next-generation frontend tooling.
- **Lucide React**: Beautiful, consistent icons.
- **Axios**: Promise-based HTTP client.
- **Pure CSS**: Custom "Bold Legal-Tech" design system (No frameworks like Tailwind/Bootstrap).

### **Backend**
- **Node.js & Express**: Robust server-side framework.
- **MongoDB & Mongoose**: NoSQL database for flexible data modeling.
- **JWT (JSON Web Tokens)**: Secure stateless authentication.
- **Bcrypt**: Password hashing for security.

---

## 📂 Project Structure

```
legalspace/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components (Cards, Navbar, etc.)
│   │   ├── context/        # Global state (AuthContext)
│   │   ├── pages/          # Full page views (Home, Quiz, Profile)
│   │   ├── index.css       # Global design system & animations
│   │   └── main.jsx        # Entry point
│   └── package.json
│
├── server/                 # Node.js Backend
│   ├── models/             # Mongoose schemas (User, Article, Quiz)
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth protection
│   ├── seeders/            # Sample data scripts
│   ├── index.js            # Server entry point
│   └── package.json
│
└── README.md               # You are here!
```

---

## 📝 API Documentation

### **Auth**
- `POST /api/auth/register` - Create a new account
- `POST /api/auth/login` - Sign in
- `GET /api/auth/me` - Get current user profile

### **Content**
- `GET /api/articles` - List all articles
- `GET /api/quiz` - List all quizzes
- `GET /api/quiz/:id` - Get quiz details

### **User Actions**
- `POST /api/quiz/:id/submit` - Submit quiz answers
- `PUT /api/users/profile` - Update profile details

---

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Made with ❤️ for Legal Awareness**
