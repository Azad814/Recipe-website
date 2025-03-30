let recipes = [];

document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("recipe.json");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        data = await response.json();
        recipes = data.users;
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
