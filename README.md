# Do Not Skip Gym - Workout Tracker App

A React Native workout tracking app with a FastAPI backend and Supabase authentication.

## 🏗️ Project Structure

```
do-not-skip-gym/
├── frontend/          # React Native + TypeScript + Expo
│   ├── src/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── stores/     # Zustand state management
│   │   ├── services/   # Supabase client
│   │   └── types/      # TypeScript interfaces
│   └── App.tsx
└── backend/           # FastAPI + Python (To be implemented)
```

## 🚀 Getting Started

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Supabase:**
   - Create a new project at [supabase.com](https://supabase.com)
   - Get your project URL and anon key from Settings > API
   - Create a `.env` file in the frontend directory:
   
   ```bash
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
   ```
   
   See `frontend/env-setup.md` for detailed instructions.

4. **Run the app:**
   ```bash
   npm start
   ```

5. **Test on device:**
   - Install Expo Go app on your iOS device
   - Scan the QR code shown in terminal

## 📱 Current Features

### ✅ Implemented
- **Login Screen** with email/password authentication
- **Supabase Auth** integration
- **Zustand** state management
- **TypeScript** support
- **Expo** setup for easy testing

### 🔄 In Progress
- Backend API setup
- Database schema design

### 📋 Planned
- Main app navigation (slider between views)
- Workout logging interface
- Statistics and analytics view
- Apple Health integration

## 🛠️ Tech Stack

- **Frontend:** React Native + TypeScript + Expo
- **State Management:** Zustand
- **Authentication:** Supabase Auth
- **Backend:** FastAPI + Python (planned)
- **Database:** Supabase PostgreSQL
- **Testing:** Expo Go

## 📝 Current Status

The login page is fully implemented and ready for testing. To use it:

1. Set up your Supabase project
2. Update the configuration in `frontend/src/services/supabase.ts`
3. Run the app and test sign up/sign in functionality

Next step: Implement the main app navigation and workout logging features.
