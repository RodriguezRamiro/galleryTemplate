/* //galleryTemplate/admin.js */

const loginForm = document.getElementById("admin-login-form");
const loginMessage = document.getElementById("admin-login-message");

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
        document.getElementById("admin-email").value.trim();

    const password =
        document.getElementById("admin-password").value;

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

    window.location.href = "./admin-dashboard.html";


    });

    /* Password Reset Redirect */

const forgotPasswordLink =
    document.getElementById("admin-forgot-password");

forgotPasswordLink.addEventListener("click", async (event) => {
    event.preventDefault();

    const email =
        document.getElementById("admin-email").value.trim();

    if (!email) {
        loginMessage.textContent =
            "Enter your email address first.";
        return;
    }

    loginMessage.textContent =
        "Sending password recovery email...";

    const { error } =
        await window.supabaseClient.auth.resetPasswordForEmail(
            email,
            {
                redirectTo:
                    `${window.location.origin}/reset-password.html`
            }
        );

    if (error) {
        console.error("password recovery failed:", error);
        loginMessage.textContent =
            "Unable to send recovery email. Please try again.";
        return;
    }

    loginMessage.textContent =
        "Password recovery email sent. Check your inbox.";
});