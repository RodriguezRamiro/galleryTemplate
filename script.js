/* =====================================================
   ARTISTIC SHAM
   Natural Light Atelier

   EXPERIENCE ENGINE

   -----------------------------------------------------

   This file orchestrates the experience of the
   exhibition.

   It is intentionally restrained.

   Interactions should feel quiet, deliberate,
   and invisible.

   Visitors should remain immersed in the artwork,
   never distracted by the interface.

   Every function exists to support contemplation.

   -----------------------------------------------------
   Architecture

   01 — Global Elements
   02 — Theme System
   03 — Navigation
   04 — Header Behavior
   05 — Scroll Reveal
   06 — Exhibition Viewer
   07 — Inquiry Experience
   08 — Contact Experience
   09 — Accessibility
   10 — Utilities
   11 — Initialize Experience
===================================================== */


/* =====================================================
   GLOBAL ELEMENTS
===================================================== */

const UI = {
    document: document.documentElement,

    body: document.body,

    header:
        document.querySelector(".site-header"),

    navigation:
        document.querySelector(".nav-links"),

    menuToggle:
        document.querySelector(".menu-toggle"),

    themeToggle:
        document.querySelector(".theme-toggle"),

    viewer:
        document.querySelector(".exhibition-viewer"),

    viewerImage:
        document.querySelector(".viewer-artwork img"),

    viewerTitle:
        document.querySelector(".viewer-title"),

    viewerMedium:
        document.querySelector(".viewer-medium"),

    viewerDescription:
        document.querySelector(".viewer-description"),

    viewerClose:
        document.querySelector(".viewer-close"),

    viewerNext:
        document.querySelector(".viewer-next"),

    viewerPrev:
        document.querySelector(".viewer-prev"),

    artworkField:
        document.querySelector("#artwork"),

    messageField:
        document.querySelector("#message")
};


/* =====================================================
   GALLERY STATE
===================================================== */

const Gallery = {

    artworks:
    [...document.querySelectorAll(".artwork-card")],

    current: 0,
};


/* =====================================================
   USER PREFERENCES
===================================================== */

const Preferences = {

    themeKey: "atelier-theme"
};


/* =====================================================
   MOTION PREFERENCES
===================================================== */

const Motion = {

    reduced:

        window.matchMedia(
            "(preferes-reduced-motion: reduce)"
        ).matches
};


/* =====================================================
   THEME SYSTEM

   Handles persistent visitor theme preference.
===================================================== */

function initializeTheme() {
    if(!UI.themeToggle) return;

    const savedTheme =
    localStorage.getItem(
        Preferences.themeKey
    );

    const theme =
    savedTheme === "dark" ||
    savedTheme === "light"
        ? savedTheme
        : "light";

    applyTheme(theme);

    UI.themeToggle.addEventListener("click", toggleTheme);
};


function toggleTheme(){

    const nextTheme =
    UI.document.dataset.theme === "dark"
    ? "light"
    : "dark";

    applyTheme(nextTheme);

    localStorage.setItem(
        Preferences.themeKey,
        nextTheme
    );
}


function applyTheme(theme) {

    UI.document.dataset.theme = theme;

    if (!UI.themeToggle) return;

    UI.themeToggle.textContent =
    theme === "dark"
    ? "*"
    : "🌙";

    UI.themeToggle.setAttribute(
        "aria-label",

        theme === "dark"

        ? "Switch to light mode"

        : "Switch to dark mode"

    );
}


/* =====================================================
   MOBILE NAVIGATION

   Handles responsive navigation behavior.
===================================================== */

function initializeNavigation() {

    if(
        !UI.menuToggle ||
        !UI.navigation
    ) {
        return;
    }

    UI.menuToggle.addEventListener(

        "click",

        toggleNavigation

    );

    UI.navigation
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(

                "click",

                closeNavigation
            );
        });

}

function toggleNavigation() {

    const expanded =

    UI.menuToggle
    .getAttribute("aria-expanded"
      )  === "true";

    UI.menuToggle.setAttribute(
        "aria-expanded",

        String(!expanded)

        );

    UI.menuToggle.classList.toggle(
        "active",
        !expanded
    );

    UI.menuToggle.classList.toggle(
        "open",
        !expanded
    );

    UI.navigation.classList.toggle(
        "open",
        !expanded
    );
}

function closeNavigation() {

    if (
        !UI.menuToggle ||
        !UI.navigation
    ) {
        return;
    }

    UI.menuToggle.classList.remove(
        "active",
        "open"
    );

    UI.navigation.classList.remove(
        "open"
    );


    UI.menuToggle.setAttribute(
        "aria-expanded",
        "false"
    );
}




