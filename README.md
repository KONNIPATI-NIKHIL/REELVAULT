# 🎬 REELVAULT

**Premium Movie Collection Management System**  
*A full-stack MERN application for managing your personal cinema library.*

---

## ✨ Features

- 🎥 **Full CRUD** — Add, view, edit, and delete movies from your collection
- 🔍 **Smart Search** — Real-time search by title, genre, or director (backend-powered)
- 🎛️ **Advanced Filtering** — Filter by genre, sort by rating, year, or title
- 📊 **Live Dashboard** — Dynamic statistics calculated from real database records
- 🖼️ **Poster Support** — Movie poster images with beautiful CSS fallback covers
- 📱 **Responsive** — Works beautifully on desktop, tablet, and mobile
- ✅ **Validation** — Full frontend and backend validation with helpful error messages
- 🎨 **Cinematic UI** — Dark-first premium design inspired by streaming platforms

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, Lucide Icons |
| Backend | Node.js, Express.js |
| Database | MongoDB (via Mongoose) |
| HTTP Client | Axios |
| Notifications | React Hot Toast |

---

## 📋 Prerequisites

- **Node.js** v18+ (https://nodejs.org)
- **MongoDB** — either:
  - Local: [MongoDB Community](https://www.mongodb.com/try/download/community)
  - Cloud: [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier available)
- **npm** v8+

---

## 🚀 Quick Start

### 1. Clone or open the project
```bash
cd "EXP 2"
```

### 2. Install dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd ../client
npm install
```

### 3. Configure MongoDB

Copy the example environment file:
```bash
# In the server/ directory
cp .env.example .env
```

Edit `server/.env`:
```env
# Local MongoDB
MONGO_URI=mongodb://localhost:27017/reelvault

# OR MongoDB Atlas (replace with your connection string)
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/reelvault?retryWrites=true&w=majority

PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
```

### 4. Seed sample data (optional)
```bash
cd server
node seed.js
```
This adds 10 classic movies to your database for demonstration.

### 5. Run the application

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# Server starts at http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# App opens at http://localhost:5173
```

---

## 📡 API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/movies` | Get all movies |
| `GET` | `/movies?search=inception` | Search by title/genre/director |
| `GET` | `/movies?genre=Action` | Filter by genre |
| `GET` | `/movies?sort=rating&order=desc` | Sort results |
| `GET` | `/movies/stats` | Get dashboard statistics |
| `GET` | `/movies/:id` | Get a single movie |
| `POST` | `/movies` | Create a new movie |
| `PUT` | `/movies/:id` | Update a movie |
| `DELETE` | `/movies/:id` | Delete a movie |
| `GET` | `/health` | API health check |

### Request Body (POST / PUT)
```json
{
  "title": "Inception",
  "genre": "Sci-Fi",
  "releaseYear": 2010,
  "rating": 8.8,
  "director": "Christopher Nolan",
  "posterUrl": "https://example.com/poster.jpg"
}
```

---

## 🎞️ Movie Schema

| Field | Type | Required | Constraints |
|-------|------|----------|------------|
| `title` | String | ✅ | Max 200 chars |
| `genre` | String | ✅ | Must be a valid genre from the list |
| `releaseYear` | Number | ✅ | 1888 – current year +5 |
| `rating` | Number | ✅ | 0.0 – 10.0 |
| `director` | String | ✅ | Max 100 chars |
| `posterUrl` | String | ❌ | Optional image URL |

**Valid genres:** Action, Adventure, Animation, Biography, Comedy, Crime, Documentary, Drama, Fantasy, Horror, Musical, Mystery, Romance, Sci-Fi, Thriller, War, Western

---

## 🧪 Running Tests

Backend API tests (requires Node.js only — uses in-memory MongoDB):
```bash
cd server
npm test
```

The test suite covers:
- All CRUD operations
- Search and filter functionality
- Dashboard statistics
- Input validation
- Error handling (invalid IDs, missing fields, out-of-range values)
- Isolation (edits/deletes only affect the target document)

---

## 📁 Project Structure

```
EXP 2/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── MovieCard.jsx
│   │   │   ├── MovieGrid.jsx
│   │   │   ├── MovieForm.jsx
│   │   │   ├── MovieModal.jsx
│   │   │   ├── DeleteDialog.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── LoadingState.jsx
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   ├── services/
│   │   │   └── movieService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── server/                    # Express backend
    ├── config/
    │   └── db.js
    ├── controllers/
    │   └── movieController.js
    ├── models/
    │   └── Movie.js
    ├── routes/
    │   └── movieRoutes.js
    ├── middleware/
    │   └── errorMiddleware.js
    ├── __tests__/
    │   └── movies.test.js
    ├── seed.js
    ├── server.js
    ├── .env.example
    └── package.json
```

---

## 🎨 Design System

| Element | Value |
|---------|-------|
| Primary Background | `#0B0C10` |
| Secondary Background | `#12141B` |
| Card Background | `#181B24` |
| Primary Text | `#F5F3EF` |
| Accent (Gold) | `#C9A84C` |
| Accent (Violet) | `#7C6EF0` |
| Heading Font | Space Grotesk |
| Body Font | Inter |

---

## ⚠️ MongoDB Setup Notes

**Local MongoDB:**
1. Install MongoDB Community Edition
2. Start the service: `mongod` (or via system service)
3. Use URI: `mongodb://localhost:27017/reelvault`

**MongoDB Atlas (Cloud — Recommended for demos):**
1. Go to https://www.mongodb.com/atlas
2. Create a free cluster
3. Create a database user with read/write permissions
4. Add your IP address to Network Access
5. Get the connection string from "Connect" → "Drivers"
6. Replace in `server/.env`

---

## 📝 Notes

- The frontend auto-refreshes when the database changes — no manual reload needed
- All statistics on the dashboard are computed live from MongoDB aggregation queries
- The app handles network errors gracefully with retry functionality
- Poster images load progressively with a stylized fallback for missing images

---

*Built with ❤️ as an academic project demonstrating full-stack MERN development.*
