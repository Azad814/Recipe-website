function getCookieValue(name) {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === name) return value;
    }
    return null;
}


const recipeContainer = document.getElementById('recipe-container');
const BACKEND_URL = 'https://recipe-website-backend-zeta.vercel.app/api/recipe/all';

async function fetchAndRenderRecipes() {
    try {
        const token = getCookieValue("authToken");
        if (!token) {
            recipeContainer.innerHTML = `<p class="text-danger">You must be logged in to view recipes.</p>`;
            return;
        }

        const response = await fetch(BACKEND_URL, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "authToken": token
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const recipes = await response.json();
        console.log(recipes);

        recipeContainer.innerHTML = '';
        recipes.forEach(recipe => {
            const col = document.createElement('div');
            col.className = 'p-5 col-md-2 mb-5 mx-4'; // Added spacing at bottom

            col.innerHTML = `
                <div class="card shadow-sm h-100" style="width: 18rem;">
                    <img class="card-img-top" src="${recipe.image || 'https://via.placeholder.com/300x200'}" alt="${recipe.name}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${recipe.name}</h5>
                        <p class="card-text">${recipe.process?.slice(0, 100) || 'No description available.'}...</p>
                        <button class="btn btn-primary mt-auto view-btn" data-id="${recipe._id}"  onclick="loadOneRecipe.call(this)">View Recipe</button>
                    </div>
                </div>
            `;

            recipeContainer.appendChild(col);
        });
        // recipes.forEach(recipe => {
        //     const col = document.createElement('div');
        //     col.className = 'col-md-4';

        //     col.innerHTML = `
        //         <div class="card shadow-sm h-100">
        //             <img src="${recipe.image || 'https://via.placeholder.com/300x200'}" class="card-img-top" alt="${recipe.name}">
        //             <div class="card-body">
        //                 <h5 class="card-title">${recipe.name}</h5>
        //                 <p class="card-text">${recipe.process || 'No description available.'}</p>
        //                 <button data-id="${recipe._id}" onclick="loadOneRecipe.call(this)" class="btn btn-primary">View Recipe</button>
        //             </div>
        //         </div>
        //     `;
        //     recipeContainer.appendChild(col);
        // });
    } catch (err) {
        console.error('Failed to fetch recipes:', err);
        recipeContainer.innerHTML = `<p class="text-danger">Unable to load recipes at the moment.</p>`;
    }
}

async function loadOneRecipe() {
    const modal = document.getElementById("recipeModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalImage = document.getElementById("modalImage");
    const modalDescription = document.getElementById("modalDescription");
    const modalIngredients = document.getElementById("recipeIngredients");
    const closeModal = document.querySelector(".close");
    const recipeId = this.getAttribute("data-id");
    const url = "https://recipe-website-backend-zeta.vercel.app/api/recipe/one/" + recipeId;
    const token = getCookieValue("authToken");
    if (!token) {
        recipeContainer.innerHTML = `<p class="text-danger">You must be logged in to view recipes.</p>`;
        return;
    }
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            "Content-Type": 'application/json',
            "authToken": token,
        }
    });
    const recipe = await response.json();
    console.log(recipe);
    if (recipe) {
        // modalTitle.textContent = this.getAttribute("data-title");
        modalTitle.textContent = recipe.name;
        modalIngredients.textContent = recipe.ingredient || "No Ingredients listed";
        modalImage.src = this.getAttribute("data-image");
        modalDescription.textContent = recipe.process || "No process available";

        // Show modal
        modal.style.display = "flex";
    } else {
        console.error("Recipe not Found for ID:", recipeId);
    }
    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Close modal when clicking outside the modal content
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
};

// Run it on load
fetchAndRenderRecipes();



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
