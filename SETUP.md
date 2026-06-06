# SurgeAlert — Expo Setup Guide
# From zero to running on your phone in ~15 minutes

---

## Step 1 — Install Node.js (if you don't have it)

Go to https://nodejs.org and download the LTS version.
Verify it works:
```
node --version   # should show v18 or higher
npm --version
```

---

## Step 2 — Install Expo CLI and EAS CLI

```bash
npm install -g expo-cli eas-cli
```

---

## Step 3 — Install app dependencies

```bash
cd surgealert-expo
npm install
```

---

## Step 4 — Install Expo Go on your phone

- iPhone: Search "Expo Go" in the App Store → Install
- Android: Search "Expo Go" in Google Play → Install

Make sure your phone and computer are on the SAME Wi-Fi network.

---

## Step 5 — Start the development server

```bash
npx expo start
```

A QR code will appear in your terminal.

- **iPhone**: Open the Camera app, point it at the QR code → tap the Expo Go link
- **Android**: Open the Expo Go app → tap "Scan QR code"

SurgeAlert will load on your phone in about 30 seconds. 🎉

---

## Step 6 — Connect to your backend (when ready)

Open `src/services/api.js` and replace:
```js
'https://your-api.surgealert.app/api'
```
with your actual deployed server URL from Railway or Render.

Save the file — the app will hot-reload automatically.

---

## Step 7 — Deploy to App Store & Google Play

### One-time setup:
```bash
eas login          # create a free Expo account if you don't have one
eas build:configure
```

Fill in your Apple ID and team details in eas.json.

### Build for both stores:
```bash
# iOS (uploads to App Store Connect automatically)
eas build --platform ios --profile production

# Android (generates AAB for Google Play)
eas build --platform android --profile production
```

EAS builds on Expo's cloud servers — no Xcode or Android Studio needed.
Builds take 10–20 minutes. You'll get a download link when done.

### Submit to stores:
```bash
eas submit --platform ios
eas submit --platform android
```

---

## Step 8 — App icons and splash screen

Replace these placeholder files with your actual assets:
```
assets/icon.png              (1024×1024 — App Store icon)
assets/splash.png            (2048×2048 — Splash screen)
assets/adaptive-icon.png     (1024×1024 — Android adaptive icon foreground)
assets/notification-icon.png (96×96 — Android notification icon, white on transparent)
```

All should use the SurgeAlert brand color #D85A30 on dark #09090c background.

---

## Troubleshooting

**"Network request failed" in the app**
→ Your phone can't reach the dev server. Make sure phone + computer are on same Wi-Fi.
→ Or try: `npx expo start --tunnel` (slower but works across networks)

**Map not showing**
→ react-native-maps requires a Google Maps API key on Android.
→ Get one free at console.cloud.google.com → Maps SDK for Android
→ Add to app.json under `android.config.googleMaps.apiKey`

**Push notifications not working in Expo Go**
→ Push notifications only work in a standalone build (Step 7), not in Expo Go.
→ Everything else (map, alerts, reports, settings) works in Expo Go.

**Build fails on EAS**
→ Run `eas build:inspect` to see the full log
→ Most common fix: make sure your Apple Developer account is active ($99/year)

---

## Cost summary

| Item | Cost |
|------|------|
| Expo account | Free |
| EAS Build (up to 30 builds/month) | Free |
| EAS Build (unlimited) | $99/month |
| Apple Developer Program | $99/year |
| Google Play Console | $25 one-time |
| Railway (backend hosting) | ~$5/month |
| Supabase (PostgreSQL) | Free tier |
| surgealert.app domain | ~$15/year |

**Total to launch: ~$140 first year**
