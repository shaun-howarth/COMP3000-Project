document.addEventListener("DOMContentLoaded", () => {

    let togglePosition = document.getElementById("toggle-button");
    let toggleContainer = document.getElementById('toggle');

    // when toggle is clicked, the page will switch between a light mode and dark mode.
    // adds and removes the theme appropriately from local storage.

    toggleContainer.addEventListener('click', function(){
        if (document.body.hasAttribute('data-theme','dark')){
            document.body.removeAttribute('data-theme', 'dark');
            togglePosition.classList.remove("toggle-button-active");
            localStorage.removeItem('theme', 'dark');
        } else {
            document.body.setAttribute('data-theme', 'dark');
            togglePosition.classList.add("toggle-button-active");
            localStorage.setItem('theme', 'dark');
        }
    });

    // on DOM loaded, it checks to see if localStorage has the key:'theme', and if it does, if it's value is:'dark'.
    // when that is true, it sets the body with an attribute to turn the theme dark.
    checkTheme();
});