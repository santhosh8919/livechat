# LiveLink - Language Learning Chat App

A full-stack application for connecting language learners worldwide with real-time chat powered by Stream.

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS, DaisyUI, Stream Chat React
- **Backend**: Node.js, Express, MongoDB, Stream Chat
- **Authentication**: JWT with HTTP-only cookies

## Deployment Guide

### Backend Deployment (Render)

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `Backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add Environment Variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string
   STEAM_API_KEY=your_stream_api_key
   STEAM_API_SECRET=your_stream_api_secret
   JWT_SECRET_KEY=your_jwt_secret
   NODE_ENV=production
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```

### Frontend Deployment (Vercel)

1. Create a new project on [Vercel](https://vercel.com)
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `Frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   VITE_STREAM_API_KEY=your_stream_api_key
   ```

### MongoDB Atlas Setup

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a database user
3. Whitelist all IPs (0.0.0.0/0) for Render access
4. Get your connection string and add to Render environment variables

### Stream Chat Setup

1. Create an account at [GetStream.io](https://getstream.io)
2. Create a new app
3. Copy API Key and Secret
4. Add to both Render (backend) and Vercel (frontend) environment variables

## Local Development

```bash
# Install dependencies
cd Backend && npm install
cd ../Frontend && npm install

# Create .env files (see .env.example files)

# Run backend
cd Backend && npm run dev

# Run frontend (in another terminal)
cd Frontend && npm run dev
```

## Features

- User authentication (signup/login)
- User onboarding with language preferences
- Friend requests system
- Real-time chat with Stream Chat
- Video calls
- Theme customization
