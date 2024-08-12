<script setup>
import MenuCard from '@/components/MenuCard.vue'

const styleClass =
  'bg-blue-500 hover:bg-blue-600 text-white font-bold py-6 px-4 rounded-lg text-center transition duration-300 ease-in-out transform hover:scale-105'

const menuItems = [
  {
    to: '/checkout',
    icon: 'fas fa-cash-register',
    title: 'Checkout',
    description: 'Process orders and payments'
  },
  {
    to: '/inventory',
    icon: 'fas fa-boxes',
    title: 'Inventory',
    description: 'Manage stock and items'
  },
  {
    to: '/transactions',
    icon: 'fas fa-clock-rotate-left',
    title: 'Transactions',
    description: 'View sales history'
  }
]
</script>

<template>
  <div class="max-w-4xl mx-auto p-8">
    <h1 class="text-4xl font-bold text-center mb-8">Welcome to Coffee Shop POS</h1>
    <div class="grid grid-col-1 md:grid-col-3 gap-6">
      <MenuCard v-for="item in menuItems" :key="item.to" :to="item.to" :styleClass="styleClass">
        <i :class="['fas', item.icon, 'text-4xl mb-2']"></i>
        <h2 class="text-2xl">{{ item.title }}</h2>
        <p class="mt-2">{{ item.description }}</p>
      </MenuCard>
    </div>
  </div>
</template>
