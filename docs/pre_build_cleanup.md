# 🧹 Pre-Build Cleanup & Data Safety Guide

## Files Safe to Keep (NOT garbage)

| File/Folder | Purpose | Included in Build? |
|-------------|---------|-------------------|
| `*.sql` files | Supabase setup scripts | ❌ No (dev only) |
| `.env`, `.env.local` | API keys (local dev) | ❌ No (gitignored) |
| `scripts/` | Migration tools | ❌ No (dev only) |
| `docs/` | Documentation | ❌ No (dev only) |
| `node_modules/` | Dependencies | ❌ No (installed separately) |
| `dist/` | Web build output | ✅ Yes → Android assets |
| `android/` | Native Android project | ✅ Yes |
| `tithi.json` | Fallback calendar data | ✅ Yes (in dist) |

## Pre-Build Cleanup Commands

```bash
# Clean old builds
rm -rf dist
rm -rf android/app/build

# Clean Capacitor cache (if issues)
rm -rf android/app/src/main/assets/public

# Clean npm (rarely needed)
rm -rf node_modules
npm install

# Rebuild fresh
npm run build
npx cap sync android
```

## Files to NEVER Commit (Already in .gitignore)

- `.env` / `.env.local` - Contains Supabase keys
- `android/app/release/*.aab` - Signed builds
- `*.jks` - Keystore files

---

# 🔐 Data Safety for Play Store

## Your App Collects:

| Data Type | Collected? | Reason |
|-----------|------------|--------|
| **Location** | ✅ Approximate | Sunrise/sunset times |
| **Device ID** | ❌ No | - |
| **Personal Info** | ❌ No | - |
| **Payment Info** | ❌ No (disabled) | - |

## Data Safety Form Answers

When filling the Play Console Data Safety form:

### "Does your app collect or share user data?"
**Answer: Yes** (we use approximate location for sunrise times)

### "Data Collection"
| Question | Answer |
|----------|--------|
| Is data collected? | Yes |
| What data is collected? | **Location (approximate)** |
| Is data shared with third parties? | **No** |
| Is collection required or optional? | **Optional** (app works without) |

### "Security Practices"
| Question | Answer |
|----------|--------|
| Is data encrypted in transit? | **Yes** (HTTPS) |
| Can users request data deletion? | **Yes** (via contact email) |
| Data retention period | **Not stored on server** |

### "Data Types Details"

**Approximate Location:**
- Collected to show accurate sunrise/sunset times
- Processed on device only
- Not stored or transmitted

---

## Third-Party SDKs

| SDK | Data Collected | Purpose |
|-----|---------------|---------|
| Capacitor Local Notifications | ❌ None | Reminder alerts |
| RevenueCat | ❌ Disabled | (Not active) |
| Supabase | Calendar data only | Data sync |

---

## Privacy Policy Requirement

Google Play requires a **Privacy Policy** URL. Create one at:
- [privacypolicies.com](https://www.privacypolicies.com/) (free)
- Host at: `https://yourdomain.com/privacy`

Your policy should mention:
1. Approximate location usage for sunrise times
2. Data stays on device
3. Calendar data from Supabase
4. Contact email for deletion requests
