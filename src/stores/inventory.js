import { defineStore } from 'pinia'
import api from '@/services/api'

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    ingredients: [],
    recipes: [],
    menuItems: []
  }),
  actions: {
    async updateStock(ingredient, amount) {
      try {
        ingredient = ingredient.toLowerCase()
        const ingredientObj = this.ingredients.find((ingred) => ingred.id === ingredient)
        if (!ingredientObj) throw new Error(`Ingredient not found: ${ingredient}`)
        const response = await api.updateIngredient(ingredient, {
          amount: Number(ingredientObj.amount) + Number(amount)
        })
        const index = this.ingredients.findIndex((i) => i.id === ingredient)
        this.ingredients[index] = response.data
      } catch (error) {
        console.error('Error updating stock:', error)
      }
    },
    async consumeIngredients(recipeId) {
      const recipe = this.recipes.find((r) => r.id === recipeId)
      if (!recipe) {
        console.warn(`Recipe not found: ${recipe}`)
        return
      }
      for (const [ingredient, amount] of Object.entries(recipe.ingredients)) {
        const ingredientObj = this.ingredients.find((i) => i.id === ingredient)
        if (ingredientObj) {
          ingredientObj.amount -= amount
          await api.updateIngredient(ingredientObj.id, { amount: ingredientObj.amount })
        }
      }
    },
    checkStock(recipeId) {
      const recipe = this.recipes.find((r) => r.id === recipeId)
      if (!recipe) {
        console.warn(`Recipe not found: ${recipe}`)
        return true
      }
      for (const [ingredient, amount] of Object.entries(recipe.ingredients)) {
        const ingredientObj = this.ingredients.find((i) => i.id === ingredient)
        if (!ingredientObj || ingredientObj.amount < amount) {
          return false
        }
      }
      return true
    },
    addOrUpdateRecipe(code, recipe) {
      this.recipes[code] = recipe
    },
    checkTotalStock(orderItems) {
      const totalNeeded = {}

      // 計算訂單所需的總原料量
      for (const item of orderItems) {
        const recipe = this.recipes.find((r) => r.id === item.code)
        if (!recipe) {
          console.warn(`Recipe not found: ${item.code}`)
          continue
        }
        for (const [ingredient, amount] of Object.entries(recipe.ingredients)) {
          totalNeeded[ingredient] = (totalNeeded[ingredient] || 0) + amount
        }
      }

      // 檢查是否有足夠的庫存
      for (const [ingredient, amount] of Object.entries(totalNeeded)) {
        const ingredientObj = this.ingredients.find((i) => i.id === ingredient)
        if (!ingredientObj || ingredientObj.amount < amount) {
          return { success: false, ingredient: ingredient }
        }
      }

      return { success: true }
    },

    consumeTotalIngredients(orderItems) {
      for (const item of orderItems) {
        this.consumeIngredients(item.code)
      }
    },
    async fetchMenu() {
      try {
        const response = await api.getMenu()
        this.menuItems = response.data
      } catch (error) {
        console.error('Error fetching menu:', error)
      }
    },
    async fetchIngredients() {
      try {
        const response = await api.getIngredients()
        this.ingredients = response.data
      } catch (error) {
        console.error('Error fetching ingredients:', error)
      }
    },
    async fetchRecipes() {
      try {
        const response = await api.getRecipes()
        this.recipes = response.data
      } catch (error) {
        console.error('Error fetching recipes:', error)
      }
    }
  },
  getters: {
    getIngredientStock: (state) => (ingredient) => {
      return state.ingredients[ingredient].amount
    },
    getAllIngredients: (state) => {
      return Object.values(state.ingredients)
    }
  }
})
