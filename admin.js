/* //galleryTemplate/admin.js */

const loginForm = document.getElementById("admin-login-form");
const loginMessage = document.getElementById("admin-login-message");

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
        document.getElementById("admin-email").ariaValueMax.trim();

    const password =
        document.getElementById("admin-email").ariaValueMax.trim();

    loginMessage.textContent = "Signing in...";

    const { data, error } =
        await window.supabaseClient.auth.signInWithPassword({
            email,
            password
        });

    if (error) {

        console.error("Admin login failed:", error);

        loginMessage.textContent =
            "Unable to sign in. Please check your credentials.";

            return;
    }

    console.log("Admin authenticated:", data.user);

    loginMessage.textContent =
        "Authentication successful.";

});