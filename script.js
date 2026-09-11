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

    viewerPurchase:
            document.querySelector(".viewer-purchase"),

    featuredArtwork:
        document.querySelector("#featured-artwork"),

    collectionGrid:
        document.querySelector(".collection-grid"),

    artworkField:
        document.querySelector("#artwork"),

    messageField:
        document.querySelector("#message")
};


/* =====================================================
   ARTWORK DATA

   The artwork catalog is the source of truth.

   Keep artwork in chronological order:
   oldest → newest

   The newest artwork is automatically used
   as the Arrival / Featured work.
===================================================== */


const ArtworkData = [

    {
        catalog: "001",
        title: "Enough",
        image: "./assets/images/20260516_163259.jpg",
        medium: "Oil On Canvas",
        year: "2026",
        dimensions: "16 x 20 inches",
        description:
            "A meditation on memory, decay, and the invisble marks left by time. the composition explores the balance between what remains and what disapears.",
        purchaseUrl: "https://www.etsy.com/shop/CraftmancerStudios?ref=lp_mys_mfts"
    },

    {
        catalog: "002",
        title: "Tension",
        image: "./assets/images/20260516_163213.jpg",
        medium: "Oil on Canvas",
        year: "2026",
        dimensions: "16 x 20 inches",
        description: "Oil Paint Description Here",
        purchaseUrl: "https://www.etsy.com/shop/CraftmancerStudios?ref=lp_mys_mfts"

    },

    {
        catalog: "003",
        title: "Becoming",
        image: "./assets/images/20260516_163121.jpg",
        medium: "Oil on Canvas",
        year: "2026",
        dimensions: "16 x 20 inches",
        description:
            "A description of the painting here",
        purchaseUrl: "https://www.etsy.com/shop/CraftmancerStudios?ref=lp_mys_mfts"
    },

    {
        catalog: "004",
        title: "Corridor",
        image: "./assets/images/20260516_163019.jpg",
        medium: "Oil on Canvas",
        year: "2026",
        dimensions: "16 x 20 inches",
        description:
            "A description of painting here",
        purchaseUrl: "https://www.etsy.com/shop/CraftmancerStudios?ref=lp_mys_mfts"
    },

    {
        catalog: "005",
        title: "Witness",
        image: "./assets/images/20260516_162927.jpg",
        medium: "Oil on Canvas",
        year: "2026",
        dimensions: "16 x 20 inches",
        description:
            "A description of painting here",
        purchaseUrl: "https://www.etsy.com/shop/CraftmancerStudios?ref=lp_mys_mfts"
    },

    {
        catalog: "006",
        title: "Emergence",
        image: "./assets/images/20260516_162844.jpg",
        medium: "Oil on Canvas",
        year: "2026",
        dimensions: "16 x 20 inches",
        description:
            "A description of painting here",
        purchaseUrl: "https://www.etsy.com/shop/CraftmancerStudios?ref=lp_mys_mfts"
    },

    {
        catalog: "000",
        title: "Title",
        image: "Asset",
        medium: "Medium",
        year: "Year",
        dimensions: "Dimensions",
        description:
            "A description of painting here",
        purchaseUrl: "https://www.etsy.com/shop/CraftmancerStudios?ref=lp_mys_mfts"
    },

];

/* =====================================================
   GALLERY STATE
===================================================== */

const Gallery = {

    artworks: ArtworkData,

    current: 0,

    get published() {
        return this.artworks.filter(
            artwork => artwork.catalog !== "000"
        );
    },

    get latest() {
        const published = this.published;
        return published[published.length - 1] || null;
    },


    get collection() {
        return [...this.published].reverse().slice(1);
    }

};


/* =====================================================
   ARTWORK RENDERING
===================================================== */

function renderFeaturedArtwork() {

    const featured = document.querySelector("#featured-artwork");
    const artwork = Gallery.latest;

    if (!featured || !artwork) {
        return;
    }

    featured.dataset.catalog = artwork.catalog;
    featured.dataset.title = artwork.title;
    featured.dataset.medium = artwork.medium;
    featured.dataset.year = artwork.year;
    featured.dataset.dimensions = artwork.dimensions;
    featured.dataset.description = artwork.description;

    const image = featured.querySelector("img");

    if (image) {
        image.src = artwork.image;
        image.alt = `${artwork.title} - symbolic oil painting`;
    }

    const catalog = featured.querySelector(".catalog-number");

    if (catalog) {
        catalog.textContent = artwork.catalog;
    }

    const title = featured.querySelector("h2");

    if(title) {
        title.textContent = artwork.title;
    }

    const medium = featured.querySelector(".medium");

    if (medium) {
        medium.textContent = artwork.medium;
    }

    const year = featured.querySelector(".year");

    if (year) {
        year.textContent = artwork.year;
    }

    const dimensions = featured.querySelector(".dimensions");

    if (dimensions) {
        dimensions.textContent = artwork.dimensions;
    }

    const description = featured.querySelector(".artist-statement p");

    if (description) {
        description.textContent = artwork.description;
    }
}

/* =====================================================
   Collections Rendering
===================================================== */

