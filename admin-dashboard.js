/* //galleryTemplate/admin-dashboard.js */

const dashboardMessage = document.querySelector(".admin-message");

const artworkImage = document.querySelector("#artwork-image");

const artworkList = document.querySelector("#admin-artwork-list");

const artworkCount = document.querySelector("#artwork-count");

const featuredCount = document.querySelector("#featured-count");

const addArtworkButton = document.querySelector("#add-artwork-button");

const addArtworkPanel = document.querySelector("#add-artwork-panel");

const addArtworkForm = document.querySelector("#add-artwork-form");

const addArtworkMessage = document.querySelector("#add-artwork-message");

const addArtworkTitle = document.querySelector("#add-artwork-title");

const saveArtworkButton = addArtworkForm.querySelector('button[type="submit"]');

const cancelArtworkButton = document.querySelector("#cancel-artwork-button");

let editingArtworkId = null;

letEditingArtworkImageURl = null

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
   Edit Artwork — Load Existing Data
===================================================== */

artworkList.addEventListener("click", async (event) => {

    const editButton =
        event.target.closest(".edit-artwork-button");

    if (!editButton) {
        return;
    }

    const artworkId = editButton.dataset.artworkId;

    addArtworkMessage.textContent = "Loading artwork...";

    const { data: artwork, error } =
        await window.supabaseClient
            .from("artworks")
            .select("*")
            .eq("id", artworkId)
            .single();

    if (error) {
            console.error(
                "Unable to loadartwork for editng:",
                error
            );

            addArtworkMessage.textContent =
                "Unable to load artwork. Please try again.";

            return;
    }

    editingArtworkId = artwork.id;

    editingArtworkImageUrl = artwork.image_url;

    document.querySelector("#artwork-catalog").value =
        artwork.catalog_number || "";

    document.querySelector("#artwork-title").value =
        artwork.title || "";

    document.querySelector("#artwork-medium").value =
        artwork.medium || "";

        document.querySelector("#artwork-year").value =
        artwork.year ?? "";

    document.querySelector("#artwork-dimensions").value =
        artwork.dimensions || "";

    document.querySelector("#artwork-description").value =
        artwork.description || "";

    document.querySelector("#artwork-purchase-url").value =
        artwork.purchase_url || "";

    addArtworkTitle.textContent = "Edit Artwork";

    saveArtworkButton.textContent = "Save Changes";

    addArtworkMessage.textContent =
        "Artwork loaded for editing. Select a new image only if you want to replace it.";

    addArtworkPanel.hidden = false;

    addArtworkPanel.scrollIntoView({
            behavior: "smooth",
            block: "start"
    });

});

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
   Add Artwork Panel
===================================================== */

