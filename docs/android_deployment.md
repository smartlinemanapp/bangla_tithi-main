# Android App Deployment Checklist

## ✅ Current Status

### Build Configuration
- **App ID**: `com.banglatithi.app`
- **App Name**: Bangla Tithi
- **Build Status**: ✅ Successful (426.73 kB)
- **Capacitor Sync**: ✅ Complete

### Manifest Configuration
- **Internet Permission**: ✅ Enabled
- **Vibrate Permission**: ✅ Enabled
- **File Provider**: ✅ Configured

---

## 📋 Pre-Deployment Checklist

### 1. App Signing (CRITICAL)
- [ ] Generate release keystore
- [ ] Configure signing in `android/app/build.gradle`
- [ ] Store keystore securely

**Command to generate keystore:**
```bash
keytool -genkey -v -keystore bangla-tithi-release.keystore -alias bangla-tithi -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Build Configuration
- [ ] Update `versionCode` in `android/app/build.gradle`
- [ ] Update `versionName` in `android/app/build.gradle`
- [ ] Set `minSdkVersion` to 24 or higher
- [ ] Set `targetSdkVersion` to 34 (Android 14)

### 3. App Icon & Branding
- [ ] Add app icon (1024x1024 PNG)
- [ ] Add feature graphic (1024x500)
- [ ] Add screenshots (at least 2, max 8)
- [ ] Prepare app description (short & full)

### 4. Privacy & Legal
- [ ] Privacy Policy URL: `https://bangla-tithi-main.vercel.app/privacy.html` ✅
- [ ] Terms of Service (if applicable)
- [ ] Data safety form completion

### 5. Play Store Listing
- [ ] App title (max 50 characters)
- [ ] Short description (max 80 characters)
- [ ] Full description (max 4000 characters)
- [ ] Category: Lifestyle or Tools
- [ ] Content rating questionnaire

### 6. Build Release APK/AAB
```bash
cd android
./gradlew bundleRelease  # For AAB (recommended)
# OR
./gradlew assembleRelease  # For APK
```

### 7. Testing
- [ ] Test on physical device
- [ ] Test premium unlock flow
- [ ] Test promo codes
- [ ] Test offline functionality
- [ ] Test Supabase data sync

---

## 🚀 Deployment Steps

1. **Create Play Console Account** ($25 one-time fee)
2. **Create App** in Play Console
3. **Upload AAB/APK** (Release → Production)
4. **Fill Store Listing**
5. **Complete Content Rating**
6. **Set Pricing** (Free with in-app purchases)
7. **Submit for Review**

---

## ⚠️ Important Notes

- **First review**: Takes 3-7 days
- **Updates**: Usually 1-2 days
- **Rejection reasons**: Privacy policy, permissions, content rating
- **AAB vs APK**: Google requires AAB for new apps

---

## 🔧 Quick Commands

```bash
# Build production
npm run build && npx cap sync android

# Open in Android Studio
npx cap open android

# Generate signed bundle
cd android && ./gradlew bundleRelease
```

**Output location**: `android/app/build/outputs/bundle/release/app-release.aab`
