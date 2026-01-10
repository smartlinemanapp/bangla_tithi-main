
// Scripts to migrate local tithi.json to Supabase
// Run with: npx ts-node scripts/migrate-to-supabase.ts

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load env vars
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY; // Needs Service Role for writing!

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_SERVICE_ROLE_KEY in .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const migrate = async () => {
    console.log('Starting migration...');

    // 1. Read local file
    // Need to resolve path relative to this script
    const localPath = path.resolve('./public/tithi.json');
    // Assuming script is run from root

    if (!fs.existsSync(localPath)) {
        console.error('Could not find tithi.json at', localPath);
        return;
    }

    const rawData = fs.readFileSync(localPath, 'utf-8');
    const tithis = JSON.parse(rawData);

    console.log(`Found ${tithis.length} tithi entries locally.`);

    // 2. Transform and Upsert
    // We'll batch them to avoid hitting limits
    const BATCH_SIZE = 100;

    for (let i = 0; i < tithis.length; i += BATCH_SIZE) {
        const batch = tithis.slice(i, i + BATCH_SIZE);

        const rows = batch.map((t: any) => ({
            date: t.date,
            type: t.event?.type || 'Normal',
            data: t // Storing full object as JSONB for flexibility
        }));

        const { error } = await supabase
            .from('tithi_events')
            .upsert(rows, { onConflict: 'date' });

        if (error) {
            console.error(`Error migrating batch ${i}:`, error);
        } else {
            console.log(`Migrated batch ${i} - ${i + batch.length}`);
        }
    }

    console.log('Migration complete!');
};

migrate();
