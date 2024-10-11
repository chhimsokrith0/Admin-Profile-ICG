<template>
  <div class="container mx-auto mt-8 max-w-xl">
    <!-- Progress Indicator -->
    <div class="flex items-center justify-around mb-8">
      <div class="flex flex-col items-center">
        <div :class="['h-12 w-12 rounded-full flex items-center justify-center', step >= 1 ? 'bg-yellow-400 text-white' : 'bg-gray-300 text-white']">
          <i class="fas fa-user"></i>
        </div>
        <span class="mt-2" :class="step >= 1 ? 'text-yellow-500' : 'text-gray-500'">Project</span>
      </div>
      <div class="flex-1 h-1" :class="step > 1 ? 'bg-yellow-400' : 'bg-gray-300'"></div>
      <div class="flex flex-col items-center">
        <div :class="['h-12 w-12 rounded-full flex items-center justify-center', step >= 2 ? 'bg-yellow-400 text-white' : 'bg-gray-300 text-white']">
          <i class="fas fa-briefcase"></i>
        </div>
        <span class="mt-2" :class="step >= 2 ? 'text-yellow-500' : 'text-gray-500'">Project Detail</span>
      </div>
    </div>

    <!-- Form: Project -->
    <div>
      <h2 class="text-2xl font-semibold mb-4">Create your Project</h2>
      <p class="mb-6">Please tell us more about your project.</p>

      <!-- Step 1: Basic Project Info -->
      <div v-if="step === 1">
        <!-- Image Upload -->
        <div class="flex flex-col items-center mb-4">
          <img
            v-if="form.image_url"
            :src="form.image_url"
            alt="Project Image"
            class="rounded-full h-40 w-40 object-cover mb-2"
          />
          <img
            v-else
            src="https://via.placeholder.com/150"
            alt="Placeholder"
            class="rounded-full h-40 w-40 object-cover mb-2"
          />
          <input type="file" class="hidden" ref="imageUpload" @change="onImageUpload" />
          <button @click="triggerImageUpload" class="bg-yellow-400 text-white px-4 py-2 rounded">
            Choose Picture
          </button>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Project Name (required)</label>
          <input v-model="form.project_name" type="text" class="w-full px-4 py-2 border rounded" required />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Description</label>
          <textarea v-model="form.description" class="w-full px-4 py-2 border rounded"></textarea>
        </div>

        <!-- Next Button -->
        <div class="flex justify-end">
          <button @click="nextStep" class="bg-yellow-400 text-white px-4 py-2 rounded">
            Next
          </button>
        </div>
      </div>

      <!-- Step 2: Tree Structure -->
      <div v-if="step === 2">
        <button @click="showModal = true" class="bg-yellow-400 text-white px-4 py-2 rounded mb-4">Add Category</button>

        <!-- Modal Dialog -->
        <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 class="text-xl font-semibold mb-4">Add Category</h3>
            <div class="mb-4">
              <label class="block text-gray-700">Category Name</label>
              <input v-model="newCategory.category_name" type="text" class="w-full px-4 py-2 border rounded" />
            </div>
            <div class="flex justify-end">
              <button @click="showModal = false" class="bg-gray-400 text-white px-4 py-2 rounded mr-2">Cancel</button>
              <button @click="saveCategory" class="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
            </div>
          </div>
        </div>

        <ul class="tree">
          <li v-for="category in categories" :key="category.id">
            <span @click="toggleNode(category.id)" class="tree-node">
              <i :class="[isOpen[category.id] ? 'fas fa-folder-open' : 'fas fa-folder']"></i> {{ category.category_name }}
            </span>
            <ul v-if="isOpen[category.id]">
              <li v-for="subItem in category.subItems" :key="subItem.id">
                <span @click="toggleNode(subItem.id)" class="tree-node">
                  <i :class="[isOpen[subItem.id] ? 'fas fa-file' : 'fas fa-file-alt']"></i> {{ subItem.name }}
                </span>
              </li>
            </ul>
          </li>
        </ul>

        <!-- Back and Submit Buttons -->
        <div class="flex justify-between mt-6">
          <button @click="prevStep" class="bg-gray-400 text-white px-4 py-2 rounded">Back</button>
          <button @click="submitProject" class="bg-yellow-400 text-white px-4 py-2 rounded">Submit</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        project_name: '',
        description: '',
        image_url: ''
      },
      isOpen: {},
      step: 1,
      showModal: false,
      newCategory: {
        category_name: ''
      },
      categories: []
    };
  },
  methods: {
    nextStep() {
      if (this.form.project_name && this.form.description) {
        this.step++;
      } else {
        alert("Please fill out the required fields.");
      }
    },
    prevStep() {
      this.step--;
    },
    toggleNode(nodeId) {
      this.isOpen[nodeId] = !this.isOpen[nodeId];
    },
    submitProject() {
      if (this.form.project_name && this.form.description) {
        alert("Project submitted successfully!");
        this.resetForm();
      } else {
        alert("Please fill out all required fields.");
      }
    },
    triggerImageUpload() {
      this.$refs.imageUpload.click();
    },
    onImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.form.image_url = URL.createObjectURL(file);
      }
    },
    saveCategory() {
      if (this.newCategory.category_name) {
        const newCategory = {
          id: Date.now(),
          category_name: this.newCategory.category_name,
          subItems: []
        };
        this.categories.push(newCategory);
        this.newCategory.category_name = '';
        this.showModal = false;
      } else {
        alert("Category name is required.");
      }
    },
    resetForm() {
      this.form = {
        project_name: '',
        description: '',
        image_url: ''
      };
      this.step = 1;
      this.categories = [];
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 1250px;
  margin: 0 auto;
}

.tree {
  list-style: none;
  padding-left: 20px;
}

.tree li {
  margin: 10px 0;
}

.tree-node {
  cursor: pointer;
  font-size: 1.1rem;
}

.tree-node i {
  margin-right: 8px;
}

ul ul {
  margin-left: 15px;
}

ul ul li {
  margin: 5px 0;
}

.fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
