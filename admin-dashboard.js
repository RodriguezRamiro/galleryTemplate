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

let editingArtworkImageUrl = null

/* =====================================================
   Exhibition Form Elements
===================================================== */

const addExhibitionButton = document.querySelector("#add-exhibition-button");

const addExhibitionPanel = document.querySelector("#add-exhibition-panel");

const cancelExhibitionButton = document.querySelector("#cancel-exhibition-button");

const addExhibitionForm = document.querySelector("#add-exhibition-form");

let editingExhibitionId = null;



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
   Delete Artwork
===================================================== */

artworkList.addEventListener("click", async (event) => {

    const deleteButton =
        event.target.closest(".delete-artwork-button");

    if (!deleteButton) {
        return;
    }

    const artworkId = deleteButton.dataset.artworkId;

    const artworkCard =
        deleteButton.closest(".admin-artwork-item");

    const artworkTitle =
        artworkCard?.querySelector("h3")?.textContent.trim()
        || "this artwork";

    // Confirm before permanently deleting anything.
    const confirmed = window.confirm(
        `Are you sure you want to permanently delete "${artworkTitle}"? This action cannot be undone.`
    );

    if (!confirmed) {
        return;
    }

    deleteButton.disabled = true;
    deleteButton.textContent = "Deleting...";

    dashboardMessage.textContent = "Deleting artwork...";

    try {

        // Retrieve the image URL before deleting the record.
        const { data: artwork, error: fetchError } =
            await window.supabaseClient
                .from("artworks")
                .select("image_url")
                .eq("id", artworkId)
                .single();

        if (fetchError) {
            console.error(
                "Unable to retrieve artwork before deletion:",
                fetchError
            );

            dashboardMessage.textContent =
                "Unable to delete artwork. Please try again.";

            await loadDashboardArtworks();
            return;
        }

        // Delete the database record.
        const { error: deleteError } =
            await window.supabaseClient
                .from("artworks")
                .delete()
                .eq("id", artworkId);

        if (deleteError) {
            console.error(
                "Unable to delete artwork record:",
                deleteError
            );

            dashboardMessage.textContent =
                "Unable to delete artwork. Please try again.";

            await loadDashboardArtworks();
            return;
        }

        // Attempt to remove the image if it belongs to our bucket.
        let imageCleanupFailed = false;

        const imageUrl = artwork.image_url;
        console.log("Image URL for cleanup:", imageUrl);

        if (imageUrl) {

            try {

                const parsedUrl = new URL(imageUrl);

                const storagePrefix =
                    "/storage/v1/object/public/artworks/";

                if (
                    parsedUrl.hostname ===
                        "sgsenlnkfpfvgewhqgxn.supabase.co" &&
                    parsedUrl.pathname.startsWith(storagePrefix)
                    ) {
                        console.log("Storage URL matched. Preparing to remove image.");

                        const storagePath = decodeURIComponent(
                            parsedUrl.pathname.slice(
                                storagePrefix.length
                                )
                                );
                                console.log("Storage path to remove:", storagePath);

                    if (storagePath) {

                        const {
                            data: removedFiles,
                            error: storageError } =
                            await window.supabaseClient
                                .storage
                                .from("artworks")
                                .remove([storagePath]);
                                console.log("Storage removal response:", {
                                    storagePath,
                                    removedFiles,
                                    storageError
                                });

                        if (storageError) {
                            console.error(
                                "Artwork was deleted, but its image could not be removed:",
                                storageError
                            );

                            imageCleanupFailed = true;
                        }
                    }
                }

            } catch (storageError) {

                console.error(
                    "Artwork was deleted, but image cleanup failed:",
                    storageError
                );

                imageCleanupFailed = true;
            }
        }

        // Refresh the dashboard.
        await loadDashboardArtworks();

        if (imageCleanupFailed) {

            dashboardMessage.textContent =
                "Artwork deleted, but its image could not be removed from storage. Check the console.";

        } else {

            dashboardMessage.textContent =
                "Artwork deleted successfully.";

            console.log("Artwork deleted successfully.");
        }

    } catch (error) {

        console.error(
            "Unexpected error while deleting artwork:",
            error
        );

        dashboardMessage.textContent =
            "An unexpected error occurred while deleting artwork. Check the console.";

        await loadDashboardArtworks();
    }

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
    editingArtworkImageUrl = null

    addArtworkForm.reset();

    addArtworkMessage.textContent = "";

    addArtworkTitle.textContent = "Add Artwork";

    saveArtworkButton.textContent = "Save Artwork";

    addArtworkPanel.hidden = false;

    addArtworkPanel.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

// Close the panel and reset the form.
cancelArtworkButton.addEventListener("click", () => {

addArtworkPanel.hidden = true;

editingArtworkId = null;
editingArtworkImageUrl = null;

addArtworkForm.reset();

addArtworkMessage.textContent = "";

addArtworkTitle.textContent = "Add Artwork";
saveArtworkButton.textContent = "Save Artwork";

});

/* =====================================================
   Open and Close Exhibition Form
===================================================== */

addExhibitionButton.addEventListener("click", () => {

    // Reset the form to create a new exhibition.
    editingExhibitionId = null;

    addExhibitionForm.reset();

    // Restore the form heading and button label.
    document.querySelector("#add-exhibition-title").textContent = "New exhibition";

    addExhibitionForm.querySelector('button[type="submit"]').textContent = "Save Exhibition";

    // Open the form.
    addExhibitionPanel.hidden = false;

    document.querySelector("#exhibition-title").focus();
});

cancelExhibitionButton.addEventListener("click", () => {

    // Clear any active editing state.
    editingExhibitionId = null;

    //Reset and Close Form.
    addExhibitionForm.reset();

    addExhibitionPanel.hidden = true;

    // Restore the default form heading and button label.
    document.querySelector("#add-exhibition-title").textContent = "New Exhibition";

    addExhibitionForm.querySelector('button[type="submit"]').textContent = "Save Exhibition";

});


/* =====================================================
   Save Exhibition
===================================================== */

addExhibitionForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const exhibitionTitle = document.querySelector("#exhibition-title").value.trim();

    const exhibitionDescription = document.querySelector("#exhibition-description").value.trim();

    const exhibitionMessage = document.querySelector("#add-exhibition-message");

    const saveButton = addExhibitionForm.querySelector('button[type="submit"]');

    // Validate the required title.
    if (!exhibitionTitle) {

        exhibitionMessage.textContent =
            "Please enter an exhibition title.";

        document.querySelector("#exhibition-title").focus();

        return;
    }

    saveButton.disabled = true;
    saveButton.textContent = "Saving Exhibition...";

    exhibitionMessage.textContent = "Saving Exhibition...";

    try {

        // Find the hieghest existing display order.
        const {
            data: existingExhibitions,
            error: orderError
        } = await window.supabaseClient
            .from("exhibitions")
            .select("sort_order")
            .order("sort_order", {
                ascending: false
            })
            .limit(1);

        if (orderError) {
            throw orderError;
        }

        const nextSortOrder =
            existingExhibitions.length > 0
                ? existingExhibitions[0].sort_order + 1
                : 1;

        // Create the exhibition as an unpublished draft.
        const { error: insertError } =
            await window.supabaseClient
                .from("exhibitions")
                .insert({
                    title: exhibitionTitle,
                    description: exhibitionDescription || null,
                    status: "draft",
                    sort_order: nextSortOrder
                });

        if (insertError) {
            throw insertError;
        }

        console.log("Exhibition created successfully.");

        // Refresh the exhibition list and count.
        await loadDashboardExhibitions()

        // Close and reset the form.
        addExhibitionForm.reset();
        addExhibitionPanel.hidden = true;

        dashboardMessage.textContent =
            "Exhibition created successfully.";
        } catch (error) {
            console.error(
                "Unable to save exhibition:",
                error
            );

            exhibitionMessage.textContent =
                "Unable to save exhibition. Please try again.";
        } finally {

            saveButton.disabled = false;
            saveButton.textContent = "Save Exhibition";
        }

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
                            .from("artworks")
                            .insert({
                                ...artworkData,
                                exhibition_id: null,
                                sort_order: 0,
                                published: false,
                                featured: false
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

    addArtworkPanel.hidden = true;

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
            "Exhibition list element was not found."
        );

        return;
    }

    // Handle an empty exhibition list.
        if (!exhibitions.length) {

            exhibitionList.innerHTML = `
                <p class="admin-message">
                    No exhibitions found.
                </p>
                `;
                return;
        }

    // Render the existing exhibitions.
        exhibitionList.innerHTML =
            exhibitions.map(exhibition => {

                const description =
                    exhibition.description?.trim();

                const hasDescription =
                    description && description !== "{}";

                    const status =
                        exhibition.status === "published"
                            ? "Published"
                            : "Draft";

                    return `
            <article class="admin-exhibition-item">

            <div class="admin-exhibition-details">

            <p class="admin-eyebrow">
            Exhibition · Order ${exhibition.sort_order}
            </p>

            <h3>
                ${exhibition.title}
            </h3>

            <p class="admin-exhibition-status">
                Status: ${status}
            </p>

            <p class="admin-exhibition-description">
                ${ hasDescription
                        ? description
                        : "No curatorial desciption added yet."
                    }
            </p>

            <div class="admin-exhibition-actions">

                    <button
                        type="button"
                        class="admin-submit edit-exhibition-button"
                        data-exhibition-id="${exhibition.id}"
                        >
                        Edit Exhibition
                    </button>

                </div>
            </div>

        </article>
    `;
}).join("");

}

/* =====================================================
   Load Exhibition for Editing
===================================================== */

document.querySelector("#admin-exhibition-list")
    .addEventListener("click", async (event) => {

        const editButton =
            event.target.closest(".edit-exhibition-button");

        // Ignore clicks that arent on an Edit button
        if(!editButton) {
            return;
        }



    })

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

                <button
                        type="button"
                        class="admin-submit delete-artwork-button"
                        data-artwork-id="${artwork.id}"
                >
                        Delete
                </button>

                </div>

            </article>

        `).join("");
}

/* =====================================================
   Toggle Artwork Publication
===================================================== */

artworkList.addEventListener("click", async (event) => {

    const publishButton =
        event.target.closest(".toggle-published-button");

    if (!publishButton) {
        return;
    }

    const artworkId = publishButton.dataset.artworkId

    const currentlyPublished =
        publishButton.dataset.published === "true";

    const nextPublishedState = !currentlyPublished;

    publishButton.textContent =
        nextPublishedState ? "Publishing..." : "Unpublishing...";

    const { error } =
        await window.supabaseClient
            .from("artworks")
            .update({
                published: nextPublishedState
            })
            .eq("id", artworkId);

    if (error) {

            console.error(
                "Unable to update artwork publication status:",
                error
            );

        dashboardMessage.textContent =
                "Unable to update publication status. Please try again.";

        await loadDashboardArtworks();
        return;
    }

    console.log(
        nextPublishedState
            ? "Artwork published successfully."
            : "Arwork unpublished successfully."
    )

    dashboardMessage.textContent =
        nextPublishedState
            ? "Artwork published successfully."
            : "Artwork returned to draft.";

    await loadDashboardArtworks();

});

/* =====================================================
   Initialize Dashboard
===================================================== */

verifyDashboardSession();