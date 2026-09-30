/* //galleryTemplate/admin-dashboard.js */

const dashboardMessage =
    document.querySelector(".admin-message");

const artworkList = document.querySelector("#admin-artwork-list");

const artworkCount = document.querySelector("#artwork-count");

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
            .from("artworks")
            .select(`
                id,
                catalog_number,
                title,
                image_url,
                medium,
                year,
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

        console.error(
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


    artworkCount.textContent =
        data.length;


    featuredCount.textContent =
        data.filter(
            artwork => artwork.featured
        ).length;


    renderDashboardArtworks(data);
}


/* =====================================================
   Render Artwork List
===================================================== */

function renderDashboardArtworks(artworks) {

    if (!artworkList) {

        artworkList.innerHTML = `
            <p class="admin-message">
                No artworks found.
            </p>
            `;

            return;
    }

    artworkList.innerHTML =
        artworks.map(artwork => `

            <article class="admin-artwork-item">

                <div class="admin-artwork-image">

                    <img
                        src="${artwork.image_url || ""}"
                        alt="${artwork.title}"
                    >

                </div>


                <div class="admin-artwork-details">

                    <p class="admin-eyebrow">
                        ${artwork.catalog_number}
                    </p>

                    <h3>
                        ${artwork.title}
                    </h3>

                    <p>
                        ${artwork.medium || "Medium not specified"}
                        ${artwork.year ? ` · ${artwork.year}` : ""}
                    </p>

                    <p>
                        ${artwork.published
                            ? "Published"
                            : "Draft"}
                        ${artwork.featured
                            ? " · Featured"
                            : ""}
                    </p>

                </div>

            </article>

        `).join("");
}

/* =====================================================
   Initialize Dashboard
===================================================== */

verifyDashboardSession();