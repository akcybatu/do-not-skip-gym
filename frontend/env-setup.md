# Environment Variables Setup

To configure your Supabase credentials, create a `.env` file in the `frontend` directory with the following content:

```bash
# Copy this content to your .env file
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

## How to get your Supabase credentials:

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Navigate to Settings → API
3. Copy the "Project URL" → paste as `EXPO_PUBLIC_SUPABASE_URL`
4. Copy the "anon public" key → paste as `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## Example .env file:
```bash
EXPO_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Important:** Never commit your `.env` file to version control. It contains sensitive credentials.
