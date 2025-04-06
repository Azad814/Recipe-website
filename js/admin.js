  // Check if admin is logged in
//   if (!localStorage.getItem('adminLoggedIn')) {
//     window.location.href = 'login.html';
// }

// Sample recipe data (in a real app, this would come from a backend API)
let recipes = [
    {
        id: 1,
        title: "Strawberry Custard",
        description: "Creamy, Fruity and Delightful",
        ingredients: "2 cups fresh strawberries, 2 cups milk, 3 eggs, 1/2 cup sugar, 1 tsp vanilla extract",
        image: "images/images/Strawberry custard.jpg"
    },
    {
        id: 2,
        title: "Fluffy Banana Pancakes",
        description: "Light, fluffy, banana perfection",
        ingredients: "2 ripe bananas, 1 cup flour, 1 egg, 1/2 cup milk, 1 tbsp sugar, 1 tsp baking powder",
        image: "images/images/bananapancakes.jpg"
    },
    {
        id: 3,
        title: "Avocado Egg Toast",
        description: "Creamy, Savory and nutritious",
        ingredients: "2 slices whole grain bread, 1 ripe avocado, 2 eggs, salt, pepper, red pepper flakes",
        image: "images/images/avocado egg.jpg"
    },
    {
        id: 4,
        title: "Grilled Lemon Herb Salmon",
        description: "Fresh and Zesty",
        ingredients: "2 salmon fillets, 1 lemon, 2 tbsp olive oil, 1 tsp dried dill, salt and pepper to taste",
        image: "images/images/salmon.jpg"
    }
];

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
function loadRecipes() {
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
