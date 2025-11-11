/**
 * Script to seed the database with sample buyers data
 * Run this with: npx tsx scripts/seed-buyers-data.ts
 * Or: ts-node scripts/seed-buyers-data.ts
 */

import { createClient } from "@supabase/supabase-js";
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local or .env
config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

// Sample buyers data - 10 entries matching the wanted products
const sampleBuyers = [
  {
    title: "Wanted : Fruits & Vegetables",
    buyer_from: "New York, USA",
    quantity: "5000 - 10000 Kg",
    destination: "USA",
    payment_terms: "T/T Net 30",
    looking_suppliers_from: "Asia, South America",
    description: "Regular requirement for fresh and high-quality fruits and vegetables for global export markets",
    category: "Agriculture",
    status: "Active",
  },
  {
    title: "Wanted : Readymade Garments (Textile Products)",
    buyer_from: "London, UK",
    quantity: "1000 - 2000 Pieces",
    destination: "UK",
    payment_terms: "T/T 50% Advance",
    looking_suppliers_from: "India, Bangladesh, China",
    description: "Premium ready-made garments and textile products for international buyers",
    category: "Textiles",
    status: "Active",
  },
  {
    title: "Wanted : Spices Product",
    buyer_from: "Dubai, UAE",
    quantity: "2000 - 5000 Kg",
    destination: "UAE",
    payment_terms: "L/C or T/T",
    looking_suppliers_from: "India, Sri Lanka, Middle East",
    description: "Premium spices and condiments sourced for global culinary markets",
    category: "Agriculture",
    status: "Active",
  },
  {
    title: "Wanted : Engineering Product",
    buyer_from: "Berlin, Germany",
    quantity: "50 - 100 Units",
    destination: "Germany",
    payment_terms: "L/C at Sight",
    looking_suppliers_from: "Worldwide",
    description: "Precision engineering products and machinery components for industrial use",
    category: "Machinery",
    status: "Active",
  },
  {
    title: "Wanted : Handicraft Product",
    buyer_from: "Paris, France",
    quantity: "200 - 500 Pieces",
    destination: "France",
    payment_terms: "T/T 30% Advance",
    looking_suppliers_from: "India, Pakistan, Iran, Asia",
    description: "Exquisite handcrafted products and traditional artisanal items for global markets",
    category: "Textiles",
    status: "Active",
  },
  {
    title: "Wanted : Jems & Jwellery",
    buyer_from: "Tokyo, Japan",
    quantity: "100 - 500 Pieces",
    destination: "Japan",
    payment_terms: "L/C 30 Days",
    looking_suppliers_from: "India, Thailand, China",
    description: "Exquisite gems and fine jewellery sourced for export to global markets",
    category: "Textiles",
    status: "Active",
  },
  {
    title: "Wanted : Building Materials",
    buyer_from: "Toronto, Canada",
    quantity: "1000 - 2000 Cubic Meters",
    destination: "Canada",
    payment_terms: "L/C or T/T",
    looking_suppliers_from: "North America, Europe, Asia",
    description: "High-quality building materials and construction supplies for international projects",
    category: "Construction",
    status: "Active",
  },
  {
    title: "Wanted : Rubber Products",
    buyer_from: "Singapore, Singapore",
    quantity: "200 - 500 Metric Tons",
    destination: "Singapore",
    payment_terms: "L/C Or T/T",
    looking_suppliers_from: "Worldwide",
    description: "Durable rubber products and industrial rubber components for various applications",
    category: "Chemicals",
    status: "Active",
  },
  {
    title: "Wanted : Scrap Products",
    buyer_from: "Mumbai, India",
    quantity: "500 - 1000 Metric Tons",
    destination: "India",
    payment_terms: "T/T Advance",
    looking_suppliers_from: "Worldwide",
    description: "Recyclable scrap materials and metal products for sustainable industrial use",
    category: "Metals",
    status: "Active",
  },
  {
    title: "Wanted : Vermi compost",
    buyer_from: "Sydney, Australia",
    quantity: "5000 - 10000 Kg",
    destination: "Australia",
    payment_terms: "T/T Net 30",
    looking_suppliers_from: "India, Asia",
    description: "Organic vermicompost and natural fertilizers for sustainable agriculture",
    category: "Agriculture",
    status: "Active",
  },
];

async function seedBuyersData() {
  // Get Supabase credentials from environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Error: Missing Supabase environment variables");
    console.error("Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    // Check if sample data already exists by checking for specific titles
    const sampleTitles = sampleBuyers.map((buyer) => buyer.title);
    const { data: existingData, error: checkError } = await supabase
      .from("buyers_data")
      .select("title")
      .in("title", sampleTitles);

    if (checkError) {
      console.error("Error checking existing data:", checkError);
      process.exit(1);
    }

    // Filter out buyers that already exist
    const existingTitles = new Set(
      existingData?.map((item) => item.title) || []
    );
    const buyersToInsert = sampleBuyers.filter(
      (buyer) => !existingTitles.has(buyer.title)
    );

    if (buyersToInsert.length === 0) {
      console.log("All sample data already exists in database. Skipping insertion.");
      console.log("If you want to insert again, please delete the existing entries first.");
      return;
    }

    console.log(`Inserting ${buyersToInsert.length} new buyer entries...`);

    // Insert only the buyers that don't exist yet
    const { data, error } = await supabase
      .from("buyers_data")
      .insert(buyersToInsert)
      .select();

    if (error) {
      console.error("Failed to insert sample buyers data:", error);
      process.exit(1);
    }

    console.log(`✅ Successfully inserted ${data?.length || 0} sample buyer entries.`);
    console.log("\nInserted buyers:");
    data?.forEach((buyer, index) => {
      console.log(`${index + 1}. ${buyer.title} (${buyer.category})`);
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    process.exit(1);
  }
}

// Run the seed function
seedBuyersData();

