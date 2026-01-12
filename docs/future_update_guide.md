# 📦 Future App Update Guide

## Quick Update Process

### 1. Code Changes
```bash
# Make your changes, then:
npm run build
npx cap sync android
```

### 2. Version Bump
Edit `android/app/build.gradle`:
```gradle
android {
    defaultConfig {
        versionCode 2          // Increment this (1 → 2 → 3...)
        versionName "1.0.1"    // Update display version
    }
}
```

### 3. Build AAB
1. Open Android Studio: `npx cap open android`
2. Build > Generate Signed Bundle > Android App Bundle
3. Select existing keystore
4. Enter passwords
5. Build Release

### 4. Upload to Play Console
1. Go to Play Console > Your App > Production
2. Click "Create new release"
3. Upload new AAB
4. Add release notes
5. Review and submit

---

## Re-enabling Premium Features

When ready to monetize, uncomment these in `App.tsx`:

```tsx
// 1. Uncomment import
import { LicenseModal } from './components/LicenseModal';

// 2. Change isPremium back to dynamic
const [isPremium, setIsPremium] = useState(getLicenseStatus());

// 3. Uncomment RevenueCat init
import('./services/purchases').then(({ initializePurchases }) => {
    initializePurchases();
});

// 4. Uncomment LicenseModal JSX
<LicenseModal
    isOpen={isLicenseModalOpen}
    onClose={() => setIsLicenseModalOpen(false)}
    onSuccess={() => setIsPremium(true)}
/>
```

Then follow `docs/google_play_billing_setup.md` to configure RevenueCat.

---

## Version History Template

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-13 | Initial release |
| 1.1.0 | TBD | Premium features |

---

## 📅 Managing Calendar Data

### Data Location
The calendar data is stored in: `tithi.json`

### 🌐 Online Data Sync (Supabase)
Your app is configured to sync data from **Supabase** when available!

**How it works:**
1. App checks if Supabase is configured (`services/supabase.ts`)
2. If yes → fetches from `tithi_events` table
3. If no/fails → falls back to local `tithi.json`
4. Real-time updates via Supabase Realtime subscription

**Supabase Table: `tithi_events`**
| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Auto-generated |
| `date` | text | Date (YYYY-MM-DD) |
| `type` | text | Event type |
| `data` | jsonb | Full TithiEvent object |

**Adding Data via Supabase Dashboard:**
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Table Editor** > `tithi_events`
4. Click **Insert row**
5. Fill the `data` column with the full JSON object

**Migration Script:**
To upload local `tithi.json` to Supabase:
```bash
npx ts-node scripts/migrate-to-supabase.ts
```

**Real-time Updates:**
When you edit data in Supabase, the app receives updates instantly! (No app update needed)

---

### 📁 Local Data (Fallback)

### Data Structure
Each entry follows this format:
```json
{
    "date": "2026-01-15",
    "weekday": {
        "en": "Thursday",
        "bn": "বৃহস্পতিবার"
    },
    "banglaDate": {
        "month": "পৌষ",
        "paksha": "কৃষ্ণপক্ষ",
        "tithi": "দ্বাদশী",
        "tithiType": "Normal"
    },
    "event": {
        "name": "Makar Sankranti",
        "banglaName": "মকর সংক্রান্তি",
        "type": "Festival, Ritual",
        "description": "পৌষ সংক্রান্তি। গঙ্গাসাগর স্নান ও পিঠে-পুলি উৎসবের পুণ্য দিন।",
        "startDateTime": "2026-01-15T00:00:00+05:30",
        "endDateTime": "2026-01-15T23:59:00+05:30"
    },
    "sun": {
        "sunrise": "06:20",
        "sunset": "17:18",
        "dayLength": "10h 58m",
        "nightLength": "13h 02m",
        "reference": "Kolkata"
    }
}
```

### Adding a New Event
1. Find the date entry in `tithi.json`
2. Add or modify the `event` object:
```json
"event": {
    "name": "Event English Name",
    "banglaName": "ইভেন্টের বাংলা নাম",
    "type": "Festival",  // Options: Festival, Purnima, Amavasya, Ekadashi, Ritual
    "description": "বাংলায় বিবরণ লিখুন।",
    "startDateTime": "2026-MM-DDTHH:MM:00+05:30",
    "endDateTime": "2026-MM-DDTHH:MM:00+05:30"
}
```

### Event Types
| Type | When to Use |
|------|-------------|
| `Festival` | Major celebrations (Durga Puja, Diwali) |
| `Purnima` | Full moon days |
| `Amavasya` | New moon days |
| `Ekadashi` | 11th day fasting |
| `Ritual` | Other religious occasions |

### Modifying Existing Data
1. Open `tithi.json` in VS Code
2. Use Ctrl+F to search for the date
3. Edit fields as needed
4. Validate JSON: Use online validator or VS Code will show errors

### Adding New Year Data
Currently data covers 2026. To add 2027+:
1. Calculate tithi dates using panchang
2. Follow the same JSON structure
3. Add sunrise/sunset from astronomical sources
4. Append to the array in `tithi.json`

### After Editing Data
```bash
npm run build
npx cap sync android
# Then rebuild in Android Studio
```

---

## Troubleshooting

### Build Fails
- Clean project: Build > Clean Project
- Invalidate caches: File > Invalidate Caches
- Delete `android/.gradle` folder and rebuild

### Upload Rejected
- Check for policy violations in Console email
- Verify Data Safety section is complete
- Ensure no placeholder content

### Keystore Lost
**You CANNOT recover a lost keystore.**
You must create a new app listing with a new package name.
Always backup: keystore file + passwords + key alias.
