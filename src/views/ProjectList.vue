<template>
  <div class="container mx-auto mt-8 flex">
    <!-- Tree Project (Left) -->
    <div class="w-1/4 pr-4">
      <h1 class="text-2xl font-bold mb-4">Project List</h1>

      <!-- Loading Indicator -->
      <div v-if="loading" class="flex justify-center my-4">
        <div class="loader"></div>
        <p>Loading projects...</p>
      </div>

      <!-- Tree View for Projects -->
      <Tree
        v-else
        :value="projectTreeNodes"
        :filter="true"
        filterMode="lenient"
        class="w-full cursor-pointer"
        @node-select="onProjectSelect"
      />

    </div>

    <!-- Category Tree (Middle) -->
    <div class="w-1/4 px-4">
      <h2 class="text-xl font-bold mb-4">Category Tree</h2>
      <Tree
        :value="categoryTreeNodes"
        :filter="true"
        filterMode="lenient"
        class="w-full"
        @node-select="onCategorySelect"
        v-if="categoryTreeNodes.length > 0"
      />
      <p v-else class="text-center">Select a project to view categories.</p>
    </div>

    <!-- Project Details Table (Right) -->
    <div class="w-1/2 pl-4">
      <h2 class="text-xl font-bold mb-4">Project Details</h2>

      <table class="table-auto w-full bg-white shadow-lg rounded-lg">
        <thead>
          <tr>
            <th class="px-4 py-2">No</th>
            <th class="px-4 py-2">Project Name</th>
            <th class="px-4 py-2">Detail Description</th>
            <th class="px-4 py-2">Technologies Used</th>
            <th class="px-4 py-2">Image URL</th>
            <th class="px-4 py-2">Documentation URL</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(detail, index) in projectDetails" :key="index">
            <td class="border px-4 py-2">{{ index + 1 }}</td>
            <td class="border px-4 py-2">{{ detail.project_name }}</td>
            <td class="border px-4 py-2">{{ detail.detail_description }}</td>
            <td class="border px-4 py-2">{{ detail.technologies_used }}</td>
            <td class="border px-4 py-2"><a :href="detail.image_url" target="_blank">{{ detail.image_url }}</a></td>
            <td class="border px-4 py-2"><a :href="detail.documentation_url" target="_blank">{{ detail.documentation_url }}</a></td>
          </tr>
          <tr v-if="projectDetails.length === 0">
            <td colspan="6" class="text-center p-4">Select a category to view project details.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

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
</template>

<script>
import ProjectService from '../services/ProjectService.js';
import CategoryService from '../services/CategoryService.js';
import ProjectDetailsService from '../services/ProjectDetailsService.js';
import Tree from 'primevue/tree';

export default {
  components: {
    Tree,
  },
  data() {
    return {
      projects: [],
      page: 1,
      perPage: 10,
      totalPages: 1,
      loading: false,
      projectTreeNodes: [],
      categoryTreeNodes: [],
      projectDetails: [],
      selectedProject: null,
    };
  },
  created() {
    this.fetchProjects();
  },
  methods: {
    async fetchProjects() {
      this.loading = true;
      try {
        const response = await ProjectService.getProjects(this.page, this.perPage);
        this.projects = response.data || [];
        if (this.projects.length > 0) {
          this.totalPages = Math.ceil(response.total / this.perPage);
          this.constructProjectTree();
        } else {
          alert('No projects found.');
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        alert('Error fetching projects.');
      } finally {
        this.loading = false;
      }
    },
    changePage(newPage) {
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.page = newPage;
        this.fetchProjects();
      }
    },
    constructProjectTree() {
  // Construct the tree structure for projects
  this.projectTreeNodes = this.projects.map(project => ({
    key: project.id.toString(), // Ensure key is a string
    label: project.project_name,
    icon: 'pi pi-folder',
    data: project,
  }));
  console.log('Constructed project tree nodes:', this.projectTreeNodes); // Debugging output
},

async onProjectSelect(event) {
  // Check if the event and the node are defined
  if (event && event.node) {
    // Debugging output to verify the selected project
    console.log('Project selected:', event.node);

    // Alert to show which project is clicked
    alert(`Project clicked: ${event.node.label}`);

    // Proceed to fetch categories related to the selected project
    const projectId = event.node.data.id;
    this.selectedProject = event.node.data;
    try {
      // Fetch categories for the selected project
      const response = await CategoryService.getAllCategories();
      this.categoryTreeNodes = response.data
        .filter(category => category.project_id === projectId)
        .map(category => ({
          key: category.id.toString(), // Convert the key to string
          label: category.category_name,
          icon: 'pi pi-folder-open',
          data: category,
        }));

      // Clear project details when selecting a new project
      this.projectDetails = [];
    } catch (error) {
      // Error handling if categories could not be fetched
      console.error('Error fetching categories:', error);
      alert('Error fetching categories.');
    }
  } else {
    // Error handling if the event data is not valid
    console.error('Invalid event data:', event);
  }
},
    async onCategorySelect(event) {
      const categoryId = event.node.data.id;
      try {
        const response = await ProjectDetailsService.getAllProjectDetails();
        this.projectDetails = response.data
          .filter(detail => detail.category_id === categoryId)
          .map(detail => ({
            project_name: this.selectedProject.project_name,
            detail_description: detail.detail_description,
            technologies_used: detail.technologies_used,
            image_url: detail.image_url,
            documentation_url: detail.documentation_url,
          }));
      } catch (error) {
        console.error('Error fetching project details:', error);
        alert('Error fetching project details.');
      }
    },
  },
};
</script>

<style scoped>
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
