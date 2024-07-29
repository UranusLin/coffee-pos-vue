<script setup></script>

<template>
  <div class="max-w-4xl mx-auto p-8">
    <h1 class="text-4xl font-bold text-center mb-8">Welcome to Coffee Shop POS</h1>
    <div class="grid grid-col-1 md:grid-col-3 gap-6">
      <RouterLink
        to="/checkout"
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-6 px-4 rounded-lg text-center transition duration-300 ease-in-out transform hover:scale-105"
      >
        <i class="fas fa-cash-register text-4xl mb-2"></i>
        <h2 class="text-2xl">Checkout</h2>
        <p class="mt-2">Process orders and payments</p>
      </RouterLink>
      <RouterLink
        to="/inventory"
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-6 px-4 rounded-lg text-center transition duration-300 ease-in-out transform hover:scale-105"
      >
        <i class="fas fa-cash-register text-4xl mb-2"></i>
        <h2 class="text-2xl">Inventory</h2>
        <p class="mt-2">Manage stock and items</p>
      </RouterLink>
      <RouterLink
        to="/transactions"
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-6 px-4 rounded-lg text-center transition duration-300 ease-in-out transform hover:scale-105"
      >
        <i class="fas fa-cash-register text-4xl mb-2"></i>
        <h2 class="text-2xl">Transactions</h2>
        <p class="mt-2">View sales history</p>
      </RouterLink>
    </div>
  </div>
</template>
