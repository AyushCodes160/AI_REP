# AI Social Rep

An AI-powered personal social media manager for creators. This MERN stack prototype helps content creators manage their social media presence with AI-assisted content creation, scheduling, and analytics.

## 🚀 Features

- **Authentication**: Secure JWT-based user authentication
- **Draft Management**: Create, edit, and delete content drafts
- **AI Tools**: 
  - Generate captions from ideas
  - Generate YouTube/TikTok scripts
  - Get posting schedule suggestions
  - Generate content ideas based on niche
  - Rewrite content in your tone
- **Social Account Integration**: Mock connection to YouTube, Twitter, Instagram, TikTok, LinkedIn
- **Scheduling**: Schedule posts with automatic posting simulation via cron jobs
- **Analytics**: Weekly performance reports with AI-generated insights
- **Dashboard**: Overview of drafts, scheduled posts, and connected accounts

## 📁 Project Structure

```
/prototype
  /backend
    server.js
    /config
    /controllers
    /routes
    /models
    /middlewares
    /utils
      ai.js
      promptTemplates.js
    /cron
      scheduler.js
    .env.example
    package.json
  /frontend
    /src
      /components
      /pages
      /context
      /api
    vite.config.js
    tailwind.config.js
    index.html
    package.json
  README.md
```

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT + bcrypt for authentication
- OpenAI API for AI features
- node-cron for scheduled posts

### Frontend
- React + Vite
- Tailwind CSS
- Axios for API calls
- React Router for navigation
- Context API for state management

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas connection string)
- OpenAI API key (required for AI features)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=9000
MONGODB_URI=mongodb://localhost:27017/ai-social-rep
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
OPENAI_API_KEY=your-openai-api-key-here
NODE_ENV=development
```

**Note:** Only `OPENAI_API_KEY` is required. The application uses OpenAI's GPT-3.5-turbo model for all AI features.

5. Start the backend server:
```bash
npm run server
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create a `.env` file to point the UI at a remote backend:
```bash
echo "VITE_API_URL=https://your-backend-domain.com/api" > .env
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🎯 Usage

### Getting Started

1. **Start MongoDB**: Make sure MongoDB is running on your system
2. **Start Backend**: Run `npm run server` in the `/backend` directory
3. **Start Frontend**: Run `npm run dev` in the `/frontend` directory
4. **Open Browser**: Navigate to `http://localhost:3000`

### Creating an Account

1. Click "Sign up" on the login page
2. Fill in your username, email, password, and optional niche
3. You'll be automatically logged in after signup

### Creating Content

1. Navigate to "Drafts" → "Create Draft"
2. Enter a title, select a platform, and describe your content idea
3. Use the "✨ AI Generate" buttons to generate captions or scripts
4. Save your draft

### Scheduling Posts

1. Go to "Schedule" page
2. Select a draft from the dropdown
3. Choose platform and scheduled time
4. The cron job will automatically "post" scheduled content (simulated)

### Viewing Analytics

1. Navigate to "Analytics"
2. View your weekly performance report
3. See AI-generated insights and recommendations

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Drafts
- `GET /api/drafts` - Get all drafts (protected)
- `GET /api/drafts/:id` - Get single draft (protected)
- `POST /api/drafts` - Create draft (protected)
- `PUT /api/drafts/:id` - Update draft (protected)
- `DELETE /api/drafts/:id` - Delete draft (protected)

### AI Tools
- `POST /api/ai/generate-caption` - Generate caption (protected)
- `POST /api/ai/generate-script` - Generate script (protected)
- `POST /api/ai/schedule-suggestions` - Get schedule suggestions (protected)
- `POST /api/ai/content-ideas` - Generate content ideas (protected)
- `POST /api/ai/rewrite` - Rewrite content (protected)

### Social Accounts
- `POST /api/social/connect` - Connect account (protected)
- `GET /api/social/accounts` - Get connected accounts (protected)
- `DELETE /api/social/accounts/:id` - Disconnect account (protected)

### Scheduling
- `GET /api/schedule` - Get scheduled posts (protected)
- `POST /api/schedule` - Schedule a post (protected)
- `DELETE /api/schedule/:id` - Cancel scheduled post (protected)

### Analytics
- `GET /api/analytics/weekly-report` - Get weekly report (protected)

## 🔄 Cron Job

The scheduler runs every minute to check for posts that should be posted. When a scheduled post's time arrives:
- It creates a `PostedPost` record with mock analytics
- Updates the `ScheduledPost` status to "posted"
- Updates the `Draft` status to "posted"
- Logs the action to the console

## 🌐 GitHub Pages Deployment

This repository is configured to ship the React frontend to GitHub Pages via the workflow in `.github/workflows/deploy.yml`.

1. In your repository settings, enable GitHub Pages with the "GitHub Actions" source (this should happen automatically after the first successful deploy).
2. Add a repository secret named `VITE_API_URL` that points to a live backend (for example, a Render/Heroku deployment). If you don't supply a value the UI will still deploy, but all API calls will fail.
3. Push to `main` (or manually run the workflow). The action will build the Vite app, upload the `dist` folder, and publish it to `https://ayushcodes160.github.io/AI_REP/`.

> ⚠️ The GitHub Pages deployment only serves the static frontend. You still need to host the Express API elsewhere and expose it via `VITE_API_URL` for the app to function.

## 📝 Notes

- This is a **prototype** - social media posting is **simulated only**
- Mock analytics are generated randomly for demonstration
- Social account connections are **mock** - no real API integrations
- The cron job runs every minute for demonstration purposes
- Make sure to set your OpenAI API key in the `.env` file for AI features to work

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` or use MongoDB Atlas connection string
- Check your `MONGODB_URI` in `.env`

### AI Features Not Working
- Verify your `OPENAI_API_KEY` is set correctly in `.env`
- Check backend console for error messages
- Ensure you have sufficient OpenAI API credits

### Port Already in Use
- Backend: Change `PORT` in `.env` file
- Frontend: Update `vite.config.js` server port

## 📄 License

This is a prototype project for demonstration purposes.

---

**Codebase ready. You can now run the backend and frontend.**

