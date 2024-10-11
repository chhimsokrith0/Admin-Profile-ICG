<template>
  <div class="container mx-auto mt-8">
    <h1 class="text-2xl font-bold mb-4">Profile List</h1>

    <!-- Loading Indicator -->
    <div v-if="loading" class="flex justify-center my-4">
      <div class="loader"></div> <!-- Customize your loader styling -->
      <p>Loading profiles...</p>
    </div>

    <!-- Profile Table -->
    <table v-else class="table-auto w-full bg-white shadow-lg rounded-lg">
      <thead>
        <tr>
          <th class="px-4 py-2">ID</th>
          <th class="px-4 py-2">Name</th>
          <th class="px-4 py-2">Title</th>
          <th class="px-4 py-2">Bio</th>
          <th class="px-4 py-2">LinkedIn URL</th>
          <th class="px-4 py-2">GitHub URL</th>
          <th class="px-4 py-2">Email</th>
          <th class="px-4 py-2">Profile Image</th>
          <th class="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="profiles.length > 0" v-for="profile in profiles" :key="profile.id">
          <td class="border px-4 py-2">{{ profile.id }}</td>
          <td class="border px-4 py-2">{{ profile.name }}</td>
          <td class="border px-4 py-2">{{ profile.title }}</td>
          <td class="border px-4 py-2">{{ profile.bio }}</td>
          <td class="border px-4 py-2">
            <a :href="profile.linkedin_url" target="_blank">{{ profile.linkedin_url }}</a>
          </td>
          <td class="border px-4 py-2">
            <a :href="profile.github_url" target="_blank">{{ profile.github_url }}</a>
          </td>
          <td class="border px-4 py-2">{{ profile.email }}</td>
          <td class="border px-4 py-2">
            <img :src="profile.profile_image_url" alt="Profile Image" class="h-12 w-12 rounded-full object-cover" v-if="profile.profile_image_url"/>
            <span v-else>No Image</span>
          </td>
          <td class="border px-4 py-2">
            <!-- Edit Button -->
            <button class="bg-blue-500 text-white px-4 py-2 rounded" @click="editProfile(profile)">Edit</button>
          </td>
        </tr>
        <tr v-else>
          <td colspan="9" class="text-center p-4">No profiles found</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="flex justify-center mt-4" v-if="!loading">
      <button
        class="bg-gray-300 px-4 py-2 rounded mr-2"
        :disabled="page === 1"
        @click="changePage(page - 1)"
      >
        Previous
      </button>
      <span class="px-4 py-2">Page {{ page }} of {{ totalPages }}</span>
      <button
        class="bg-gray-300 px-4 py-2 rounded ml-2"
        :disabled="page === totalPages"
        @click="changePage(page + 1)"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import ProfileService from '../services/ProfileService.js';

export default {
  data() {
    return {
      profiles: [],
      page: 1,
      perPage: 10,
      totalPages: 1,
      loading: false, // Add loading state
    };
  },
  created() {
    this.fetchProfiles();
  },
  methods: {
    async fetchProfiles() {
      this.loading = true; // Start loading
      try {
        const response = await ProfileService.getProfiles(this.page, this.perPage);
        this.profiles = response.data || [];
        if (this.profiles.length > 0) {
          this.totalPages = Math.ceil(response.data.length / this.perPage);
        } else {
          alert('No profiles found.');
        }
      } catch (error) {
        console.error('Error fetching profiles:', error);
        alert('Error fetching profiles.');
      } finally {
        this.loading = false; // Stop loading
      }
    },
    changePage(newPage) {
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.page = newPage;
        this.fetchProfiles();
      }
    },
    editProfile(profile) {
      this.$router.push({ name: 'EditProfile', params: { id: profile.id } });
    },
  },
};
</script>

<style scoped>
/* Custom Loader Styles */
.loader {
  border: 5px solid #f3f3f3;
  border-radius: 50%;
  border-top: 5px solid #3498db;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
