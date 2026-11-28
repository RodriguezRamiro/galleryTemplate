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
                "Unable to load published exhibitions:",
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
   EXHIBITION ARTWORK

   Loads published artwork assigned to exhibitions.
===================================================== */

async function loadPublishedExhibitionArtworks(){

    const { data, error } = await window.supabaseClient
        .from("artworks")
        .select(`
            id,
            title,
            image_url,
            exhibition_id,
            sort_order
            `)
            .eq("published", true)
            .not("exhibition_id", "is", null)
            .order("sort_order", {ascending: false });

    if (error) {

        console.error(
            "Unable to load exhibition artwork:",
            error
        );

        return [];
    }

    console.log(
        "Published exhibition artwork loaded:",
        data
    );

    return data;
}


/* =====================================================
   ARCHIVE INITIALIZATION

   Loads the data required by the exhibition archive.
===================================================== */

async function initializeExhibitionArchive() {

    const [
        exhibitions,
        artworks
    ] = await Promise.all([
        loadPublishedExhibitions(),

        loadPublishedExhibitionArtworks()

    ]);

    console.log(
            "Exhibition archive data ready:",
            {
                exhibitions,
                artworks
            }
    );

}



/* =====================================================
   FEATURED EXHIBITION

   Renders the leading published exhibition.
===================================================== */

function renderFeaturedExhibition(exhibition, artwork) {

    const featuredContainer =
        document.querySelector("#featured-exhibition");

    if (!featuredContainer) {

        console.error(
            "Featured exhibition container not found."
        );

        return;
    }

    if (!exhibition || !artwork) {

        console.warn(
            "Featured exhibition or representative artwork is missing."
        );

        return
    }
}