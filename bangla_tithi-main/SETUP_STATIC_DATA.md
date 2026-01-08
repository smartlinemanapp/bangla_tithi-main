# 🌙 Static Data Generation Guide

This guide will help you generate static Tithi data to replace the Gemini API calls.

## Step 1: Install Dependencies

```bash
cd c:/Users/rouma/Desktop/Dipankar/bangla_tithi-main/bangla_tithi-main
npm install
```

This will install the `tsx` package needed to run the generation script.

## Step 2: Create Environment File

Create a file named `.env.local` in the project root with your Gemini API key:

```
GEMINI_API_KEY=your_api_key_here
```

**Note**: You can copy `.env.local.example` and rename it to `.env.local`

## Step 3: Generate Static Data

Run the generation script:

```bash
npm run generate-data
```

This will:
- Connect to Gemini API
- Generate Tithi data for 2026-2028 (36 months)
- Create `tithi-data.json` with ~1000-1500 events
- Take approximately 30-60 seconds

**Expected output:**
```
🌙 Generating Tithi data for 2026-2028...

📅 Generating data for 2026...
  ✓ 1/2026: 15 events
  ✓ 2/2026: 12 events
  ...
  
✅ Success! Generated 1234 Tithi events
📁 Saved to: ./tithi-data.json
```

## Step 4: Verify the Data

Check that `tithi-data.json` was created:
- File should be ~200-300 KB
- Contains array of TithiEvent objects
- Dates range from 2026 to 2028

## Step 5: Clean Up (Optional)

After successful generation:
1. **Delete** `.env.local` (no longer needed)
2. **Delete** `generate-data.ts` (one-time use only)
3. Keep `tithi-data.json` (this is your static data!)

## Step 6: Test the Application

```bash
npm run dev
```

Visit http://localhost:5173 and verify:
- ✅ App loads without errors
- ✅ Tithis display correctly
- ✅ No delay when switching months
- ✅ Clicking Tithi shows description
- ✅ No network requests to Gemini API (check DevTools)

## Troubleshooting

### Error: "GEMINI_API_KEY not found"
- Ensure `.env.local` exists in the project root
- Check the API key is correct
- Make sure there are no spaces around the `=` sign

### Error: "Cannot find module '@google/genai'"
- Run `npm install` first
- The `@google/genai` package should already be in dependencies

### Generated file is empty
- Check your internet connection
- Verify API key is valid
- Check API quota/limits

### App doesn't load data
- Ensure `tithi-data.json` is in the project root (same folder as `package.json`)
- Check browser console for errors
- Clear browser cache and reload

## What Changed?

**Before:**
- Made API calls to Gemini on every data request
- Required API key in production
- Subject to rate limits and costs
- Network delays

**After:**
- Loads data from local JSON file
- No API key needed in production
- Unlimited requests
- Instant loading

## Future Updates

When you need data for 2029+:
1. Update year range in `generate-data.ts` (lines 35-36)
2. Re-run `npm run generate-data`
3. Replace `tithi-data.json` with new file
