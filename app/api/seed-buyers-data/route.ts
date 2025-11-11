import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

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
  },
];

export async function POST(request: Request) {
  try {
    const supabase = createServiceRoleClient();

    // Check if sample data already exists by checking for specific titles
    const sampleTitles = sampleBuyers.map((buyer) => buyer.title);
    const { data: existingData, error: checkError } = await supabase
      .from("buyers_data")
      .select("title")
      .in("title", sampleTitles);

    if (checkError) {
      console.error("Error checking existing data:", checkError);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to check existing data.",
        },
        { status: 500 }
      );
    }

    // Filter out buyers that already exist
    const existingTitles = new Set(
      existingData?.map((item) => item.title) || []
    );
    const buyersToInsert = sampleBuyers
      .filter((buyer) => !existingTitles.has(buyer.title))
      .map((buyer) => ({
        ...buyer,
        status: "Active",
      }));

    // If all sample titles already exist, skip insertion
    if (buyersToInsert.length === 0) {
      return NextResponse.json({
        success: true,
        message: "All sample data already exists in database. Skipping insertion.",
        inserted: 0,
      });
    }

    // Insert only the buyers that don't exist yet
    const { data, error } = await supabase
      .from("buyers_data")
      .insert(buyersToInsert)
      .select();

    if (error) {
      console.error("Failed to insert sample buyers data:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Unable to insert sample buyers data. Please try again later.",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully inserted ${data?.length || 0} sample buyer entries.`,
      inserted: data?.length || 0,
      data,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check if sample data exists
export async function GET() {
  try {
    const supabase = createServiceRoleClient();

    const { data, error, count } = await supabase
      .from("buyers_data")
      .select("*", { count: "exact" })
      .eq("status", "Active")
      .limit(10);

    if (error) {
      console.error("Error fetching buyers data:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch buyers data.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      count: count || 0,
      hasData: (count || 0) > 0,
      sampleData: data || [],
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}

