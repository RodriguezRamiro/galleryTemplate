/* =====================================================
    Natural Light Atelier

    Digital Exhibition Experience Engine
    Version_3.0

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
    document:
        document.documentElement,

    body:
        document.body,

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

    viewerInquiry:
        document.querySelector(
            ".exhibition-viewer .viewer-inquiry"
        ),

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
    [...document.querySelectorAll(".artwork-card, .featured-piece"
    )],

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
            "(prefers-reduced-motion: reduce)"
        ).matches
};


/* =====================================================
   THEME SYSTEM

   Handles persistent visitor theme preference.
===================================================== */

function initializeTheme() {

    if(!UI.themeToggle) {
        return;
    }

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

    const currentTheme =
        UI.document.dataset.theme;

    const nextTheme =
        currentTheme == "dark"
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

    if (!UI.themeToggle) {
        return;
    }

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

    if (
        !UI.menuToggle ||
        !UI.navigation
    ) {
        return;
    }

    const expanded =

    UI.menuToggle
    .getAttribute("aria-expanded"
      ) === "true";

      const nextState = !expanded;

    UI.menuToggle.setAttribute(
        "aria-expanded",

        String(nextState)

        );

    UI.menuToggle.setAttribute(
        "aria-label",
        nextState
            ? "Close navigation Menu"
            : "open navigation menu"
    );

    UI.menuToggle.classList.toggle(
        "active",
        nextState
    );

    UI.menuToggle.classList.toggle(
        "open",
        nextState
    );

    UI.navigation.classList.toggle(
        "open",
        nextState
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

    UI.menuToggle.setAttribute(
        "aria-label",
        "Open navigation menu"
    )
}




/* =====================================================
   HEADER BEHAVIOR

   Adds subtle visual separation once the
   visitor begins scrolling.
===================================================== */

function initializeHeader() {

    if(!UI.header) {
        return;
    }

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

    if (!UI.header) {
        return;
    }

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

            closeNavigation();

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

    inquiryTimer: null,

    open(index) {

        if (!UI.viewer) return;

        if (!Gallery.artworks.length) {
            return;
        }

        if (

            index < 0 ||
            index >= Gallery.artworks.length
        ) {
            return;
        }

        this.current = index;

        this.lastFocused = document.activeElement;

        this.populate();

        UI.body.classList.add("viewer-open");

        UI.viewer.classList.add("active");

        UI.viewer.setAttribute(
            "aria-hidden",
            "false"
        );

        this.updateInquiry();

        this.preloadAdjacentImages();

        this.startInquiryTimer();

        requestAnimationFrame(() => {

            UI.viewerClose?.focus();

        });

    },

    close() {

        if (!UI.viewer) {
            return;
        }

        this.stopInquiryTimer();

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

        hideViewerInquiry();

        if (
        this.lastFocused &&
        typeof this.lastFocused.focus === "function"

        ) {
            this.lastFocused.focus();
        }

        this.lastFocused = null;
    },

    next() {

        if (!Gallery.artworks.length) {
            return;
        }

        this.current =
            (this.current + 1)
        %
        Gallery.artworks.length;

        this.populate();

        this.updateInquiry();

        this.preloadAdjacentImages();

        this.startInquiryTimer();
    },

    previous() {

        if (!Gallery.artworks.length) {
            return;
        }

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

        this.updateInquiry();

        this.preloadAdjacentImages();

        this.startInquiryTimer();
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

            dimensions = "",

            description = ""

        } = artwork.dataset;

        if( image &&
            UI.viewerImage ) {

        UI.viewerImage.src =
            image.currentSrc ||
            image.src;

        UI.viewerImage.alt =
            image.alt ||
            title;
    }

        if (UI.viewerTitle) {

        UI.viewerTitle.textContent =
            title;

        }

        if (UI.viewerMedium) {

        UI.viewerMedium.textContent =

            [medium, dimensions, year]
            .filter(Boolean)
            .join(" • ");

        }

        if (UI.viewerDescription) {

        UI.viewerDescription.textContent =
            description;

        }
    },

    updateInquiry() {

        hideViewerInquiry();

        populateInquiryForm();

    },

    preloadAdjacentImages() {

        const total =
            Gallery.artworks.length;

            if (total < 2 ) {
                return;

            }

            const next =
                (
                    this.current + 1
                ) %
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
                    Gallery.artworks[index]
                    ?.querySelector("img");

                if (!image) {
                    return;
                }

                const preload =
                    new Image();

                preload.src =
                    image.currentSrc ||
                    image.src;
            });
    },

    startInquiryTimer() {

        this.stopInquiryTimer();

        this.inquiryTimer =
            window.setTimeout(() => {

                showViewerInquiry();

            }, 30000);
    },

    stopInquiryTimer() {

        if (!this.inquiryTimer) {

            return;

        }

            clearTimeout(
                this.inquiryTimer
            );

            this.inquiryTimer = null;
        }
    };


