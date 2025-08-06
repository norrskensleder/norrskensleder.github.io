# Norrskensleder

An experience blog!

## Environment Setup

This project uses Firebase for comments and interactions. To set up the environment:

1. Copy `env.example` to `.env.local`
2. Fill in your Firebase configuration values from your Firebase console
3. Never commit `.env.local` to version control

### Required Environment Variables:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` 
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
