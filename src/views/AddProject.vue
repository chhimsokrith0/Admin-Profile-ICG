<template>
  <div class="container mx-auto mt-8 max-w-4xl">
    <!-- Toast component -->
    <Toast />

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
        <p class="text-sm text-gray-500 mt-1">Max 500 characters</p>
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
            <label class="block text-gray-700">Select Category *</label>
            <select v-model="detail.category_id" class="w-full px-4 py-2 border rounded" required>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.category_name }}
              </option>
            </select>
          </div>
          <button v-if="form.details.length > 1" @click="removeDetail(index)" class="text-red-500">
            <i class="fas fa-trash fa-2x"></i>
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
          <p class="text-sm text-gray-500 mt-1">Max 500 characters</p>
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

      <!-- Button with Icon for Adding Detail -->
      <button @click="addDetail" class="bg-blue-500 text-white px-4 py-2 rounded mb-4 flex items-center">
        <i class="fas fa-plus mr-2"></i> Add Detail
      </button>

      <!-- Button with Icon for Adding Category -->
      <button @click="showCategoryModal = true" class="bg-green-500 text-white px-4 py-2 rounded mb-4 flex items-center">
        <i class="fas fa-plus mr-2"></i> Add Category
      </button>
    </div>

    <!-- Submit Button with Loading State -->
    <div class="flex justify-end mt-6">
      <button @click="submitAll" class="bg-blue-500 text-white px-4 py-2 rounded flex items-center" :disabled="loading">
        <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
        {{ loading ? 'Submitting...' : 'Submit' }}
      </button>
    </div>

    <!-- Category Modal -->
    <div v-if="showCategoryModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg z-50">
        <h2 class="text-xl font-bold mb-4">Add New Category</h2>
        <div class="mb-4">
          <label class="block text-gray-700">Category Name *</label>
          <input v-model="newCategory.category_name" type="text" class="w-full px-4 py-2 border rounded" required />
        </div>
        <div class="flex justify-end">
          <!-- Loading Button -->
          <button
            @click="addCategory"
            class="bg-green-500 text-white px-4 py-2 rounded mr-2 flex items-center"
            :disabled="loading"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
            {{ loading ? 'Adding...' : 'Add Category' }}
          </button>
          <button @click="closeModal" class="bg-gray-500 text-white px-4 py-2 rounded">
            Close
          </button>
        </div>
      </div>
      <div class="fixed inset-0 bg-gray-900 bg-opacity-50"></div>
    </div>
  </div>
</template>

<script>
import ProjectService from '../services/ProjectService';
import CategoryService from '../services/CategoryService';
import { useToast } from 'primevue/usetoast'; // Import PrimeVue Toast hook

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
        profile_id: 1,
        details: [
          {
            category_id: '',
            description: '',
            technologies_used: '',
            image_url: '',
            image_name: '',
            file_url: '',
            file_name: ''
          }
        ]
      },
      categories: [],
      imageUploadRefs: [],
      fileUploadRefs: [],
      showCategoryModal: false,
      newCategory: {
        category_name: ''
      },
      loading: false, // Added loading state
    };
  },
  mounted() {
    this.fetchCategories();
  },
  setup() {
    const toast = useToast(); // Initialize toast

    return { toast };
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await CategoryService.getAllCategories();
        this.categories = response;
      } catch (error) {
        this.toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch categories', life: 3000 });
      }
    },
    async addCategory() {
      this.loading = true; // Enable loading spinner
      try {
        const category = await CategoryService.createCategory(this.newCategory);

        if (category) {
          this.categories.push(category);
          this.toast.add({ severity: 'success', summary: 'Success', detail: 'Category added successfully!', life: 3000 });
        } else {
          throw new Error('Failed to add category');
        }

        this.closeModal();
      } catch (error) {
        this.toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to add category', life: 3000 });
      } finally {
        this.loading = false; // Disable loading spinner
      }
    },
    closeModal() {
      this.showCategoryModal = false;
      this.newCategory.category_name = ''; // Reset category input
    },
    triggerImageUpload() {
      this.$refs.imageUpload.click();
    },
    triggerDetailImageUpload(index) {
      this.imageUploadRefs[index].click();
    },
    triggerDetailFileUpload(index) {
      this.fileUploadRefs[index].click();
    },
    setImageUploadRef(index) {
      return (el) => {
        if (el) {
          this.imageUploadRefs[index] = el;
        }
      };
    },
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
        category_id: '',
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
    async submitAll() {
      this.loading = true; // Enable loading spinner
      try {
        const formData = new FormData();

        formData.append('project_name', this.form.project_name);
        formData.append('start_date', this.form.start_date);
        formData.append('end_date', this.form.end_date);
        formData.append('description', this.form.description);
        formData.append('profile_id', this.form.profile_id);

        if (this.$refs.imageUpload.files[0]) {
          formData.append('project_image', this.$refs.imageUpload.files[0]);
        }

        this.form.details.forEach((detail, index) => {
          formData.append(`details[${index}][category_id]`, detail.category_id);
          formData.append(`details[${index}][description]`, detail.description);
          formData.append(`details[${index}][technologies_used]`, detail.technologies_used);

          if (this.imageUploadRefs[index] && this.imageUploadRefs[index].files[0]) {
            formData.append(`details[${index}][detail_image]`, this.imageUploadRefs[index].files[0]);
          }

          if (this.fileUploadRefs[index] && this.fileUploadRefs[index].files[0]) {
            formData.append(`details[${index}][detail_file]`, this.fileUploadRefs[index].files[0]);
          }
        });

        const response = await ProjectService.createProject(formData);

        this.toast.add({ severity: 'success', summary: 'Success', detail: 'Project successfully submitted!', life: 3000 });
        this.resetForm();
      } catch (error) {
        this.toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to submit project', life: 3000 });
      } finally {
        this.loading = false; // Disable loading spinner
      }
    },
    resetForm() {
      this.form = {
        project_name: '',
        start_date: '',
        end_date: '',
        description: '',
        image_url: '',
        image_name: '',
        profile_id: 1,
        details: [
          {
            category_id: '',
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
