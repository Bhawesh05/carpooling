# RideShare - Carpooling Web App

A full-stack carpooling application where drivers can post rides and passengers can find and book them. Built with React, Node.js, MongoDB, and a Python AI service for fare estimation.

## Tech Stack

- **Frontend** - React.js with Context API
- **Backend** - Node.js + Express
- **Database** - MongoDB with Mongoose
- **AI Service** - Python Flask (fare estimator using linear regression)
- **Auth** - JWT tokens

## Features

- Register and login as a driver or passenger
- Drivers can post rides with pickup/drop location, date, seats, and price
- Passengers can search and book available rides
- AI-powered fare suggestion based on distance
- Dashboard to track your rides and bookings

## Project Structure

```
carpooling/
├── server/          # Express backend
├── client/          # React frontend
├── ai-service/      # Python Flask fare estimator
└── docker-compose.yml
```

## Getting Started

### Prerequisites
- Node.js v18+
- Python 3.9+
- MongoDB (local or Atlas)

### Setup

1. Clone the repo
```bash
git clone https://github.com/yourusername/carpooling.git
cd carpooling
```

2. Install backend dependencies
```bash
cd server
npm install
cp .env.example .env
# fill in your MongoDB URI and JWT secret
```

3. Install frontend dependencies
```bash
cd ../client
npm install
```

4. Setup AI service
```bash
cd ../ai-service
pip install -r requirements.txt
```

### Running the app

In separate terminals:

```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm start

# Terminal 3 - AI Service
cd ai-service && python app.py
```

App runs at `http://localhost:3000`

## Environment Variables

See `server/.env.example` for required variables.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/rides | Get all rides |
| POST | /api/rides | Post a ride |
| POST | /api/rides/:id/book | Book a ride |
| GET | /api/bookings/me | My bookings |
| GET | /ai/estimate-fare | Get fare estimate |

## License

MIT
