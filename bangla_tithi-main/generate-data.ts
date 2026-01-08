/**
 * ONE-TIME SCRIPT: Generate static Tithi data for 2026-2028
 * 
 * Instructions:
 * 1. Create a .env.local file with your GEMINI_API_KEY
 * 2. Run: npx tsx generate-data.ts
 * 3. This will create tithi-data.json in the project root
 * 4. After running once, you can delete this file and remove the API key
 */

import { GoogleGenAI, Type } from "@google/genai";
import * as fs from 'fs';

interface TithiEvent {
  date: string;
  name: string;
  banglaName: string;
  startDateTime: string;
  endDateTime: string;
  description: string;
  type: 'Purnima' | 'Amavasya' | 'Pratipada' | 'Ekadashi' | 'Festival' | 'Other';
}

const generateTithiData = async () => {
  console.log('🌙 Generating Tithi data for 2026-2028...\n');

  // Read API key from environment
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    console.error('❌ Error: GEMINI_API_KEY not found in environment variables');
    console.log('Please create a .env.local file with: GEMINI_API_KEY=your_key_here');
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const allTithis: TithiEvent[] = [];
  
  // Generate data for 3 years (2026-2028)
  for (let year = 2026; year <= 2028; year++) {
    console.log(`📅 Generating data for ${year}...`);
    
    for (let month = 1; month <= 12; month++) {
      const prompt = `Generate a JSON list of major Hindu/Bangla Tithis (Lunar phases) and significant Bengali Festivals (Pujas) for ${month}/${year}.
      Include Purnima, Amavasya, Pratipada, Ekadashi, and major Festivals like Durga Puja, Lakshmi Puja, Kali Puja, Saraswati Puja, etc.
      Ensure dates are accurate for the India/Bangladesh region (IST/BST timezone: Asia/Kolkata). 
      Each entry must have: 
      - date: The Gregorian date (YYYY-MM-DD) on which the event is primarily observed.
      - name: English name
      - banglaName: in Bengali script
      - startDateTime: Absolute ISO 8601 timestamp of when the Tithi or Puja mahuratam begins (with timezone).
      - endDateTime: Absolute ISO 8601 timestamp of when it ends (with timezone).
      - description: English significance
      - type: One of: Purnima, Amavasya, Pratipada, Ekadashi, Festival, Other.
      Ensure the output is strictly a valid JSON array.`;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash-exp",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  date: { type: Type.STRING },
                  name: { type: Type.STRING },
                  banglaName: { type: Type.STRING },
                  startDateTime: { type: Type.STRING },
                  endDateTime: { type: Type.STRING },
                  description: { type: Type.STRING },
                  type: { type: Type.STRING }
                },
                required: ["date", "name", "banglaName", "startDateTime", "endDateTime", "type"]
              }
            }
          }
        });

        const monthData = JSON.parse(response.text || "[]");
        allTithis.push(...monthData);
        console.log(`  ✓ ${month}/${year}: ${monthData.length} events`);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`  ✗ Error generating data for ${month}/${year}:`, error);
      }
    }
  }

  // Sort by date
  allTithis.sort((a, b) => a.date.localeCompare(b.date));

  // Save to file
  const outputPath = './tithi-data.json';
  fs.writeFileSync(outputPath, JSON.stringify(allTithis, null, 2), 'utf-8');
  
  console.log(`\n✅ Success! Generated ${allTithis.length} Tithi events`);
  console.log(`📁 Saved to: ${outputPath}`);
  console.log('\n🎉 You can now:');
  console.log('   1. Delete this script (generate-data.ts)');
  console.log('   2. Remove your API key from .env.local');
  console.log('   3. Update your app to use tithi-data.json');
};

generateTithiData().catch(console.error);
