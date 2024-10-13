<template>
  <header class="bg-gray-800 text-white p-4 flex items-center justify-between">
    <button @click="$emit('toggleSidebar')" class="lg:hidden">
      <i class="fas fa-bars"></i>
    </button>
    <div class="text-lg font-semibold">Dashboard</div>
  </header>
</template>

<script>
export default {
  name: 'Header',
};
</script>

<style scoped>
.bg-gray-800 {
  background-color: #2d3748;
}
.text-white {
  color: #fff;
}
</style>
