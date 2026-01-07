# RefHub - Full Stack Version

## 🚀 This Version Uses Vercel Serverless Functions

Instead of loading Supabase in the browser (which gets blocked), this version uses:
- **Frontend:** Pure HTML/CSS/JS (no external libraries)
- **Backend:** Vercel Serverless Functions (Node.js)
- **Database:** Supabase (accessed server-side)

This approach **cannot be blocked** by browser security!

## 📦 Files in This Folder:

- `index.html` - Frontend website
- `package.json` - Node.js dependencies
- `.env` - Environment variables (Supabase credentials)
- `api/` folder:
  - `references.js` - Get all references
  - `add-reference.js` - Add new reference
  - `auth.js` - Login/signup
  - `vote-api.js` - Vote on references

## 🔧 How to Deploy:

### Step 1: Upload to GitHub
1. Delete ALL files in your RefRoom2 repository
2. Upload ALL files from this folder (including the `api` folder)
3. Commit

### Step 2: Set Environment Variables in Vercel
1. Go to Vercel → ref-room2 project → Settings
2. Click "Environment Variables"
3. Add two variables:
   - Name: `SUPABASE_URL`, Value: `https://afpqstmesnobtweysiuw.supabase.co`
   - Name: `SUPABASE_ANON_KEY`, Value: (your anon key from .env file)
4. Save

### Step 3: Redeploy
1. Vercel will auto-deploy
2. OR click "Redeploy" in Deployments
3. Wait 1 minute
4. Visit your site!

## ✨ Features:
- ✅ Real authentication
- ✅ Shared database  
- ✅ Everyone sees same data
- ✅ Real-time updates (30-second refresh)
- ✅ Voting system
- ✅ Add references
- ✅ No browser blocking issues!

## 🎯 This Will Work!
Server-side code cannot be blocked by browser security settings!