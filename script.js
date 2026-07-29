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