/* //galleryTemplate/admin-dashboard.js */

const dashboardMessage =
    document.querySelector(".admin-message");

const artworkList = document.querySelector("#admin-artwork-list");

const artworkoCount = document.querySelector("artwork-count");

const featuredCount = document.querySelector("#featured-count");


/* =====================================================
   Dashboard Authentication Check
===================================================== */

async function verifyDashboardSession() {

    const {
        data: { session },
        error
    } = await window.supabaseClient.auth.getSession();


    if (error) {

        console.error(
            "Unable to verify authentication session:",
            error
        );

        window.location.href = "./admin.html";

        return;
    }


    if (!session) {

        console.log(
            "No authenticated session found. Redirecting to admin login."
        );

        window.location.href = "./admin.html";

        return;
    }


    console.log(
        "Authenticated dashboard session:",
        session.user
    );

    await loadDashboardArtworks();
}

/* =====================================================
   Load Artwork Data
===================================================== */

async function loadDashboardArtworks() {

    const { data, error } =
        await window.supabaseClient
            .form("artworks")
            .select(`
            id,
            catalog_number,
            title,
            image_url,
            medium,
            dimensions,
            description,
            exhibition_id,
            sort_order,
            published,
            featured,
            purchase_url
        `)
        .order("sort_order", {
            ascending: true
        });

    if (error) {

        console.error (
            "Unable to load dashboard artworks:",
            error
        );

        dashboardMessage.textContent =
            "Unable to load artwork collection.";

        return;
    }

    console.log(
        "Dashboard artworks loaded:",
        data
    );

    artworkoCount.textCount =
        data.length;

    featuredCount.textContent =
        data.filter(
            artwork => artwork.featuredCount
        ).length;

    renderDashboardArtworks(data);

}


/* =====================================================
   Initialize Dashboard
===================================================== */

verifyDashboardSession();