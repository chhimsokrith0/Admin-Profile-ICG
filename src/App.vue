<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar Component -->
    <Sidebar :isSidebarOpen="isSidebarOpen" />

    <!-- Main content area -->
    <div class="flex-1 flex flex-col overflow-y-auto">
      <Header @toggleSidebar="isSidebarOpen = !isSidebarOpen" />
      <main class="flex-1 pb-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue';
import Header from './components/Header.vue';

export default {
  components: {
    Sidebar,
    Header,
  },
  data() {
    return {
      isSidebarOpen: false, // Toggle sidebar for mobile
    };
  },
};
</script>

<style>
@import './index.css';
</style>
