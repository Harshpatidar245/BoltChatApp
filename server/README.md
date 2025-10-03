# Chat App Backend

MongoDB-powered backend for the chat application with real-time messaging using Socket.IO.

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or sign in
3. Create a new cluster (free tier is fine)
4. Click "Connect" and choose "Connect your application"
5. Copy the connection string

### 3. Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB connection string:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatapp?retryWrites=true&w=majority
PORT=5000
FRONTEND_URL=http://localhost:5173
```

Replace `username` and `password` with your MongoDB credentials.

### 4. Run the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Deployment Options

### Option 1: Render

1. Create account at [Render](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
5. Add environment variables in Render dashboard

### Option 2: Railway

1. Create account at [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect the Node.js app
5. Add environment variables

### Option 3: Heroku

1. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Login: `heroku login`
3. Create app: `heroku create your-chat-app`
4. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=your_connection_string
   heroku config:set FRONTEND_URL=your_frontend_url
   ```
5. Deploy: `git push heroku main`

## API Endpoints

### Rooms
- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Create a new room
- `GET /api/rooms/:id` - Get room by ID

### Messages
- `GET /api/messages/room/:roomId` - Get messages for a room
- `POST /api/messages` - Create a new message

### WebSocket Events
- `join-room` - Join a chat room
- `leave-room` - Leave a chat room
- `send-message` - Send a message
- `new-message` - Receive new messages

## Testing

Test the API:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status":"ok","message":"Server is running"}
```
