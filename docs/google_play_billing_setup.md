# Google Play Billing Setup Guide (via RevenueCat)

> [!IMPORTANT]
> **Chicken & Egg Problem:** You cannot create In-App Products until you have uploaded a build with the Billing permission.
> **The Workflow:**
> 1.  **Build** the app (with the code we just wrote).
> 2.  **Upload** to Play Console (Internal Testing Track).
> 3.  **Create Products** in Play Console (The menu unlocks).
> 4.  **Configure RevenueCat**.
> 5.  **Test** & Promote to Production.

This guide walks you through setting up the "Rs. 30 Premium Purchase" for your app using RevenueCat.

## Phase 1: Google Play Console 🛒

1.  **Log in** to your [Google Play Console](https://play.google.com/console).
2.  **Select your App**.
3.  In the left sidebar, scroll down to **Monetization** > **Products** > **In-app products**.
4.  Click **Create product**.
5.  **Product ID**: `bangla_tithi_premium_lifetime`
    *   *Note: This must match exactly what we use in RevenueCat later.*
6.  **Product details**:
    *   Name: "Premium Lifetime" (or similar)
    *   Description: "Unlock full solar charts and remove ads."
7.  **Price**:
    *   Click **Set Price**.
    *   Enter `30` INR (or your currency equivalent).
    *   Click **Apply prices**.
8.  **Save** and **Activate** the product.

## Phase 2: Google Cloud Service Account ☁️
*RevenueCat needs permission to talk to Google to verify purchases.*

1.  Go to **Google Play Console** > **Setup** > **API access**.
2.  Follow the link to **Google Cloud Console**.
3.  Create a **Service Account**:
    *   Name: `revenuecat-upload` (or similar).
    *   Role: **Service Account User** (basic).
4.  **Create Key**:
    *   Click the newly created email address.
    *   Go to **Keys** tab > **Add Key** > **Create new key** > **JSON**.
    *   **Download this JSON file**. Keep it safe!
5.  **Back to Google Play Console**:
    *   In **API access**, verify the new service account is listed.
    *   Click **Grant access** next to it.
    *   Permissions: **View app information** and **Manage orders and subscriptions**.
    *   Click **Invite user**.

## Phase 3: RevenueCat Dashboard 😺

1.  **Log in** to [RevenueCat](https://app.revenuecat.com/).
2.  **Create a Project**: Name it "Bangla Tithi".
3.  **Add an App**:
    *   Select **Play Store (Android)**.
    *   **Package Name**: `com.banglatithi.app` (Double check inside `android/app/build.gradle`).
    *   **Service Account Credentials**: Upload the JSON file you downloaded in Phase 2.
    *   RevenueCat will verify the connection.
4.  **Get API Key**:
    *   Go to Project Settings > **Apps**.
    *   Find your Android app and reveal the **Public API Key** (starts with `goog_...`).
    *   **COPY THIS KEY**.

## Phase 4: Configure RevenueCat Products 📦

1.  In RevenueCat, go to **Products**.
2.  Click **+ New**.
3.  **Identifier**: `bangla_tithi_premium_lifetime` (Must match Google Play Console exactly).
4.  Click **Create**.
5.  Go to **Entitlements** (left sidebar).
    *   Create New > Identifier: `premium`
    *   Attach the product you just created.
6.  Go to **Offerings** (left sidebar).
    *   Click **Default**.
    *   Click **New Package** > Identifier: `lifetime`
    *   Attach the product `bangla_tithi_premium_lifetime`.

## Phase 5: Link Setup in Code 💻

1.  Open `services/purchases.ts` in your project.
2.  Find this line:
    ```typescript
    const REVENUECAT_API_KEY_ANDROID = 'goog_YOUR_REVENUECAT_ANDROID_API_KEY';
    ```
3.  Replace `'goog_YOUR_REVENUECAT_ANDROID_API_KEY'` with the key you copied in Phase 3.
4.  **Re-build**: Run `npm run build && npx cap sync android`.

## Testing 🧪
*Note: You cannot test real billing on an Emulator without a Google Account, and you cannot test with your own Developer Account.*
1.  Add a **License Tester** in Play Console (Setup > License testing).
2.  Add a generic Gmail account (not your dev account) to the testers list.
3.  Log in to the Android device/emulator with that Gmail account.
4.  Build the app and run it. The purchase flow will list "Test Card, Always Approves".
