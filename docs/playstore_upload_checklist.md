# 🚀 Play Store Upload Checklist

## Pre-Upload Checklist ✓

### Code Preparation
- [ ] Run `npm run build` - verify no errors
- [ ] Run `npx cap sync android` - sync to native
- [ ] Test on real device or emulator
- [ ] Verify all features work correctly

### Android Studio Build
- [ ] Open Android Studio: `npx cap open android`
- [ ] Update `versionCode` in `android/app/build.gradle` (increment by 1)
- [ ] Update `versionName` (e.g., "1.0.0" → "1.0.1")
- [ ] Build > Generate Signed Bundle / APK
- [ ] Select "Android App Bundle (AAB)"
- [ ] Use existing keystore OR create new one
- [ ] **SAVE KEYSTORE FILE SAFELY** - you need it for ALL future updates
- [ ] Build Release bundle
- [ ] Locate AAB: `android/app/build/outputs/bundle/release/app-release.aab`
- [ ] **Locate Mapping File**: `android/app/build/outputs/mapping/release/mapping.txt`
  - *This is the "Deobfuscation File" Google Play is asking for. It allows you to see readable crash reports.*

### App Assets (First Upload Only)
- [ ] App Icon: 512x512 PNG (no alpha)
- [ ] Feature Graphic: 1024x500 PNG
- [ ] Screenshots: At least 2 phone screenshots
- [ ] Short Description: Max 80 characters
- [ ] Full Description: Max 4000 characters

### Play Console Setup
- [ ] Create new app in [Play Console](https://play.google.com/console)
- [ ] Fill Store Listing (title, descriptions, graphics)
- [ ] Complete Content Rating questionnaire
- [ ] Set Target Audience (likely "13+ / Everyone")
- [ ] Complete Data Safety form
- [ ] Set up App Pricing (Free)
- [ ] Upload AAB to Production/Internal Testing track

---

## Data Safety Answers (Template)

| Question | Answer |
|----------|--------|
| Data collected | Location (approximate, for sunrise times), Device identifiers |
| Data shared | No data shared with third parties |
| Security practices | Data encrypted in transit |
| Data deletion | Users can request via email |

---

## Keystore Information ⚠️
**CRITICAL: Save this info securely!**

| Field | Value |
|-------|-------|
| Keystore Path | `android/app/bangla-tithi-keystore.jks` |
| Keystore Password | (save separately) |
| Key Alias | `bangla-tithi` |
| Key Password | (save separately) |

---

## After Upload
- [ ] Wait for Google review (usually 1-7 days for new apps)
- [ ] Monitor for policy violations in Console
- [ ] Set up crash reporting email alerts
