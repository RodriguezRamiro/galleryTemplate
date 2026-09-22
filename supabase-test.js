const SUPABASE_URL =
    "https://sgsenlnkfpfvgewhqgxn.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_AxfG5N0Ottos-nLjkXMmHA_iRN10Sqf";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

async function testSupabase() {
    const { data, error } = await supabaseClient
        .from("artworks")
        .select("catalog_number, title, published, featured")
        .eq("catalog_number", "001")
        .single();

    if (error) {
        console.error("Supabase database error:", error);
        return;
    }

    console.log("Artwork retrieved from Supabase:", data);
}

testSupabase();