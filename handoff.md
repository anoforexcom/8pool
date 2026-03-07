# 🚀 Project Handoff Guide: sudokas.live

Welcome to your new Sudoku platform! This guide will walk you through the steps to get the project running on your own infrastructure.

## 📋 Prerequisites

- **Node.js 18+** installed.
- A **Vercel** account (for hosting).
- A **Firebase** account (for database & auth).

---

## 🛠️ Step 1: Firebase Setup (Auth & Firestore)

1. **Create a new project** on [Firebase](https://console.firebase.google.com).
2. **Authentication**:
   - Go to **Authentication > Sign-in method** and enable "Email/Password".
3. **Cloud Firestore**:
   - Go to **Firestore Database** and create a database.
   - Start in "Test Mode" or set proper security rules.
   - The app will automatically create the necessary collections (`profiles`, `purchases`, `chat_messages`) when data is first written.
4. **Web App**:
   - Register a new Web App in your Firebase project.
   - Copy the Firebase Configuration (API Key, Project ID, etc.).

---

## 🚀 Step 2: Vercel Deployment

1. **Import the repository** from GitHub to Vercel.
2. **Configure Environment Variables**:
   In the Vercel project settings, add the following variables from your Firebase config:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

3. **Deploy**: Vercel will automatically build and deploy the project.

---

## 💰 Step 3: Monetization & Payments

Currently, the project uses a **simulated payment system** integrated with Firestore:
- When a user "buys" a pack, the transaction is recorded in the `purchases` collection.
- Credits are automatically added to the user's profile in the `profiles` collection.
- **To implement real payments (Stripe/PayPal)**: You will need to replace the logic in `components/PaymentPage.tsx` with your preferred payment gateway API.

---

## 📊 Step 4: Admin Dashboard

- **Access**: Double-click the logo on the landing page (6 times) to enter the hidden admin panel.
- **Security**: The admin panel displays data fetched from Firestore.

---

## 📂 Project Structure Refresher

- `/app`: Next.js App Router (Main logic in `AppClient.tsx`).
- `/components`: UI elements (Modals, Pages, PWA components).
- `/services`: Business logic (Firebase client, Sudoku generation).

---

**Congratulations!** Your project is ready for users. For further customization (colors, app name), use the constant settings within the code.
