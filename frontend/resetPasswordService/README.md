# Password Reset Service

This folder contains all the password reset functionality for the Do Not Skip Gym app.

## 📁 Files
- `reset-password.html` - The password reset page users see after clicking email links
- `serve-reset.js` - Local server to serve the reset page
- `README.md` - Setup instructions (this file)

## 🔧 Setup Instructions

### 1. Configure the Reset Page
Edit `reset-password.html` and update these values:

```javascript
// Replace with your actual Supabase credentials
const SUPABASE_URL = 'your_supabase_project_url_here';
const SUPABASE_ANON_KEY = 'your_supabase_anon_key_here';

// Replace with your Expo dev server URL (find it when you run expo start)
const EXPO_SCHEME = 'exp://192.168.0.180:8081'; // Your actual IP and port

// For production, you'll use a custom scheme like:
const APP_SCHEME = 'donotskipgym://';
```

### 2. Start the Reset Server
```bash
cd frontend/resetPasswordService
node serve-reset.js
```
This starts a server at `http://localhost:3000`

### 3. Update Supabase Settings
1. Go to Supabase Dashboard → Settings → API
2. Set **Site URL** to: `http://localhost:3000`
3. Save settings

### 4. Test the Flow
1. Request password reset in your app
2. Check email - link should go to `http://localhost:3000`
3. Reset password on the page
4. Page should try to deep link back to your Expo app

## 📱 How Deep Linking Works

### Development (Expo Go)
- Uses URL like: `exp://192.168.1.100:8081/--/reset-success`
- This opens your app in Expo Go

### Production (Standalone App)
- Uses custom scheme: `donotskipgym://reset-success`
- This opens your published app

## 🌐 For Production Deployment

### Option A: Deploy Reset Page to Netlify/Vercel
1. Upload `reset-password.html` to hosting service
2. Update Supabase Site URL to your domain
3. Update Expo scheme in the HTML file

### Option B: Use Your Computer's IP (Local Network)
1. Find your IP: `ifconfig | grep "inet " | grep -v 127.0.0.1`
2. Update server to listen on your IP
3. Set Supabase Site URL to `http://YOUR_IP:3000`

## 🔍 Testing Checklist

- [ ] Reset server running on port 3000
- [ ] Supabase Site URL set to localhost:3000
- [ ] Supabase credentials in HTML file
- [ ] Expo dev server URL in HTML file
- [ ] Test email link goes to reset page
- [ ] Test password reset functionality
- [ ] Test deep link back to app

## 🎯 User Journey

1. **App**: User requests password reset
2. **Email**: User clicks reset link → Opens localhost:3000
3. **Browser**: User enters new password → Success
4. **Deep Link**: Page tries to open app automatically
5. **App**: User signs in with new password ✅
