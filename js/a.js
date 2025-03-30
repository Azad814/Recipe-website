let recipes = [];

document.addEventListener("DOMContentLoaded", async function () {
    try {
        //  Fetching the data from the json
        const response = await fetch("../recipe.json");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        data = await response.json();
        // data is stored in the global array named recipes
        recipes = data.users;

        // Modifying the data in the modal
        const modal = document.getElementById("recipeModal");
        const modalTitle = document.getElementById("modalTitle");
        const modalImage = document.getElementById("modalImage");
        const modalDescription = document.getElementById("modalDescription");
        const modalIngredients = document.getElementById("recipeIngredients");
        const closeModal = document.querySelector(".close");

        document.querySelectorAll(".view-recipe").forEach(button => {
            button.addEventListener("click", function (event) {
                event.preventDefault(); // Prevent page jump

                // Get recipe details from button attributes
                const recipeId = this.getAttribute("data-id");
                const recipe = recipes.find(r=>r.id===recipeId);

                // Setting the data in the modal according to the json attributes
                if(recipe){
                    // modalTitle.textContent = this.getAttribute("data-title");
                    modalTitle.textContent = recipe.name;
                    modalIngredients.textContent = recipe.ingredient.join("\n" || "No Ingredients listed");
                    modalImage.src = this.getAttribute("data-image");
                    modalDescription.textContent = recipe.process.join("\n") || "No process available";
                    
                    // Show modal
                    modal.style.display = "flex";
                } else{
                    console.error("Recipe not Found for ID:", recipeId);
                }
            });
        });

        // Close the modal when clicking on (x)
        closeModal.addEventListener("click", function () {
            modal.style.display = "none";
        });

        // Close modal when clicking outside the modal content
        window.addEventListener("click", function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });
    }
    catch (error) {
        console.error("Couldn't able to fetch the data:", error);
    }
});








// caraousel


    // Initialize Swiper
    var swiper = new Swiper(".hero-swiper", {
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
    });
