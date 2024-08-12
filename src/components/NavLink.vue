<script setup>
defineProps(['to'])
</script>

<template>
  <RouterLink
    :to="to"
    class="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent"
  >
    <slot></slot>
  </RouterLink>
</template>
