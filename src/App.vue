<script setup>
import Toaster from '@/components/ui/toast/Toaster.vue'
import NavBar from './views/NavBar.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-200">
    <NavBar />
    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <RouterView></RouterView>
      </div>
      <Toaster />
    </main>
  </div>
</template>
