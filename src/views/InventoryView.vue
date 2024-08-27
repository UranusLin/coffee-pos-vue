<script setup>
import { ref, computed, onMounted } from 'vue'
import { useInventoryStore } from '../stores/inventory'

const inventoryStore = useInventoryStore()

onMounted(() => {
  inventoryStore.fetchIngredients()
})

const restockForm = ref({
  ingredient: '',
  amount: 0
})

function restock() {
  if (restockForm.value.ingredient && restockForm.value.amount > 0) {
    inventoryStore.updateStock(restockForm.value.ingredient, restockForm.value.amount)
    restockForm.value.amount = 0
    alert('Restock successful!')
  } else {
    alert('Please select an ingredient and enter a valid amount.')
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Inventory Management</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 class="text-2xl font-semibold mb-4">Current Stock</h2>
        <ul class="space-y-2">
          <li
            v-for="ingredient in inventoryStore.ingredients"
            :key="ingredient.name"
            class="flex justify-between items-center"
          >
            <span>{{ ingredient.name }}</span>
            <span>{{ ingredient.amount }} {{ ingredient.unit }}</span>
          </li>
        </ul>
      </div>

      <div>
        <h2 class="text-2xl font-semibold mb-4">Restock Ingredients</h2>
        <form @submit.prevent="restock" class="space-y-4">
          <div>
            <label for="ingredient" class="block mb-2">Ingredient:</label>
            <select
              v-model="restockForm.ingredient"
              id="ingredient"
              class="w-full p-2 border rounded"
            >
              <option
                v-for="ingredient in inventoryStore.ingredients"
                :key="ingredient.name"
                :value="ingredient.name"
              >
                {{ ingredient.name }}
              </option>
            </select>
          </div>
          <div>
            <label for="amount" class="block mb-2">Amount:</label>
            <input
              v-model.number="restockForm.amount"
              type="number"
              id="amount"
              class="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Restock
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
