/* //galleryTemplate/exhibitions.js */

/* =====================================================
   EXHIBITION DATA

   Loads published exhibitions from Supabase.
===================================================== */

async function loadPublishedExhibitions() {

    const { data, error } = await window.supabaseClient
        .from("exhibitions")
        .select("id, title, description, status, sort_order")
        .eq("status", "published")
        .order("sort_order", { ascending: false });

    if (error) {

        console.error(
                "unable to load published exhibitions:",
                error
        );

        return [];
    }

    console.log(
        "Published exhibitions loaded:",
        data
    )

    return data;
}



/* =====================================================
   TEMPORARY DATA LOADER TEST
===================================================== */

loadPublishedExhibitions();
