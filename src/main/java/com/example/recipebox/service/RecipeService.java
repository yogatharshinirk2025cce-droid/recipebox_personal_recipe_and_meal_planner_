package com.example.recipebox.service;

import com.example.recipebox.entity.Recipe;
import com.example.recipebox.repository.RecipeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RecipeService {

    private final RecipeRepository recipeRepository;

    public RecipeService(RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    // CREATE
    public Recipe createRecipe(Recipe recipe) {
        return recipeRepository.save(recipe);
    }

    // READ ALL
    public List<Recipe> getAllRecipes() {
        return recipeRepository.findAll();
    }

    // READ ONE
    public Optional<Recipe> getRecipeById(Long id) {
        return recipeRepository.findById(id);
    }

    // UPDATE
    public Recipe updateRecipe(Long id, Recipe updatedRecipe) {

        Recipe existingRecipe = recipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recipe not found with id: " + id));

        existingRecipe.setName(updatedRecipe.getName());
        existingRecipe.setDescription(updatedRecipe.getDescription());
        existingRecipe.setPrepTime(updatedRecipe.getPrepTime());
        existingRecipe.setMealType(updatedRecipe.getMealType());
        existingRecipe.setIsFavourite(updatedRecipe.getIsFavourite());

        return recipeRepository.save(existingRecipe);
    }

    // DELETE
    public void deleteRecipe(Long id) {

        if (!recipeRepository.existsById(id)) {
            throw new RuntimeException("Recipe not found with id: " + id);
        }

        recipeRepository.deleteById(id);
    }
}