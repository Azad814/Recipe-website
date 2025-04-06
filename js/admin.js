// Check if admin is logged in
function getCookieValue(name) {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === name) return value;
    }
    return null;
}
function decodeJWT(token) {
    const payloadBase64 = token.split('.')[1]; // Get payload
    const payload = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')); // Base64 decode
    return JSON.parse(payload); // Convert to object
}

const token = getCookieValue("authToken");

if (!token) {
    window.location.href = "./login.html";
}
else {
    const decoded = decodeJWT(token);
    if (decoded.user.admin) {
        console.log(decoded.user.admin);
    }
    else {
        window.location.href = "/login.html";
    }
}
let recipes = [];

async function getRecipes() {
    const token = getCookieValue('authToken');
    const url = "https://recipe-website-backend-zeta.vercel.app/api/recipe/all";

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authToken': token
        }
    });

    if (!response.ok) {
        console.error('Failed to fetch recipes:', response.status);
        return;
    }

    const data = await response.json();
    return data;
}




// DOM elements
const recipesTable = document.getElementById('recipesTable').getElementsByTagName('tbody')[0];
const addRecipeBtn = document.getElementById('addRecipeBtn');
const recipeModal = document.getElementById('recipeModal');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const recipeForm = document.getElementById('recipeForm');
const modalTitle = document.getElementById('modalTitle');
const recipeIdInput = document.getElementById('recipeId');
const recipeTitleInput = document.getElementById('recipeTitle');
const recipeDescInput = document.getElementById('recipeDescription');
const recipeIngredientsInput = document.getElementById('recipeIngredients');
const recipeImageInput = document.getElementById('recipeImage');
const logoutBtn = document.getElementById('logoutBtn');

// Load recipes into table
async function loadRecipes() {
    recipes = await getRecipes(); // fetch and assign
    if (!recipes) return;
    // console.log(recipes);
    recipesTable.innerHTML = '';
    recipes.forEach(recipe => {
        const row = recipesTable.insertRow();
        row.innerHTML = `
            <td>${recipe.id}</td>
            <td><img src="${recipe.image}" alt="${recipe.title}" style="width:50px;height:50px;object-fit:cover;"></td>
            <td>${recipe.title}</td>
            <td>${recipe.description}</td>
            <td>
                <button class="action-btn edit-btn" data-id="${recipe.id}"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete-btn" data-id="${recipe.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
    });

    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', editRecipe);
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', deleteRecipe);
    });
}

// Add new recipe
addRecipeBtn.addEventListener('click', () => {
    modalTitle.textContent = 'Add New Recipe';
    recipeForm.reset();
    recipeIdInput.value = '';
    recipeModal.style.display = 'flex';
});

// Edit recipe
function editRecipe(e) {
    const id = parseInt(e.target.getAttribute('data-id'));
    const recipe = recipes.find(r => r.id === id);

    if (recipe) {
        modalTitle.textContent = 'Edit Recipe';
        recipeIdInput.value = recipe.id;
        recipeTitleInput.value = recipe.title;
        recipeDescInput.value = recipe.description;
        recipeIngredientsInput.value = recipe.ingredients;
        recipeImageInput.value = recipe.image;
        recipeModal.style.display = 'flex';
    }
}

// Delete recipe
function deleteRecipe(e) {
    const id = parseInt(e.target.getAttribute('data-id'));
    if (confirm('Are you sure you want to delete this recipe?')) {
        recipes = recipes.filter(recipe => recipe.id !== id);
        loadRecipes();
    }
}

// Save recipe (add or update)
recipeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = recipeIdInput.value ? parseInt(recipeIdInput.value) : recipes.length > 0 ? Math.max(...recipes.map(r => r.id)) + 1 : 1;
    const title = recipeTitleInput.value;
    const description = recipeDescInput.value;
    const ingredients = recipeIngredientsInput.value;
    const image = recipeImageInput.value;

    const recipe = { id, title, description, ingredients, image };

    if (recipeIdInput.value) {
        // Update existing recipe
        const index = recipes.findIndex(r => r.id === id);
        if (index !== -1) {
            recipes[index] = recipe;
        }
    } else {
        // Add new recipe
        recipes.push(recipe);
    }

    loadRecipes();
    recipeModal.style.display = 'none';
});

// Close modal
closeModal.addEventListener('click', () => {
    recipeModal.style.display = 'none';
});

cancelBtn.addEventListener('click', () => {
    recipeModal.style.display = 'none';
});

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
});

// Initial load
loadRecipes();