<template>
  <div class="flex">
    <Sidebar />
    <div class="flex-1 p-6">
      <Header />
      <router-view />
    </div>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue';
import Header from './components/Header.vue';


export default {
  components: {
    Sidebar,
    Header
  }
};
</script>

<style>
@import './index.css';
</style>
