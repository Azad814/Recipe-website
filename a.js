document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("recipeModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalImage = document.getElementById("modalImage");
    const modalDescription = document.getElementById("modalDescription");
    const closeModal = document.querySelector(".close");

    document.querySelectorAll(".view-recipe").forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent page jump

            // Get recipe details from button attributes
            modalTitle.textContent = this.getAttribute("data-title");
            modalImage.src = this.getAttribute("data-image");
            modalDescription.textContent = this.getAttribute("data-description");

            // Show modal
            modal.style.display = "flex";
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
});
