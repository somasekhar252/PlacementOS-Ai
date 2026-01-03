<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1vlmGRJfIX2rhgZIFvS2joadeGXw3dYMM

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Firebase

1. Create a `.env.local` file (not committed) and set the `VITE_FIREBASE_*` keys. You can copy values from `.env.example` and fill them with your Firebase project settings.
2. The app reads Firebase config from `import.meta.env` (Vite). No additional code changes are required.

# PlacementOS-AI (refactor)

Run locally:
1. npm install
2. npm run dev

Build:
- npm run build