/* =====================================================
   HEADER BEHAVIOR

   Adds subtle visual separation once the
   visitor begins scrolling.
===================================================== */

function initializeHeader() {

    if(!UI.header) return;

    updateHeader();

    window.addEventListener(

        "scroll",

        updateHeader,

        {
            passive: true
        }
    );
}

function updateHeader(){

    UI.header.classList.toggle(

        "scrolled",

        window.scrollY > 60
    );
}

/* =====================================================
   SCROLL REVEAL

   Reveals sections only once as they enter
   the viewport.

   Visitors preferring reduced motion
   receive immediate visibility.
===================================================== */

function initializeReveal() {

    const elements =

        document.querySelectorAll(

            `section,
            .featured-piece,
            .artwork-card,
            .journal article`
        );

        if (!elements.length) return;

        if(Motion.reduced) {

            elements.forEach(element => {

                element.classList.add(
                    "visible"
                );
            });

            return;
        }

        if (

            typeof IntersectionObserver ===
            "undefined"
        ) {

            elements.forEach(element => {

            element.classList.add(
                "visible"
            );

        });

        return
    }

    elements.forEach(element => {

        element.classList.add(
            "reveal"
        );

    });

        const observer =

            new IntersectionObserver(

                revealEntries,

                {
                    threshold: 0.15,
                    rootMargin:
                    "0px 0px -80px 0px"
                }
            );

    elements.forEach(element => {

        observer.observe(element);

    });

}


function revealEntries(entries, observer){

    entries.forEach(entry => {

        if (!entry.isIntersecting) {
            return;
        }

        entry.target.classList.add(
            "visible"
        );

        observer.unobserve(
            entry.target
        );

    });
}


/* =====================================================
   SMOOTH SCROLL

   Internal navigation between sections.
===================================================== */

function intializeSmoothScroll() {

    document

    .querySelectorAll(
        'a[href^="#"]'
    )

    .forEach(anchor => {

        anchor.addEventListener(

            "click",

            smoothScroll

            );
    });

}

function smoothScroll(event){

    const href =

        event.currentTarget.getAttribute(
            "href"
        );

        if (
            !href ||
            href === "#"
        ) {
            return;
        }

        let target;

        try {

            target =
            document.querySelector(href);

        } catch (error) {

            return;
        }

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({

                behavior:

                    Motion.reduced

                    ? "auto"

                    : "smooth",

                block: "start"

            });
}


/* =====================================================
   EXHIBITION VIEWER

   Provides a quiet, immersive artwork viewer.

   Supports:

   • Opening artwork
   • Closing artwork
   • Previous / next navigation
   • Keyboard navigation
   • Focus restoration
   • Scroll locking
   • Adjacent image preloading

===================================================== */


const Exhibition = {

    current: 0,

    lastFocused: null,

    inqueryTimer: null

    open(index) {

        if (!UI.viewer) return;

        this.current = index;
        this.lastFocused = document.activeElement;

        this.populate();

        UI.body.classList.add("viewer-open");

        UI.viewer.classList.add("active");
        UI.viewer.setAttribute(
            "aria-hidden",
            "false"
        );

        UI.viewerClose?.focus();

        this.preloadAdjacentImages();

        populateInqueryForm();

        this.startInquiryTimer();

    };

    close() {

        if (!UI.viewer) return;

        this.stopInqueryTimer();

        UI.viewer.classList.remove(
            "active"
        );

        UI.viewer.setAttribute(
            "aria-hidden",
            "true"
        );

        UI.body.classList.remove(
            "viewer-open"
        );

        UI.body.classList.remove(
            "viewer-open"
        );

        this.lastFocused?.focus();

    },

    next() {

        if (!Gallery.artworks.length) return;

        this.current =
            (this.current + 1)
        %
        Gallery.artworks.length;

        this.populate();
    },

    previous() {

        if (!Gallery.artworks.length) return;

        this.current =
        (
                this.current
                -
                1
                +
                Gallery.artworks.length
        )

        %

        Gallery.artworks.length;

        this.populate();
    },

    populate() {

        const artwork =
            Gallery.artworks[this.current];

        if(!artwork) return;

        const image =
            artwork.querySelector("img");

        const {

            title = "",

            medium = "",

            year = "",

            size = "",

            description = ""

        } = artwork.dataset;

        if(image) {

        UI.viewerImage.src =
            image.src;

        UI.viewerImage.alt =
            image.alt;
    }

        UI.viewerTitle.textContent =
            title;

        UI.viewerMedium.textContent =

            [medium, year]
            .filter(boolean)
            .join(" • ");

        UI.viewerDescription.textContent =
            description;
    },

    preloadAdjacentImages() {

        if (Gallery.artworks.length < 2)
            return;

        const total =
            (this.current + 1)
            %
            total;

            const previous =
            (
                this.current
                -
                1
                +
                total
            )
            %
            total;

            [next, previous].forEach(index => {

                const image =
                    GAllery.artwork[index]
                    ?.querySelector("img");

                if (!image) return;

                const preload =
                    new Image();

                preload.src = image.src;
            });
    },

    startInquiryTimer() {

        this.stopInqueryTimer();

        this.inqueryTimer =
            window.setTimeout(() => {

                if (
                    UI.artworkField &&
                    Gallery.artworks[this.current]
                ) {

                    UI.artworkField.value =
                        Gallery.artworks[
                            this.current
                        ].dataset.title || "";
                }
            }, 3000);
    },

    stopInquiryTimer() {

        if (this.inqueryTimer) {

            clearTimeout(
                this.inqueryTimer
            );

            this.inqueryTimer = null;
        }
    }

};



