/* //galleryTemplate/reset-password.js */

const resetForm = document.getElementById("reset-password-form");

const resetMessage = document.getElementById("reset-message");

let recoverySessionReady = false;

/* =====================================================
  Password Recovery Session
===================================================== */

window.supabaseClient.auth.onAuthStateChange((event, session) => {

    console.log("Auth event:", event);

    if(event === "PASSWPRD_RECOVERY" && session) {

        recoverySessionReady = true;

        console.log("Password recovery session established.");

        resetMessage.textContent =
            "Recovery session ready. Enter your password.";
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
            "Password do no match.";

        return;

    }

    if (!recoverySessionReady) {

        resetMessage.textContent =
            "Your recovery session is not ready. Please use a fresh reset link.";

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

    console.log("password update successfully.");

    resetMessage.textContent =
        "Password updated successfully. you can now return to the Artist Admin.";

});