# OrbitFuture Mobile App (Expo Go)

## Quick Start — Expo Go

1. Install **Expo Go** on your Android or iPhone from the app store.

2. Install dependencies:
```bash
cd artifacts/mobile
npm install
```

3. Start the development server:
```bash
npx expo start
```

4. Scan the **QR code** shown in the terminal with:
   - **Android**: Expo Go app → Scan QR
   - **iPhone**: Camera app → scan (opens Expo Go automatically)

## Configure API URL

Edit `app.json` → `extra.apiUrl` to point to your backend:
- **Development**: your Replit dev URL
- **Production**: your deployed Replit `.replit.app` URL

## Screens

| Screen | Description |
|--------|-------------|
| Home | Hero, features, stats, trust indicators |
| Plans | Browse and order satellite internet plans |
| Dashboard | Active subscriptions, wallet balance |
| Wallet | Buy token bundles via Stripe |
| Support | WhatsApp, email, help topics |
| Profile | User account, sign in/out |

## Build for Production

```bash
# Android APK
npx eas build --platform android

# iOS
npx eas build --platform ios
```
