const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});


const navLinks = document.querySelectorAll("#nav-menu a");

navLinks.forEach((link) => {

    link.addEventListener("click", () => {
        navMenu.classList.remove("active");
    });

});