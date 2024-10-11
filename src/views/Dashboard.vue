<template>
  <div class="flex justify-between items-center mb-6">
    <div class="bg-gray-200 p-2 rounded-lg flex items-center">
      <i class="fas fa-calendar-alt text-gray-600 mr-2"></i>
      <span>Dec 29, 2023 - Jan 4, 2024</span>
    </div>
    <button class="bg-gray-200 p-2 rounded-lg">Daily</button>
  </div>
  <VisitorsAnalytics />
  <Statistics />
  <div class="grid grid-cols-2 gap-6">
    <TopCountries />
    <TopContent />
  </div>
</template>

<script>
  import VisitorsAnalytics from '../components/VisitorsAnalytics.vue';
  import Statistics from '../components/Statistics.vue';
  import TopCountries from '../components/TopCountries.vue';
  import TopContent from '../components/TopContent.vue';
  export default {
  components: {
    VisitorsAnalytics,
    Statistics,
    TopCountries,
    TopContent
  }
};
</script>