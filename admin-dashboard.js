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
   Initialize Dashboard
===================================================== */

verifyDashboardSession();