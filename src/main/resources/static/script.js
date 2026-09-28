const API_URL = "/api/recipes";

let allRecipes = [];


// ==========================================
// LOAD RECIPES
// ==========================================

async function loadRecipes() {

    const container =
        document.getElementById("recipeContainer");

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load recipes");
        }

        allRecipes = await response.json();

        displayRecipes(allRecipes);

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <p class="loading">
                ❌ Unable to load recipes.
                Please make sure the Spring Boot server is running.
            </p>
        `;
    }
}


// ==========================================
// DISPLAY RECIPES
// ==========================================

function displayRecipes(recipes) {

    const container =
        document.getElementById("recipeContainer");

    if (recipes.length === 0) {

        container.innerHTML = `
            <p class="loading">
                No recipes found.
            </p>
        `;

        return;
    }


    container.innerHTML = recipes.map(recipe => `

        <div class="recipe-card">

            <h3>
                ${escapeHtml(recipe.name)}
            </h3>

            <p class="recipe-description">
                ${escapeHtml(recipe.description)}
            </p>

            <div class="recipe-info">

                <span class="badge">
                    ⏱ ${recipe.prepTime} min
                </span>

                <span class="badge">
                    🍽 ${escapeHtml(recipe.mealType)}
                </span>

                ${
        recipe.isFavourite
            ? '<span class="favorite">❤️</span>'
            : ''
    }

            </div>

            <div class="card-buttons">

                <button
                    class="edit-btn"
                    onclick="editRecipe(${recipe.id})"
                >
                    ✏️ Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteRecipe(${recipe.id})"
                >
                    🗑️ Delete
                </button>

            </div>

        </div>

    `).join("");
}


// ==========================================
// ADD RECIPE
// ==========================================

document
    .getElementById("recipeForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();


        const recipe = {

            name:
            document.getElementById("name").value,

            description:
            document.getElementById("description").value,

            prepTime:
                Number(
                    document.getElementById("prepTime").value
                ),

            mealType:
            document.getElementById("mealType").value,

            isFavourite:
            document.getElementById("isFavourite").checked
        };


        try {

            const response = await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(recipe)
            });


            if (!response.ok) {
                throw new Error("Failed to create recipe");
            }


            alert("Recipe added successfully! 🎉");


            document
                .getElementById("recipeForm")
                .reset();


            await loadRecipes();


            document
                .getElementById("recipes")
                .scrollIntoView({
                    behavior: "smooth"
                });


        } catch (error) {

            console.error(error);

            alert(
                "Unable to add recipe. Please try again."
            );
        }

    });


// ==========================================
// DELETE RECIPE
// ==========================================

async function deleteRecipe(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this recipe?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(`${API_URL}/${id}`, {

                method: "DELETE"
            });


        if (!response.ok) {
            throw new Error("Failed to delete recipe");
        }


        alert("Recipe deleted successfully!");


        await loadRecipes();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to delete recipe."
        );
    }
}


// ==========================================
// EDIT RECIPE
// ==========================================

async function editRecipe(id) {

    const recipe =
        allRecipes.find(
            item => item.id === id
        );


    if (!recipe) {
        return;
    }


    const name =
        prompt(
            "Recipe Name:",
            recipe.name
        );


    if (name === null) {
        return;
    }


    const description =
        prompt(
            "Description:",
            recipe.description
        );


    if (description === null) {
        return;
    }


    const prepTime =
        prompt(
            "Preparation Time:",
            recipe.prepTime
        );


    if (prepTime === null) {
        return;
    }


    const mealType =
        prompt(
            "Meal Type:",
            recipe.mealType
        );


    if (mealType === null) {
        return;
    }


    const updatedRecipe = {

        name: name,

        description: description,

        prepTime:
            Number(prepTime),

        mealType: mealType,

        isFavourite:
        recipe.isFavourite
    };


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            updatedRecipe
                        )
                }
            );


        if (!response.ok) {
            throw new Error(
                "Failed to update recipe"
            );
        }


        alert(
            "Recipe updated successfully!"
        );


        await loadRecipes();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to update recipe."
        );
    }
}


// ==========================================
// SEARCH
// ==========================================

function searchRecipes() {

    const searchTerm =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();


    const filtered =
        allRecipes.filter(recipe =>

            recipe.name
                .toLowerCase()
                .includes(searchTerm)

            ||

            recipe.description
                .toLowerCase()
                .includes(searchTerm)

            ||

            recipe.mealType
                .toLowerCase()
                .includes(searchTerm)
        );


    displayRecipes(filtered);
}


// ==========================================
// SCROLL TO ADD RECIPE
// ==========================================

function scrollToAddRecipe() {

    document
        .getElementById("add")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ==========================================
// HTML SECURITY
// ==========================================

function escapeHtml(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ==========================================
// INITIAL LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    loadRecipes
);