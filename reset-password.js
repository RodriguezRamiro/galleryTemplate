/* //galleryTemplate/reset-password.js */

const resetForm = document.getElementById("reset-password-form");

const resetMessage = document.getElementById("reset-message");

/* =====================================================
  Password Recovery Session
===================================================== */

window.supabaseClient.auth.onAuthStateChange((event, session) => {

    console.log("Auth event:", event);

    if(event === "PASSWORD_RECOVERY" && session) {


        console.log("Password recovery session established.");

        resetMessage.textContent =
            "Recovery session ready. Enter your new password.";
    }
});

/* =====================================================
   Password Update
===================================================== */

resetForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const password =
        document.getElementById("new-password").value;

    const confirmPassword =
        document.getElementById("confirm-password").value;

    if(password !== confirmPassword) {

        resetMessage.textContent =
            "Password do not match.";

        return;

    }

    resetMessage.textContent =
        "Updating password...";

    const { error } =
        await window.supabaseClient.auth.updateUser({
            password: password
        });

    if (error) {

        console.error("Password update failed:", error);

        resetMessage.textContent =
            "Unable to update the password. Please request a new reset link.";

        return;
    }

    console.log("Password updated successfully.");

    resetMessage.textContent =
        "Password updated successfully. You can now return to the Artist Admin.";

});