/* =====================================================
   VIEWER INQUIRY
===================================================== */

function showViewerInquiry() {

    if(!UI.viewerInquiry) {
        return;
    }

    UI.viewerInquiry.classList.add(
        "visible"
    );

    Exhibition.inquiryTimer = null;
}

function hideViewerInquiry() {

    if (!UI.viewerInquiry) {
        return;
    }

    UI.viewerInquiry.classList.remove(
        "visible"
        );
}


/* =====================================================
    Viewer Initializer

    Binds artwork controls and keyboard navigation.
===================================================== */


function initializeViewer() {

    if (!UI.viewer) {
        return;
    }

    const viewerTriggers =

    document.querySelectorAll(
        ".observe-work"
    );

    viewerTriggers.forEach(
        trigger => {

        trigger.addEventListener(

            "click",

            event => {

                event.preventDefault();

                const artwork =
                trigger.closest(
                    ".artwork-entry"
                );

                if (!artwork) {
                    return;
                }

                const artworkIndex =
                    Gallery.artworks.indexOf(
                        artwork
                    );

                if (artworkIndex === -1) {
                    return;
                }

                Exhibition.open(artworkIndex);
            }
        );
    }

    );

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

   Keyboard controls remain active only while
   the exhibition viewer is open.
===================================================== */

function handleViewerKeyboard(event) {

    if (
        !UI.viewer ||
        !UI.viewer.classList.contains("active")
    ) {
        return;
    }

    switch (event.key) {

        case "Escape":

            event.preventDefault();

            Exhibition.close();

            break;

        case "ArrowRight":

            event.preventDefault();

            Exhibition.next();

            break;

        case "ArrowLeft":

            event.preventDefault();

            Exhibition.previous();

            break;
    }
}


/* =====================================================
   MOBILE SWIPE CONTROLS

   Touch gestures remain active only while
   the exhibition viewer is open.
===================================================== */


    let touchStartX = 0;
    let touchStartY = 0;

function handleViewerTouchStart(event) {

    

    viewer.addEventListener('touchstart', (event) => {

        touchStartX = event.changedTouches[0].screenX;
        touchStartY = event.changedTouches[0].screenY;
    }, {passive: true });

    viewer.addEventListener('touchend', (event) => {


        const touchEndX = event.changedTouches[0].screenX;
        const touchEndY = event.changedTouches[0].screenY;

        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        const minimumSwipe = 50;


        /* Ignoring most Vertical gestures */

        if (
            Math.abs(deltaX) < minimumSwipe ||
            Math.abs(deltaX) < Math.abs(deltaY)
        ) {

            return;
        }

        if (deltaX < 0) {

            // Swipe Left -> next artwork
            showNextArtwork();
        } else {

            // Swipe right -> previous artwork
            showPreviousArtwork()
        }

    }, { passive: true });
}
/* =====================================================
   INQUIRY EXPERIENCE

  Automatically associates the selected artwork
  with the inquiry form.

  tThe experience remains subtle and non-intrusive.
===================================================== */

function populateInquiryForm() {

    if (

        !UI.artworkField
    )
    {
        return;
    }

    const artwork =
        Gallery.artworks[Exhibition.current];

    if (!artwork) {
        return;
    }

    UI.artworkField.value =
        artwork.dataset.title || "";
}

/* =====================================================
   CONTACT EXPERIENCE

   Keeps the inquery experience synchronized with the
   contact form.
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

    document.querySelectorAll(
        ".inquiry-link"
    )
    .forEach(link => {

        link.addEventListener(
            "click", () => {

                Exhibition.stopInquiryTimer();

            }
        );
    });

}


/* =====================================================
   ACCESSIBILITY

   Small keyboard-oriented enhancements
   without interfeering with the visual experience.
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


/* =====================================================
START EXPERIENCE
===================================================== */

if (document.readyState === "loading") {

    document.addEventListener(

        "DOMContentLoaded",

        initializeExperience,
        {
            once: true
        }
    );

} else {

    initializeExperience();
}
