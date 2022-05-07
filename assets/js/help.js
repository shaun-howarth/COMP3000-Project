document.addEventListener("DOMContentLoaded", () => {

    // variable "collapsible" linking to "drop-down" button class in help.ejs
    let collapsible = document.getElementsByClassName("drop-down");

    // event listener included within for loop for the button to reveal the hidden answer text and turn arrow svg 90 degrees right usign toggle active in CSS "style" file
    for (let i = 0; i < collapsible.length; i++) {
        collapsible[i].addEventListener("click", function () {
            this.classList.toggle("active");
            this.getElementsByClassName("arrow-icon")[0].classList.toggle("active");
            let content =this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }

    // on DOM loaded, it checks to see if localStorage has the key:'theme', and if it does is it's value:'dark'.
    // when that is true, it sets the body with an attribute to turn the theme dark.
    if(localStorage.getItem('theme') === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
    } else {
        document.body.removeAttribute('data-theme', 'dark');
    }
});