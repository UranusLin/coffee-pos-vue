<script setup></script>

<template>
  <div class="min-h-screen bg-gray-200">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <RouterLink to="/" class="flex-shrink-0 flex items-center">
              Coffee Shop POS
            </RouterLink>
            <div class="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
              <RouterLink
                to="/checkout"
                class="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent"
              >
                Checkout
              </RouterLink>
              <RouterLink
                to="/inventory"
                class="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent"
              >
                Inventory
              </RouterLink>
              <RouterLink
                to="/transactions"
                class="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent"
              >
                Transactions
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <RouterView></RouterView>
      </div>
    </main>
  </div>
</template>
