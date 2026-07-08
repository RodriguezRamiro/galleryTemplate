/* =====================================================
   ARTISTIC SHAM
   Natural Light Atelier
   Main JavaScript
===================================================== */


/* =====================================================
   THEME SYSTEM
===================================================== */


const themeToggle = document.querySelector(".theme-toggle");

const savedTheme = localStorage.getItem("atelier-theme");


if(savedTheme){

    document.documentElement.dataset.theme = savedTheme;

}



if(themeToggle){

    themeToggle.addEventListener("click",()=>{


        const currentTheme =
            document.documentElement.dataset.theme;


        const newTheme =
            currentTheme === "dark"
            ? "light"
            : "dark";


        document.documentElement.dataset.theme =
            newTheme;


        localStorage.setItem(
            "atelier-theme",
            newTheme
        );


    });

}

/* =====================================================
   INTERACTIVE LOGIC VARIABLES
===================================================== */


const viewer =
document.querySelector(".exhibition-viewer");


const viewerImage =
document.querySelector(".viewer-artwork img");


const viewerTitle =
document.querySelector(".viewer-title");


const viewerMedium =
document.querySelector(".viewer-medium");


const viewerDescription =
document.querySelector(".viewer-description");


const viewerClose =
document.querySelector(".viewer-close");

const viewerNext =
document.querySelector(".viewer-next");

const viewerPrev =
document.querySelector(".viewer-prev");


const artworks =
[
...document.querySelectorAll(".artwork-card")
];


let currentArtwork = 0;






/* =====================================================
   MOBILE NAVIGATION
===================================================== */


const menuToggle =
document.querySelector(".menu-toggle");


const nav =
document.querySelector(".nav-links");



if(menuToggle && nav){


    menuToggle.addEventListener("click",()=>{


        nav.classList.toggle("open");


        menuToggle.classList.toggle("active");


    });



    nav.querySelectorAll("a")
    .forEach(link=>{


        link.addEventListener("click",()=>{


            nav.classList.remove("open");


        });


    });


}







/* =====================================================
   HEADER SCROLL EFFECT
===================================================== */


const header =
document.querySelector(".site-header");



window.addEventListener("scroll",()=>{


    if(!header) return;


    if(window.scrollY > 60){


        header.classList.add("scrolled");


    }else{


        header.classList.remove("scrolled");


    }


});







/* =====================================================
   SCROLL REVEAL SYSTEM
===================================================== */


const revealElements =
document.querySelectorAll(
    "section, .artwork-card, .featured-piece, article"
);



revealElements.forEach(element=>{


    element.classList.add("reveal");


});




const observer =
new IntersectionObserver(
(entries)=>{


entries.forEach(entry=>{


    if(entry.isIntersecting){


        entry.target.classList.add(
            "visible"
        );


        observer.unobserve(
            entry.target
        );


    }


});


},
{
    threshold:.15
});




revealElements.forEach(element=>{


    observer.observe(element);


});








/* =====================================================
   ARTWORK FILTERING
===================================================== */


/*
Future HTML example:

<button data-filter="symbolism">
Symbolism
</button>

<article
class="artwork-card"
data-category="symbolism">

*/


const filterButtons =
document.querySelectorAll(
    "[data-filter]"
);




if(filterButtons.length){


filterButtons.forEach(button=>{


button.addEventListener("click",()=>{


    const filter =
    button.dataset.filter;



    filterButtons.forEach(btn=>{

        btn.classList.remove(
            "active"
        );

    });



    button.classList.add(
        "active"
    );





    artworks.forEach(work=>{


        const category =
        work.dataset.category;



        if(
            filter === "all" ||
            category === filter
        ){


            work.style.display =
            "";


            setTimeout(()=>{

                work.classList.add(
                    "visible"
                );

            },50);


        }
        else{


            work.style.display =
            "none";


        }


    });



});


});


}








/* =====================================================
   ARTWORK INTERACTION
===================================================== */


const artworkImages =
document.querySelectorAll(
    ".artwork-card img"
);



artworkImages.forEach(image=>{


    image.addEventListener(
        "mouseenter",
        ()=>{


            image.closest(
                ".artwork-card"
            )
            .classList.add(
                "focused"
            );


        }
    );



    image.addEventListener(
        "mouseleave",
        ()=>{


            image.closest(
                ".artwork-card"
            )
            .classList.remove(
                "focused"
            );


        }
    );


});








/* =====================================================
   SMOOTH ANCHOR MOVEMENT
===================================================== */


document.querySelectorAll(
    'a[href^="#"]'
)
.forEach(anchor=>{


anchor.addEventListener(
"click",
function(e){


const target =
document.querySelector(
    this.getAttribute("href")
);



if(target){


e.preventDefault();



target.scrollIntoView({

    behavior:"smooth",

    block:"start"

});


}



});



});


/* =====================================================
  GALLERY ROOM EXHIBITION VIEWER BEHAVIOR
===================================================== */

ocument.querySelectorAll(".observe-work").forEach((button, index) => {

    button.addEventListener("click", (e) => {

        e.preventDefault();

        openViewer(index);

    });

});

function openViewer(index){

    if(!artworks[index]) return;

    currentArtwork = index;

    const artwork = artworks[index];

    viewerImage.src = artwork.dataset.image || "";

    viewerImage.alt = artwork.dataset.title || "";

    viewerTitle.textContent = artwork.dataset.title || "";

    viewerMedium.textContent =
        `${artwork.dataset.medium || ""} · ${artwork.dataset.year || ""}`;

    viewerDescription.textContent =
        artwork.dataset.description || "";

    viewer.classList.add("active");

    viewer.setAttribute(
        "aria-hidden",
        "false"
    );

}

function closeViewer(){

    viewer.classList.remove("active");

    viewer.setAttribute(
        "aria-hidden",
        "true"
    );

}

function nextArtwork(){

    currentArtwork++;

    if(currentArtwork >= artworks.length){

        currentArtwork = 0;

    }

    openViewer(currentArtwork);

}

function previousArtwork(){

    currentArtwork--;

    if(currentArtwork < 0){

        currentArtwork = artworks.length - 1;

    }

    openViewer(currentArtwork);

}

viewerClose?.addEventListener(
    "click",
    closeViewer
);

viewerNext?.addEventListener(
    "click",
    nextArtwork
);

viewerPrev?.addEventListener(
    "click",
    previousArtwork
);

document.addEventListener("keydown", (e) => {

    if(!viewer.classList.contains("active")) return;

    switch(e.key){

        case "Escape":
            closeViewer();
            break;

        case "ArrowRight":
            nextArtwork();
            break;

        case "ArrowLeft":
            previousArtwork();
            break;

    }

});
