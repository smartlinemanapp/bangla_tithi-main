# Vercel Deployment Guide

## Quick Deploy (5 minutes)

### Step 1: Sign Up
1. Go to [vercel.com/signup](https://vercel.com/signup)
2. Click "Continue with GitHub"
3. Authorize Vercel to access your repositories

### Step 2: Import Project
1. Click "Add New..." → "Project"
2. Find `smartlinemanapp/bangla_tithi-main` in the list
3. Click "Import"

### Step 3: Configure (Auto-detected)
Vercel will automatically detect:
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

**Environment Variables** (Add these):
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

### Step 4: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. You'll get a URL like: `https://bangla-tithi-main.vercel.app`

### Step 5: Use for Razorpay
Copy that Vercel URL and paste it into Razorpay registration!

## Custom Domain (Optional)
You can add a custom domain later in Vercel settings.
