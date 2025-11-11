/**
 * Quick script to seed buyers data via API
 * This script loads env vars and calls the seed API
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

async function seedData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = `${baseUrl}/api/seed-buyers-data`;

  try {
    console.log('Seeding buyers data...');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ ${result.message}`);
      console.log(`Inserted: ${result.inserted || 0} entries`);
      if (result.data) {
        console.log('\nInserted buyers:');
        result.data.forEach((buyer: any, index: number) => {
          console.log(`${index + 1}. ${buyer.title} (${buyer.category})`);
        });
      }
    } else {
      console.error(`❌ Error: ${result.message}`);
      if (result.error) {
        console.error(`Details: ${result.error}`);
      }
    }
  } catch (error) {
    console.error('Failed to seed data:', error);
    console.log('\nMake sure the Next.js dev server is running (npm run dev)');
  }
}

seedData();

