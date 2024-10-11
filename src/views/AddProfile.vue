<template>
  <div class="container mx-auto mt-8 flex space-x-8">
    <!-- Left Side: Profile Picture -->
    <div class="w-1/3 bg-white shadow-lg rounded-lg p-4">
      <h2 class="text-lg font-bold mb-4">Profile Picture</h2>
      <div class="flex flex-col items-center">
        <img v-if="form.profile_image_url" :src="form.profile_image_url" alt="Profile Image" class="rounded-full h-40 w-40 object-cover" />
        <img v-else src="https://via.placeholder.com/150" alt="Placeholder" class="rounded-full h-40 w-40 object-cover" />
        <p class="text-sm text-gray-500 mt-2">JPG or PNG no larger than 5 MB</p>
        <input type="file" accept="image/*" class="hidden" ref="imageUpload" @change="onImageUpload" />
        <button type="button" @click="triggerImageUpload" class="bg-blue-500 text-white px-4 py-2 rounded mt-4">
          Upload new image
        </button>
      </div>
    </div>

    <!-- Right Side: Profile Form -->
    <div class="w-2/3 bg-white shadow-lg rounded-lg p-4">
      <h2 class="text-lg font-bold mb-4">{{ isEditing ? 'Edit Profile' : 'Add Profile' }}</h2>
      <form @submit.prevent="submitProfile">
        <div class="mb-4">
          <label class="block text-gray-700">Name</label>
          <input v-model="form.name" type="text" class="w-full px-4 py-2 border rounded" required />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Title</label>
          <input v-model="form.title" type="text" class="w-full px-4 py-2 border rounded" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Bio</label>
          <textarea v-model="form.bio" class="w-full px-4 py-2 border rounded"></textarea>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">LinkedIn URL</label>
          <input v-model="form.linkedin_url" type="url" class="w-full px-4 py-2 border rounded" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">GitHub URL</label>
          <input v-model="form.github_url" type="url" class="w-full px-4 py-2 border rounded" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Email Address</label>
          <input v-model="form.email" type="email" class="w-full px-4 py-2 border rounded" required />
        </div>
        <div class="flex justify-end">
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">{{ isEditing ? 'Save Changes' : 'Add Profile' }}</button>
        </div>
      </form>

      <!-- Success Message -->
      <div v-if="successMessage" class="mt-4 text-green-600">
        {{ successMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import ProfileService from '../services/ProfileService.js';

export default {
  props: ['id'],
  data() {
    return {
      form: {
        name: '',
        title: '',
        bio: '',
        linkedin_url: '',
        github_url: '',
        email: '',
        profile_image_url: '',
      },
      successMessage: '',
      isEditing: false,
    };
  },
  created() {
    if (this.id) {
      this.isEditing = true;
      this.fetchProfile();
    }
  },
  methods: {
    async fetchProfile() {
      try {
        const response = await ProfileService.getProfileById(this.id);
        this.form = response.data;
      } catch (error) {
        console.error('Error fetching profile:', error);
        alert('Error fetching profile.');
      }
    },
    async submitProfile() {
      try {
        const formData = new FormData();
        formData.append('name', this.form.name);
        formData.append('title', this.form.title);
        formData.append('bio', this.form.bio);
        formData.append('linkedin_url', this.form.linkedin_url);
        formData.append('github_url', this.form.github_url);
        formData.append('email', this.form.email);

        if (this.$refs.imageUpload.files[0]) {
          formData.append('profileImage', this.$refs.imageUpload.files[0]);
        }

        if (this.isEditing) {
          await ProfileService.updateProfile(this.id, formData);
          this.successMessage = 'Profile updated successfully!';
        } else {
          await ProfileService.createProfile(formData);
          this.successMessage = 'Profile added successfully!';
        }
      } catch (error) {
        console.error('Error saving profile:', error);
      }
    },
    triggerImageUpload() {
      this.$refs.imageUpload.click();
    },
    onImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.form.profile_image_url = URL.createObjectURL(file);
      }
    },
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
