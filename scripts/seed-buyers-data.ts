/**
 * Script to seed the database with sample buyers data
 * Run this with: npx tsx scripts/seed-buyers-data.ts
 * Or: ts-node scripts/seed-buyers-data.ts
 */

import { createClient } from "@supabase/supabase-js";

// Sample buyers data - all 12 entries without dates
const sampleBuyers = [
  {
    title: "Wanted : Scrap Like Copper Scrap",
    buyer_from: "Singapore, Singapore, Singapore",
    quantity: "200 - 500 Metric Tons",
    destination: "India",
    payment_terms: "L/C Or T/T",
    looking_suppliers_from: "Worldwide",
    description: "Please provide a quotation to the following requirement from importer",
    category: "Metals", // "Metal Scraps" -> "Metals"
    status: "Active",
  },
  {
    title: "Wanted : Premium Cotton Fabric",
    buyer_from: "New York, USA",
    quantity: "1000 - 2000 Yards",
    destination: "Bangladesh",
    payment_terms: "T/T Advance",
    looking_suppliers_from: "Asia",
    description: "Looking for high-quality cotton fabric for manufacturing",
    category: "Textiles",
    status: "Active",
  },
  {
    title: "Wanted : Industrial Machinery Parts",
    buyer_from: "Berlin, Germany",
    quantity: "50 - 100 Units",
    destination: "Germany",
    payment_terms: "L/C at Sight",
    looking_suppliers_from: "Worldwide",
    description: "Require industrial machinery parts for manufacturing unit",
    category: "Machinery",
    status: "Active",
  },
  {
    title: "Wanted : Organic Green Tea",
    buyer_from: "Tokyo, Japan",
    quantity: "500 - 1000 Kg",
    destination: "Japan",
    payment_terms: "L/C 30 Days",
    looking_suppliers_from: "India, China, Sri Lanka",
    description: "Seeking premium quality organic green tea",
    category: "Agriculture", // "Food & Beverages" -> "Agriculture"
    status: "Active",
  },
  {
    title: "Wanted : Crude Oil",
    buyer_from: "Dubai, UAE",
    quantity: "10000 - 20000 Barrels",
    destination: "UAE",
    payment_terms: "T/T or L/C",
    looking_suppliers_from: "Middle East, Africa",
    description: "Regular requirement for crude oil supply",
    category: "Energy", // "Oil & Gas" -> "Energy"
    status: "Active",
  },
  {
    title: "Wanted : Handmade Carpets",
    buyer_from: "London, UK",
    quantity: "200 - 500 Pieces",
    destination: "UK",
    payment_terms: "T/T 50% Advance",
    looking_suppliers_from: "India, Pakistan, Iran",
    description: "Premium handmade carpets for retail business",
    category: "Textiles", // "Home Decor" -> "Textiles"
    status: "Active",
  },
  {
    title: "Wanted : Fresh Fruits",
    buyer_from: "Sydney, Australia",
    quantity: "5000 - 10000 Kg",
    destination: "Australia",
    payment_terms: "T/T Net 30",
    looking_suppliers_from: "Asia, South America",
    description: "Regular import of fresh seasonal fruits",
    category: "Agriculture",
    status: "Active",
  },
  {
    title: "Wanted : Timber & Wood Products",
    buyer_from: "Toronto, Canada",
    quantity: "1000 - 2000 Cubic Meters",
    destination: "Canada",
    payment_terms: "L/C or T/T",
    looking_suppliers_from: "North America, Europe",
    description: "Sustainable timber and wood products required",
    category: "Construction", // "Forestry" -> "Construction"
    status: "Active",
  },
  {
    title: "Wanted : Wine & Spirits",
    buyer_from: "Paris, France",
    quantity: "500 - 1000 Bottles",
    destination: "France",
    payment_terms: "L/C at Sight",
    looking_suppliers_from: "Europe, South America",
    description: "Premium wine and spirits for distribution",
    category: "Agriculture", // "Beverages" -> "Agriculture"
    status: "Active",
  },
  {
    title: "Wanted : Luxury Leather Goods",
    buyer_from: "Milan, Italy",
    quantity: "100 - 500 Pieces",
    destination: "Italy",
    payment_terms: "T/T 30% Advance",
    looking_suppliers_from: "Europe, Asia",
    description: "High-end leather goods for fashion industry",
    category: "Textiles", // "Fashion" -> "Textiles"
    status: "Active",
  },
  {
    title: "Wanted : Olive Oil",
    buyer_from: "Madrid, Spain",
    quantity: "2000 - 5000 Liters",
    destination: "Spain",
    payment_terms: "L/C 60 Days",
    looking_suppliers_from: "Mediterranean, Europe",
    description: "Extra virgin olive oil for retail",
    category: "Agriculture", // "Food & Beverages" -> "Agriculture"
    status: "Active",
  },
  {
    title: "Wanted : Tulip Bulbs",
    buyer_from: "Amsterdam, Netherlands",
    quantity: "10000 - 20000 Bulbs",
    destination: "Netherlands",
    payment_terms: "T/T Net 45",
    looking_suppliers_from: "Europe, Asia",
    description: "Quality tulip bulbs for horticulture",
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
    // Check if data already exists
    const { data: existingData, error: checkError } = await supabase
      .from("buyers_data")
      .select("id")
      .limit(1);

    if (checkError) {
      console.error("Error checking existing data:", checkError);
      process.exit(1);
    }

    if (existingData && existingData.length > 0) {
      console.log("Sample data already exists in database. Skipping insertion.");
      console.log("If you want to insert again, please clear the buyers_data table first.");
      return;
    }

    // Insert all sample buyers
    const { data, error } = await supabase
      .from("buyers_data")
      .insert(sampleBuyers)
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

