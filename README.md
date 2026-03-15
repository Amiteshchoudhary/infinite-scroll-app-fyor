# Infinite Scroll Activity Feed App

## Overview
A full-stack web application featuring an infinite scroll activity feed. Users can view activities with images, titles, and descriptions loaded progressively as they scroll.

**Tech Stack:**
- **Frontend**: Vue 3 + Axios (for API calls)
- **Backend**: Node.js + Express + Mongoose
- **Database**: MongoDB (local)
- **Data**: Fake activities generated with Faker.js

## Prerequisites
- Node.js (v18+)
- MongoDB (local instance running on `mongodb://localhost:27017`)
- npm/yarn

## Quick Start

### 1. Clone/Navigate to Project
```
cd infinite-scroll-app
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
- Runs on **http://localhost:3000**
- Auto-connects to MongoDB: `mongodb://localhost:27017/infinite-scroll-app`
- **Auto-seeds 100 fake activities** on first startup (title, description, image, date)

**Manual Seed (if needed):**
```bash
curl -X POST http://localhost:8080/api/seed
```

### 3. Frontend Setup (New Terminal)
```bash
cd frontend
npm install
npm run serve
```
- Dev server on **http://localhost:8080**
- Opens in browser automatically

### 4. Usage
1. Start backend (seeds DB automatically)
2. Start frontend
3. Open **http://localhost:8080**
4. Scroll infinitely to load more activities!

## Folder Structure
```
infinite-scroll-app/
├── backend/          # Express API + MongoDB
│   ├── models/       # Activity, User schemas
│   ├── routes/       # /api/feed, /api/auth
│   ├── seeds/        # Fake data generator
│   └── server.js
└── frontend/         # Vue 3 app
    ├── src/components/ # ActivityFeed.vue, ActivityCard.vue
    └── public/
```

## Data Flow
```
Vue Frontend (localhost:8080)
    ↓ Axios HTTP requests (CORS enabled)
Node.js Backend API (localhost:3000)
    ↓ Express routes (/api/feed*)
MongoDB (localhost:27017)
    ↓ Mongoose queries (Activity model)
Infinite scroll → Paginated/skip-based queries → JSON response
```

1. **ActivityFeed.vue** detects scroll → calls API via Axios (e.g., `GET /api/feed?page=2`)
2. **Express routes** query MongoDB (e.g., `Activity.find().skip(offset).limit(10).sort({createdAt: -1})`)
3. **Backend** returns JSON → Vue renders **ActivityCard.vue** components progressively

## API Endpoints
| Method | Endpoint     | Description                  |
|--------|--------------|------------------------------|
| GET    | `/api/feed`  | Get activities (paginated)   |
| POST   | `/api/seed`  | Seed 100 fake activities     |
| GET    | `/health`    | Health check                 |
| POST   | `/api/auth`  | User auth (login/register)   |

## Environment Variables
Create `.env` in `backend/`:
```
MONGODB_URI=mongodb://localhost:27017/infinite-scroll-app
PORT=3000
JWT_SECRET=your-secret-key
```

## Troubleshooting
- **MongoDB not connected**: Start MongoDB service, check URI
- **CORS errors**: Backend has `cors()` middleware enabled
- **No activities**: Hit `/api/seed` or restart backend
- **Port conflicts**: Change `PORT` env var
- **Build for prod**: `npm run build` (frontend), serve `dist/`

## Development Scripts
```bash
# Backend
npm run dev     # nodemon (auto-restart)
npm start       # production

# Frontend
npm run serve   # dev server
npm run build   # production build
```
https://github.com/user-attachments/assets/7d29473f-25b2-4568-ac0c-b4c39cc9d1b9


![Image](https://github.com/user-attachments/assets/f8700f66-9f70-44a6-ad94-9b928bfb3c04)
<img width="1919" height="1079" alt="Image" src="https://github.com/user-attachments/assets/ac14fdc8-7176-438a-8f82-e9e7c1c5d1f6" />
<img width="1919" height="1077" alt="Image" src="https://github.com/user-attachments/assets/0a89e097-a6f3-4eff-9a1d-697a19581b6b" />

<img width="1919" height="1079" alt="Image" src="https://github.com/user-attachments/assets/dea728ec-77c8-426e-adfe-01dc1bbb13ae" />

<img width="1919" height="1079" alt="Image" src="https://github.com/user-attachments/assets/446d4073-0188-4fae-b5cf-01f12ef33be0" />


<img width="1919" height="1079" alt="Image" src="https://github.com/user-attachments/assets/ed480133-52f3-4414-b45f-4d43fb73bab7" />

<img width="1919" height="1079" alt="Image" src="https://github.com/user-attachments/assets/92f4da61-d6eb-44dd-81f0-044dcc7463a7" />

<img width="1919" height="1079" alt="Image" src="https://github.com/user-attachments/assets/2333073e-3afb-40ad-876b-b7b66ebfb69e" />

<img width="1919" height="1079" alt="Image" src="https://github.com/user-attachments/assets/fc2abb58-fece-464a-979e-c7cadbeb256c" />

<img width="1919" height="1077" alt="Image" src="https://github.com/user-attachments/assets/7e6dafa4-e02f-471b-8bd2-0b00e28c7d58" />

<img width="1903" height="1079" alt="Image" src="https://github.com/user-attachments/assets/38db6b1e-e6cc-4dc4-bad0-783203d381c5" />