/* =====================================================
    Viewer Initializer

    Binds artwork controls and keyboard navigation.
===================================================== */


function initializeViewer() {

    if (!UI.viewer) return;

    document

    .querySelectorAll(".observe-work")

    .forEach((button, index) => {

        button.addEventListener(

            "click",

            event => {

                event.preventDefault();

                Exhibition.open(index);
            }
        );
    });

UI.viewerClose?.addEventListener(

    "click",

    () => Exhibition.close()

);

UI.viewerNext?.addEventListener(

    "click",

    () => Exhibition.next()

);

UI.viewerPrev?.addEventListener(

    "click",

    () => Exhibition.previous()

);

UI.viewer.addEventListener(

    "click",

    event => {

        if (event.target === UI.viewer) {

            Exhibition.close();

        }

    }

    );


document.addEventListener(

    "keydown",

    handleViewerKeyboard

);

}

/* =====================================================
   KEYBOARD CONTROLS
===================================================== */

function handleViewerKeyboard(event) {

    if (
        !UI.viewer ||
        !UI.viewer.classList.contains("active")
    ) {
        return;
    }

    switch ( event.key) {

        case "Escape":

            Exhibition.close();

            break;

        case "ArrowRight":

            Exhibition.next();

            break;

        case "ArrowLeft":

            Exhibition.previous();

            break;
    }
}

/* =====================================================
   INQUIRY EXPERIENCE

   Pre-fills the inquiery form with the selected artwork.
===================================================== */

function populateInqueryForm() {

    if (

        !UI.artworkField ||
        !Gallery.artworks.length
    ) {
        return;
    }

    const artwork =
        Gallery.artworks[Exhibition.current];

    if (!artwork) return;

    UI.artworkField.value =
        artwork.dataset.title || "";
}

/* =====================================================
   CONTACT EXPERIENCE

   Enhances the contact form experience.
===================================================== */


function initiailizeContactForm() {

    const form = document.querySelector(".contact-form");

    if (!form) return;

    form.addEventListener(

        "submit",

        () => {

            Exhibition.stopInquiryTimer();
        }
    );
}


/* =====================================================
   ACCESSIBILITY

   Small enhancements for keyboard users.
===================================================== */

function initializeAccessibility() {

    document.addEventListener(

        "keydown",

        event => {

            if (

                event.key === "Escape" &&
                UI.navigation?.classList.contains("open")
            ) {

                closeNavigation();

            }
        }
    );
}


/* =====================================================
   UTILITIES
===================================================== */

function debounce(callback, delay = 100) {

    let timeout;

    return (...args) => {

        clearTimeout(timeout);

        timeout = setTimeout(() => {

            callback(...args);

        }, delay);
    };
}


/* =====================================================
   INITIALIZATION

   Starts the exhibition experience.
===================================================== */

function initializeExperience() {

    initializeTheme();

    initializeNavigation();

    initializeHeader();

    initializeReveal();

    intializeSmoothScroll();

    initializeViewer();

    initiailizeContactForm();

    initializeAccessibility();

}

if (document.readyState === "loading") {

    document.addEventListener(

        "DOMContentLoaded",

        initializeExperience
    );

} else {

    initializeExperience();
}
