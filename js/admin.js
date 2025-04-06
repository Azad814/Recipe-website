const url = "https://recipe-website-backend-zeta.vercel.app/";

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
    const getRecipeUrl = url + "api/recipe/all";

    const response = await fetch(getRecipeUrl, {
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
    // console.log(data);
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
            <td>${recipe._id}</td>
            <td><img src="${recipe.image}" alt="${recipe.name}" style="width:50px;height:50px;object-fit:cover;"></td>
            <td>
                <button class="action-btn edit-btn" data-id="${recipe._id}"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete-btn" data-id="${recipe._id}"><i class="fas fa-trash"></i></button>
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
    recipeForm.reset();
    recipeIdInput.value = '';
    recipeModal.style.display = 'flex';
});

// Edit recipe
async function editRecipe(e) {
    const id = e.currentTarget.getAttribute('data-id');
    const getRecipeUrl = url + "api/recipe/one/" + id;
    const token = getCookieValue("authToken");

    const response = await fetch(getRecipeUrl, {
        headers: {
            "authToken": token
        }
    });

    const recipe = await response.json();
    console.log(recipe);
    if (recipe) {
        modalTitle.textContent = 'Edit Recipe';
        recipeIdInput.value = recipe._id; // store id for update
        recipeTitleInput.value = recipe.name;
        recipeIngredientsInput.value = recipe.ingredient;
        recipeDescInput.value = recipe.process;
        recipeImageInput.value = recipe.image;
        recipeModal.style.display = 'flex';
    }
}

recipeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = recipeIdInput.value;
    const name = recipeTitleInput.value;
    const ingredients = recipeIngredientsInput.value;
    const process = recipeDescInput.value;
    const image = recipeImageInput.value;

    const recipe = { name, ingredients, process, image };
    const token = getCookieValue("authToken");

    if (id) {
        // Update existing recipe
        const updateUrl = `${url}api/recipe/one/${id}`;
        await fetch(updateUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'authToken': token
            },
            body: JSON.stringify(recipe)
        });
    } else {
        // Add new recipe
        await fetch(`${url}api/recipe/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authToken': token
            },
            body: JSON.stringify(recipe)
        });
    }

    loadRecipes();
    recipeModal.style.display = 'none';
});

// Delete recipe
async function deleteRecipe(e) {
    const id = e.currentTarget.getAttribute('data-id');
    console.log(id);
    const deleteRecipeUrl = url + "api/recipe/delete/" + id;
    if (confirm('Are you sure you want to delete this recipe?')) {
        const token = getCookieValue("authToken");
        const response = await fetch(deleteRecipeUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'authToken': token
            }
        });
        if (await response.ok) {
            window.alert("Recipe Removed Successfully");
        }
        loadRecipes();
    }
}

// Save recipe (add or update)
recipeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = recipeTitleInput.value;
    const ingredients = recipeIngredientsInput.value;
    const process = recipeDescInput.value;
    const image = recipeImageInput.value;

    const recipe = {
        name: title,
        ingredients: ingredients,
        process: process,
        image: image
    };

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
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = 'login.html';
});

// Initial load
loadRecipes();