addArtworkButton.addEventListener("click", () => {

    editingArtworkId = null;

    addArtworkForm.reset();

    addArtworkTitle.textContent = "Add Artwork";

    saveArtworkButton.textContent = "Save Artwork";

    addArtworkPanel.hidden = false;

    addArtworkPanel.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

cancelArtworkButton.addEventListener("click", () => {


const addArtworkForm =
document.querySelector("#add-artwork-form");

const addArtworkMessage =
document.querySelector("#add-artwork-message");

const addArtworkTitle =
document.querySelector("#add-artwork-title");

const saveArtworkButton =
addArtworkForm.querySelector('button[type="submit"]');

let editingArtworkId = null;


    addArtworkPanel.hidden = true;

    editingArtworkId = null

    addArtworkForm.reset();

    addArtworkTitle.textContent = "Add Artwork";

    saveArtworkButton.textContent = "Save Artwork"

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
   Save Artwork
===================================================== */


addArtworkForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    addArtworkMessage.textContent =
        "Saving artwork...";


    const imageFile = artworkImage.files[0];

    // A new artwork must have an image.
    if (!editingArtworkId && !imageFile) {
            addArtworkMessage.textContent =
                "please select an artwork image.";
            return;
    }

    // Read the form fields.
    const catalogNumber =
        document.querySelector("#artwork-catalog").value.trim();

    const title =
        document.querySelector("#artwork-title").value.trim();

    const medium =
        document.querySelector("#artwork-medium").value.trim();

    const yearValue =
        document.querySelector("#artwork-year").value.trim();

    const dimensions =
        document.querySelector("#artwork-dimensions").value.trim();

    const description =
        document.querySelector("#artwork-description").value.trim();

    const purchaseUrl =
        document.querySelector("#artwork-purchase-url").value.trim();

    // Preserve the current image unless replacemne is selected.
    let imageUrl = editingArtworkImageUrl;

    // Upload an image only when a file has been selected.
    if (imageFile) {

    addArtworkMessage.textContent =
        "Uploading artwork image...";

    const fileExtension =
            imageFile.name.split(".").pop();

    const fileName = `${crypto.randomUUID()}.${fileExtension}`;

    const filePath = fileName;

    const { error: uploadError } =
        await window.supabaseClient
            .storage
            .from("artworks")
            .upload(filePath, imageFile);

    if (uploadError) {

        console.error(
                "Unable to upload arwork image:",
                uploadError
        );

        addArtworkMessage.textContent =
            "Unable to upload arrwork image. Please try again.";

        return;
    }

    const { data: publicUrlData } =
        window.supabaseClient
            .storage
            .from("artworks")
            .getPublicUrl(filePath);

    imageUrl =
        publicUrlData.publicUrl

}

// Build the editable fields shared by both operations.

const artworkData = {
    catalog_number: catalogNumber,
    title: title,
    image_url: imageUrl,
    medium: medium || null,
    year: yearValue ? Number(yearValue) : null,
    dimensions: dimensions || null,
    description: description || null,
    purchase_url: purchaseUrl || null
};

    // EDIT: update the existing record by its UUID.
    // ADD: insert a new record with the default dashboard settings.

    let error;

    if (editingArtworkId) {

        const result =
            await window.supabaseClient
                .from("artworks")
                .update(artworkData)
                .eq("id", editingArtworkId);

        error = result.error;

    } else {

        const result = await window.supabaseClient
                            from("artworks")
                            .insert({
                                ...artworkData,
                                exhibition_id: null,
                                sort_order: 0,
                                published: false,
                                featured: flase
                            });

                            error = result.error;
    }

    // Report database errors without resetting the form.
    if(error) {
        console.error("Unable to save artwork:", error);

        addArtworkMessage.textContent =
            "unable to save artwork. Please try again.";

        return;
    }

    console.log(
            editingArtworkId
            ? "artwork updated successfully."
            : "artwork added successfully."

    );

    addArtworkMessage.textContent = editingArtworkId
            ? "Artwork updated successfully."
            : "Artwork added successfully.";

    // Reset the form to add Artwork mode.
    editingArtworkId = null;
    editingArtworkImageUrl = null;

    addArtworkForm.reset();

    addArtworkTitle.textContent = "Add Artwork";
    saveArtworkButton.textContent = "Save Artwork";

    // Refresh the dashboard.
    await loadDashboardArtworks();

});


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
        console.error(
            "Artwork list element was not found."
        );

        return;
    }

    if (!artworks || artworks.length === 0) {



        artworkList.innerHTML = `
        <p class="admin-message">
        No artworks found.
        </p>
        `;

        return;

    }

    artworkList.innerHTML =
        artworks.map(artwork => `

            <article class="admin-artwork-item"
                     data-artwork-id="${artwork.id}"
                     >

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

                <button
                        type="button"
                        class="admin-submit edit-artwork-button"
                        data-artwork-id="${artwork.id}"
                    >
                    Edit
                    </button>

                    <button
                    type="button"
                    class="admin-submit toggle-published-button"
                    data-artwork-id="${artwork.id}"
                    data-published="${artwork.published}"
                >
                    ${artwork.published ? "Unpublish" : "Publish"}
                </button>

                </div>

            </article>

        `).join("");
}

/* =====================================================
   Initialize Dashboard
===================================================== */

verifyDashboardSession();