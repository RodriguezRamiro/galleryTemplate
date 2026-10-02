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

    await loadDashboardExhibitions();
}


/* =====================================================
   Sign Out
===================================================== */

const signOutButton =
    document.querySelector("#admin-sign-out");

signOutButton.addEventListener("click", async () => {

    signOutButton.disabled = true;
    signOutButton.textContent = "Signing out...";

    const { error } =
        await window.supabaseClient.auth.signOut();

    if (error) {

        console.error(
            "Unable to sign out:",
            error
        );

        signOutButton.disabled = false;
        signOutButton.textContent = "Sign Out";

        dashboardMessage.textContent =
            "Unable to sign out. Please try again.";

        return;
    }

    window.location.href = "./admin.html";
});

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
   Load Exhibition Data
===================================================== */

async function loadDashboardExhibitions() {

    const { data, error } =
        await window.supabaseClient
            .from("exhibitions")
            .select(`
                id,
                title,
                description,
                status,
                sort_order,
                created_at
            `)
            .order("sort_order", {
                ascending: true
            });

        if (error) {

            console.error(
                "Unable to load dashbaord exhibitions:",
                error
            );

            dashboardMessage.textContent =
                "Unable to load exhibitions.";

            return;
        }

        console.log(
            "Dashboard exhibitions loaded:",
            data
        );

        const exhibitionCount =
            document.querySelector("#exhibition-count");

        exhibitionCount.textContent =
            data.length;

        renderDashboardExhibitions(data);
}


/* =====================================================
   Render Exhibition List
===================================================== */


function renderDashboardExhibitions(exhibitions) {

    const exhibitionList =
        document.querySelector("#admin-exhibition-list");

    if (!exhibitionList) {

        console.error(
            "exhibition list element was not found."
        );

        return;

        if (!exhibitions.length) {

            exhibitionList.innerHtml = `
                <p class="admin-message">
                    No exhibitions found.
                </p>
                `;
                return;
        }

        exhibitionList.innerHTML =
            exhibitions.map(exhibition => `
            <article class="admin-exhibition-item">

            <div class="admin-exhibition-details">

            <p class="admin-exhibition-details">

            <p class="admin-eyebrow">
            Exhibition
            </p>

            <h3>
                ${exhibition.title}
            </h3>

            <p>
                ${exhibition.status}
            </p>

            </div>

            </article>
            `).join("");
    }
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