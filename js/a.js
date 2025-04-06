let recipes = [];

// document.addEventListener("DOMContentLoaded", async function () {
//     try {
//         //  Fetching the data from the json
//         const response = await fetch("../recipe.json");
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         data = await response.json();
//         // data is stored in the global array named recipes
//         recipes = data.users;
//         console.log(recipes);

//         // Modifying the data in the modal
//         const modal = document.getElementById("recipeModal");
//         const modalTitle = document.getElementById("modalTitle");
//         const modalImage = document.getElementById("modalImage");
//         const modalDescription = document.getElementById("modalDescription");
//         const modalIngredients = document.getElementById("recipeIngredients");
//         const closeModal = document.querySelector(".close");

//         document.querySelectorAll(".view-recipe").forEach(button => {
//             button.addEventListener("click", function (event) {
//                 event.preventDefault(); // Prevent page jump

//                 // Get recipe details from button attributes
//                 const recipeId = this.getAttribute("data-id");
//                 const recipe = recipes.find(r => r.id === recipeId);

//                 // Setting the data in the modal according to the json attributes
//                 if (recipe) {
//                     // modalTitle.textContent = this.getAttribute("data-title");
//                     modalTitle.textContent = recipe.name;
//                     modalIngredients.textContent = recipe.ingredient.join("\n" || "No Ingredients listed");
//                     modalImage.src = this.getAttribute("data-image");
//                     modalDescription.textContent = recipe.process.join("\n") || "No process available";

//                     // Show modal
//                     modal.style.display = "flex";
//                 } else {
//                     console.error("Recipe not Found for ID:", recipeId);
//                 }
//             });
//         });

//         // Close the modal when clicking on (x)
//         closeModal.addEventListener("click", function () {
//             modal.style.display = "none";
//         });

//         // Close modal when clicking outside the modal content
//         window.addEventListener("click", function (event) {
//             if (event.target === modal) {
//                 modal.style.display = "none";
//             }
//         });
//     }
//     catch (error) {
//         console.error("Couldn't able to fetch the data:", error);
//     }
// });








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



//search button

function searchRecipes() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let recipes = document.querySelectorAll('.recipe-card');

    recipes.forEach(recipe => {
        let title = recipe.querySelector('h2').textContent.toLowerCase();
        if (title.includes(input)) {
            recipe.style.display = "block"; // Show if it matches
        } else {
            recipe.style.display = "none"; // Hide if it doesn't match
        }
    });
}



// Templating Recipe Cards
const recipeContainer = document.getElementById('recipe-container');

// Replace with your actual backend endpoint
const BACKEND_URL = 'https://recipe-website-backend-zeta.vercel.app/';
fetch(BACKEND_URL)
    .then(res => res.json())
    .then(recipes => {
        recipes.forEach(recipe => {
            const col = document.createElement('div');
            col.className = 'col-md-4';

            col.innerHTML = `
        <div class="card shadow-sm h-100">
          <img src="${recipe.image || 'https://via.placeholder.com/300x200'}" class="card-img-top" alt="${recipe.title}">
          <div class="card-body">
            <h5 class="card-title">${recipe.title}</h5>
            <p class="card-text">${recipe.description || 'No description available.'}</p>
            <a href="/recipe/${recipe._id}" class="btn btn-primary">View Recipe</a>
          </div>
        </div>
      `;

            recipeContainer.appendChild(col);
        });
    })
    .catch(err => {
        console.error('Failed to fetch recipes:', err);
        recipeContainer.innerHTML = `<p class="text-danger">Unable to load recipes at the moment.</p>`;
    });
