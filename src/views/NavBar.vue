<script setup>
import MenuCard from '@/components/MenuCard.vue'

const styleClass = 'text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent'

const navLinks = [
  { to: '/checkout', text: 'Checkout' },
  { to: '/inventory', text: 'Inventory' },
  { to: '/transactions', text: 'Transactions' }
]
</script>

<template>
  <nav class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <RouterLink to="/" class="flex-shrink-0 flex items-center"> Coffee Shop POS </RouterLink>
          <div class="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
            <MenuCard
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              :styleClass="styleClass"
            >
              {{ link.text }}
            </MenuCard>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