function renderCollection() {

        const grid = document.querySelector(".collection-grid");

        if(!grid) {
            return;
        }

        const artworks = Gallery.collection;

        grid.innerHTML = "";

        artworks.forEach(artwork => {

            const card = document.createElement("article");

            card.className = "artwork-card artwork-entry";

            card.dataset.catalog = artwork.catalog;
            card.dataset.title = artwork.title;
            card.dataset.medium = artwork.medium;
            card.dataset.year = artwork.year;
            card.dataset.dimensions = artwork.dimensions;
            card.dataset.description = artwork.description;

            card.innerHTML = `
            <figure>
            <span class="catalog-number">${artwork.catalog}</span>

            <img
                src="${artwork.image}"
                alt="${artwork.title} - symbolic oil painting"
                loading="lazy"
                >
            </figure>

            <div class="artwork-caption">

            <h3>${artwork.title}</h3>
            <p class="medium">${artwork.medium}</p>

            <p class="year">${artwork.year}</p>

            <p class="dimensions">${artwork.dimensions}</p>

            <div class="artwork-actions">

            <button
                type="button"
                class="text-link observe-work"
            >

            Observe →
            </button>

            <a
            href="${artwork.purchaseUrl}"
            class="text-link purchase-link"
            target="_blank"
            rel="noopener noreferrer"
        >
            Purchase →
        </a>

        </div>

        <div class="viewer-inquiry">
        <a href="#inquiry" class="text-link inquiry-link">
        Own This Piece
        </a>
        </div>

        </div>
        `;

        grid.appendChild(card);

        });
}

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

    reduced: window.matchMedia(
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
}


function toggleTheme(){

    const currentTheme =
        UI.document.dataset.theme;

    const nextTheme =
        currentTheme === "dark"
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
            ? "Close navigation menu"
            : "Open navigation menu"
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

function initializeSmoothScroll() {

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

        document.body.style.overflow = "hidden";

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

        document.body.style.overflow = "";

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
            Gallery.published[this.current];

        if (!artwork) {
            return;

        }

        UI.viewerImage.src = artwork.image;
        UI.viewerImage.alt = `${artwork.title} - symbolic oil painting`;

        UI.viewerTitle.textContent = artwork.title;
        UI.viewerMedium.textContent =
            `${artwork.medium} · ${artwork.year}`;

        UI.viewerDescription.textContent =
            artwork.description;

        if (UI.viewerInquiry) {
            UI.viewerInquiry.classList.remove("visible");
        }

        if (UI.viewerPurchase) {
            UI.viewerPurchase.href = artwork.purchaseUrl || "#";
        }

        this.startInquiryTimer();
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
}


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

    document
        .querySelectorAll(".observe-work")
        .forEach(trigger => {

            trigger.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    const artworkElement =
                        trigger.closest(".artwork-entry");

                    if (!artworkElement) {
                        return;
                    }

                    const catalog =
                        artworkElement.dataset.catalog;

                    const artworkIndex =
                        Gallery.published.findIndex(
                            artwork =>
                                artwork.catalog === catalog
                        );

                    if (artworkIndex === -1) {
                        return;
                    }

                    Exhibition.open(artworkIndex);
                }
            );
        });


    /* ------------------------------------------
       IMAGE TAP
    ------------------------------------------ */

    document
        .querySelectorAll(".artwork-entry img")
        .forEach(image => {

            image.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    const artworkElement =
                        image.closest(".artwork-entry");

                    if (!artworkElement) {
                        return;
                    }

                    const catalog =
                        artworkElement.dataset.catalog;

                    const artworkIndex =
                        Gallery.published.findIndex(
                            artwork =>
                                artwork.catalog === catalog
                        );

                    if (artworkIndex === -1) {
                        return;
                    }

                    Exhibition.open(artworkIndex);
                }
            );
        });


    /* ------------------------------------------
       VIEWER CONTROLS
    ------------------------------------------ */

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


    /* ------------------------------------------
       BACKDROP CLOSE
    ------------------------------------------ */

    UI.viewer.addEventListener(
        "click",
        event => {

            if (event.target === UI.viewer) {
                Exhibition.close();
            }

        }
    );


    /* ------------------------------------------
       KEYBOARD
    ------------------------------------------ */

    document.addEventListener(
        "keydown",
        handleViewerKeyboard
    );


    /* ------------------------------------------
       MOBILE SWIPE
    ------------------------------------------ */

    UI.viewer.addEventListener(
        "touchstart",
        handleViewerTouchStart,
        { passive: true }
    );

    UI.viewer.addEventListener(
        "touchend",
        handleViewerTouchEnd,
        { passive: true }
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

    /* Focus Trap */

    if (event.key === "Tab") {

        const focusableElements =
            UI.viewer.querySelectorAll(
                'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled])'
            );

        if (!focusableElements.length) {
            return;
        }

        const firstElement =
            focusableElements[0];

        const lastElement =
            focusableElements[
                focusableElements.length -1
            ];

        if (
            event.shiftKey &&
            document.activeElement === firstElement
        ) {

            event.preventDefault();

            lastElement.focus();

        } else if (
            !event.shiftKey &&
            document.activeElement === lastElement
        ) {

            event.preventDefault();

            firstElement.focus();
        }

        return;
    }

    switch (event.key) {

        case " ":
            event.preventDefault();
            break;

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

    if (
        !UI.viewer ||
        !UI.viewer.classList.contains("active")
    ) {
        return;
    }

            touchStartX = event.changedTouches[0].screenX;
            touchStartY = event.changedTouches[0].screenY;
}

function handleViewerTouchEnd(event) {

    if (
        !UI.viewer ||
        !UI.viewer.classList.contains("active")
    ) {
        return;
    }

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

        // Swipe Left -> next artwork
        if (deltaX < 0) {

            Exhibition.next();
        }
       // Swipe right -> previous artwork
         else {

            Exhibition.previous()
        }

    }
/* =====================================================
   INQUIRY EXPERIENCE

  Automatically associates the selected artwork
  with the inquiry form.

  The experience remains subtle and non-intrusive.
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

   Keeps the inquiry experience synchronized with the
   contact form.
===================================================== */


function initializeContactForm() {

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
   without interfering with the visual experience.
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

    initializeSmoothScroll();

    renderFeaturedArtwork();

    renderCollection();

    initializeViewer();

    initializeContactForm();

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
