/* //galleryTemplate/admin-dashboard.js */

const dashboardMessage =
    document.querySelector(".admin-message");


/* =====================================================
   Dashboard Authentication Check
===================================================== */

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

} else if (!session) {

    console.log(
        "No authenticated session found. Redirecting to admin login."
    );

    window.location.href = "./admin.html";

} else {

    console.log(
        "Authenticated dashboard session:",
        session.user
    );

}