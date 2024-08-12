<script setup>
defineProps({
  to: {
    type: String,
    required: true
  },
  styleClass: {
    type: String,
    required: true
  }
})
</script>

<template>
  <RouterLink :to="to" :class="styleClass">
    <slot></slot>
  </RouterLink>
</template>
