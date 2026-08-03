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

const Gallery = {

    artworks:
    [...document.querySelectorAll(".artwork-card")],

    current: 0,

    largestTrigger: null,

    inquiryTimer: null
};

const Preferences = {

    themeKey:"atelier-theme"
};

const Motion = {

    reduced:

        window.matchMedia(
            "(preferes-reduced-mption: reduce)"
        ).matches
};



/* =====================================================
   EXHIBITION VIEWER
===================================================== */


const Exhibition = {

    current: 0,

    inquiryTimer: null,

    open(index) {

        this.current=index;

        this.populate();

        this.rememberFocus();

        this.lockScroll();

        this.populate()

        this.fadeIn();

        this.preloadADjacentImages();

        UI.viewer.classList.add("active");

        UI.viewer.setAttribute(
            "aria-hidden",
            "false"
        );

        this.startInquiryTimer();
    },

    close() {

        this.fadeOut();

        this.unlcokScroll();

        this.restoreFocus();

        this.stopInquiryTimer();

        UI.viewer.classList.remove(
            "active"
        );

        UI.viewer.setAttribute(

            "aria-hidden",

            "true"
        );
    },

    next() {

        this.current =
        (this.current + 1)
        %
        Gallery.artwork.length;

        this.populate
    },

    previous() {

        this.current =
        (
                this.current
                -
                1
                +
                Gallery.artwork.length
        )

        %

        Gallery.artwork.length;

        this.populate();
    },

    populate() {

        const {

            title,

            medium,

            year,

            size,

            description
        } = artwork.dataset;

        const artwork =
            Gallery.artwork[this.current];

        if(!artwork) return;

        const image =
            artwork.querySelector("img");

        UI.viewerImage.src =x
            image.src;

        UI.viewerImage.alt =
            image.alt;

        UI.viewerTitle.textContent = title;

        UI.viewerMedium.textContent =

            `${medium}
            •
            ${year}`;

        UI.viewerDescription.textContent =
            artwork.dataset.description;
    },

    startInquiryTimer() {},

    stopInquiryTimer() {}

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
    savedTheme || "light";

    applyTheme(theme);

    UI.themeToggle.addEventListener("click", toggleTheme);
}

function toggleTheme(){

    const current =
    UI.document.dataset.theme;

    const next =
    current === "dark"
    ? "light"
    : "dark";

    applyTheme(next);

    localStorage.setItem(
        Preferences.themeKey,
        next
    );
}


function applyTheme(theme) {
    UI.document.dataset.theme = theme;

    if(!UI.themeToggle) return;

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
        .forEach(link=>{

            link.addEventListener(

                "click",

                closeNavigation
            );
        });

}

function toggleNavigation() {

    const expanded =

    UI.menuToggle
    .getAttribute("aria-expanded")

    === "true";

    UI.menuToggle.setAttribute(
        "aria-expanded",

        !expanded

        );

    UI.menuToggle.classList.toggle(
        "active"
    );

    UI.menuToggle.classList.toggle(
        "active"
    );

    UI.navigation.classList.toggle(
        "open"
    );
}

function closeNavigation() {

    UI.navigation.classList.remove(
        "open"
    );

    UI.menuToggle.classList.remove(
        "active"
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
            passive:true
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

        if(Motion.reduced) {
            elements.forEach(element=> {

                element.classList.add(
                    "visible"
                );
            });

            return;
        }

        elements.forEach(element=> {

            element.classList.add(
                "reveal"
            );

        });

        const observer =

            new IntersectionObserver(

                revealEntries,

                {
                    threshold: .15,

                    rootMargin:
                    "0px 0px -80px 0px"
                }
            );

    elements.forEach(element=>{

        observer.observe(element);
    });
}


function revealEntries(entries, observer){

    entries.forEach(entry=>{

        if(!entry.isIntersecting){

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
        ''a[href^="#"]'
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

        if(
            !href ||
            href === "#"
        ){
            return;
        }

        const target =
            document.querySelector(href);

            if(!target){

                return;
            }

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
Viewer Initializer
===================================================== */


function initializeViewer() {

    document

    .querySelectorAll(".observe-work")

    .forEach((button, index) => {

        button.addEventListener(

            "click",

            event=>{

                event.preventDefault();

                Exhibition.open(index);
            }
        );
    });
}

document.addEventListener(

    "keydown",

    event=>{

        if(

            !UI.viewer.classList.contains(
                "active"
            )
        ){
            return;
        }

        switch(event.key){

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
)

/* =====================================================
   INITIALIZATION
===================================================== */

function initializeExperience() {

    initializeTheme();

    initializeNavigation();

    initializedHeader();

    intiializeReveal();

    intializeSmoothScroll();

    initializeViewer();

}

initializeExperience();