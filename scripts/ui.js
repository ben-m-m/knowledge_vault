//themes
console.log("ui.js loaded")
function initializeTheme() {
    console.log("init theme ok.")
    const radios = document.querySelectorAll(`input[name="theme"]`);
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
        document.querySelector(`input[value="dark"]`).checked = true;
    }

    radios.forEach(function (radio) {
        radio.addEventListener("change", function () {
            if (this.value === "dark") {
                document.body.classList.add("dark-theme");
            } else {
                document.body.classList.remove("dark-theme");
            }
            localStorage.setItem("theme", this.value);
        }
        );
    });
}