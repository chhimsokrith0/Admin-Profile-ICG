<template>
  <div class="container mx-auto mt-8 max-w-4xl">
    <!-- Form Header -->
    <div class="text-center mb-10">
      <h1 class="text-3xl font-semibold text-gray-800">Add New Project, Detail & Category</h1>
    </div>

    <!-- Step 1: Add Project -->
    <div>
      <h2 class="text-2xl font-semibold mb-4">Add Project</h2>
      <div class="mb-4">
        <label class="block text-gray-700">Project Name *</label>
        <input v-model="form.project_name" type="text" class="w-full px-4 py-2 border rounded" required />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700">Start Date *</label>
        <input v-model="form.start_date" type="date" class="w-full px-4 py-2 border rounded" required />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700">End Date *</label>
        <input v-model="form.end_date" type="date" class="w-full px-4 py-2 border rounded" required />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700">Description *</label>
        <textarea
          v-model="form.description"
          class="w-full px-4 py-2 border rounded resize-y"
          placeholder="Enter a detailed description of the project here..."
          maxlength="500"
          rows="5"
          required
        ></textarea>
        <p class="text-sm text-gray-500 mt-1">Max 500 characters</p> <!-- Added character limit info -->
      </div>

      <!-- Image Upload Section -->
      <div class="mb-4">
        <label class="block text-gray-700">Upload Image Project</label>
        <div
          id="image-preview"
          class="max-w-sm p-6 mb-4 bg-gray-100 border-dashed border-2 border-gray-400 rounded-lg items-center mx-auto text-center cursor-pointer hover:border-blue-500"
          @click="triggerImageUpload"
        >
          <input ref="imageUpload" type="file" class="hidden" accept="image/*" @change="onImageUpload" />
          <div v-if="!form.image_url" class="flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 text-blue-500 mb-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-700">Choose an Image to upload</h5>
          </div>
          <div v-else>
            <img :src="form.image_url" alt="Project Image Preview" class="h-40 w-40 object-cover mx-auto" />
            <p class="mt-2 text-sm text-gray-600">{{ form.image_name }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 2: Add Project Details and Categories -->
    <div class="mt-10">
      <h2 class="text-2xl font-semibold mb-4">Add Project Detail</h2>
      <div v-for="(detail, index) in form.details" :key="index" class="border border-gray-300 rounded-lg p-4 mb-6 bg-white shadow-lg">
        <div class="flex justify-between mb-2">
          <div class="flex-grow mr-4">
            <label class="block text-gray-700">Add Category *</label>
            <input v-model="detail.category_name" type="text" class="w-full px-4 py-2 border rounded" required />
          </div>
          <!-- Show delete icon only if more than one category -->
          <button v-if="form.details.length > 1" @click="removeDetail(index)" class="text-red-500">
            <i class="fas fa-trash fa-2x"></i> <!-- Increased size of trash icon to fa-2x -->
          </button>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Description Project Detail *</label>
          <textarea
            v-model="detail.description"
            class="w-full px-4 py-2 border rounded resize-y"
            placeholder="Enter the project detail description..."
            maxlength="500"
            rows="4"
            required
          ></textarea>
          <p class="text-sm text-gray-500 mt-1">Max 500 characters</p> <!-- Character limit for detail description -->
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Technologies Used *</label>
          <input v-model="detail.technologies_used" type="text" class="w-full px-4 py-2 border rounded" required />
        </div>

        <!-- Image Upload Section for Project Detail -->
        <div class="mb-4">
          <label class="block text-gray-700">Upload Image Project Detail</label>
          <div
            id="image-preview"
            class="max-w-sm p-6 mb-4 bg-gray-100 border-dashed border-2 border-gray-400 rounded-lg items-center mx-auto text-center cursor-pointer hover:border-blue-500"
            @click="triggerDetailImageUpload(index)"
          >
            <input :ref="setImageUploadRef(index)" type="file" class="hidden" accept="image/*" @change="onDetailImageUpload($event, index)" />
            <div v-if="!detail.image_url" class="flex flex-col items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 text-blue-500 mb-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-700">Choose an Image to upload</h5>
            </div>
            <div v-else>
              <img :src="detail.image_url" alt="Detail Image Preview" class="h-32 w-32 object-cover mx-auto" />
              <p class="mt-2 text-sm text-gray-600">{{ detail.image_name }}</p>
            </div>
          </div>
        </div>

        <!-- File Upload Section for Project Detail -->
        <div class="mb-4">
          <label class="block text-gray-700">Upload File Project Details</label>
          <div class="border-dashed border-2 border-blue-400 p-4 flex flex-col items-center justify-center cursor-pointer" @click="triggerDetailFileUpload(index)">
            <i class="fas fa-cloud-upload-alt text-blue-400 text-4xl mb-2"></i>
            <span class="text-blue-400">Click To Upload</span>
            <input :ref="setFileUploadRef(index)" type="file" @change="onDetailFileUpload($event, index)" class="hidden" />
          </div>
          <div v-if="detail.file_url" class="mt-4 flex items-center">
            <span class="bg-blue-500 text-white px-2 py-1 rounded mr-2">PDF</span>
            <span class="text-gray-700">{{ detail.file_name }}</span>
            <button @click="removeFile(index)" class="text-red-500 ml-2"><i class="fas fa-times"></i></button>
          </div>
        </div>
      </div>

      <!-- Button with Icon for Adding Category -->
      <button @click="addDetail" class="bg-blue-500 text-white px-4 py-2 rounded mb-4 flex items-center">
        <i class="fas fa-plus mr-2"></i> Add Category
      </button>
    </div>

    <!-- Submit Button with Icon -->
    <div class="flex justify-end mt-6">
      <button @click="submitAll" class="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
        <i class="fas fa-paper-plane mr-2"></i> Submit
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        project_name: '',
        start_date: '',
        end_date: '',
        description: '',
        image_url: '',
        image_name: '',
        details: [
          {
            category_name: '',
            description: '',
            technologies_used: '',
            image_url: '',
            image_name: '',
            file_url: '',
            file_name: ''
          }
        ]
      },
      imageUploadRefs: [],
      fileUploadRefs: []
    };
  },
  methods: {
    // Trigger main image upload
    triggerImageUpload() {
      this.$refs.imageUpload.click();
    },

    // Trigger detail image upload
    triggerDetailImageUpload(index) {
      this.imageUploadRefs[index].click();
    },

    // Trigger file upload for project detail
    triggerDetailFileUpload(index) {
      this.fileUploadRefs[index].click();
    },

    // Set the dynamic refs for images
    setImageUploadRef(index) {
      return (el) => {
        if (el) {
          this.imageUploadRefs[index] = el;
        }
      };
    },

    // Set the dynamic refs for files
    setFileUploadRef(index) {
      return (el) => {
        if (el) {
          this.fileUploadRefs[index] = el;
        }
      };
    },

    onImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.form.image_url = URL.createObjectURL(file);
        this.form.image_name = file.name;
      }
    },

    onDetailImageUpload(event, index) {
      const file = event.target.files[0];
      if (file) {
        this.form.details[index].image_url = URL.createObjectURL(file);
        this.form.details[index].image_name = file.name;
      }
    },

    onDetailFileUpload(event, index) {
      const file = event.target.files[0];
      if (file) {
        this.form.details[index].file_url = URL.createObjectURL(file);
        this.form.details[index].file_name = file.name;
      }
    },

    addDetail() {
      this.form.details.push({
        category_name: '',
        description: '',
        technologies_used: '',
        image_url: '',
        image_name: '',
        file_url: '',
        file_name: ''
      });
    },

    removeDetail(index) {
      this.form.details.splice(index, 1);
    },

    removeFile(index) {
      this.form.details[index].file_url = '';
      this.form.details[index].file_name = '';
    },

    submitAll() {
      alert('All information has been successfully submitted!');
      this.resetForm();
    },

    resetForm() {
      this.form = {
        project_name: '',
        start_date: '',
        end_date: '',
        description: '',
        image_url: '',
        image_name: '',
        details: [
          {
            category_name: '',
            description: '',
            technologies_used: '',
            image_url: '',
            image_name: '',
            file_url: '',
            file_name: ''
          }
        ]
      };
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 1250px;
  margin: 0 auto;
}
.border-dashed {
  border-style: dashed;
}
</style>
