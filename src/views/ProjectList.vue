<template>
  <div class="container mx-auto mt-8">
    <!-- Filters -->
    <div class="flex items-center space-x-4 mb-4">
      <select v-model="selectedProject" class="border p-2 rounded">
        <option value="">All projects</option>
        <option v-for="project in projects" :key="project.id" :value="project.id">{{ project.project_name }}</option>
      </select>

      <button class="bg-blue-500 text-white px-4 py-2 rounded" @click="applyFilter">APPLY FILTER</button>
    </div>

    <!-- TreeGrid Table -->
    <table class="table-auto w-full bg-white shadow-lg rounded-lg">
      <thead>
        <tr>
          <th class="px-4 py-2">Project</th>
          <th class="px-4 py-2">View Details</th>
          <th class="px-4 py-2">Start Date</th>
          <th class="px-4 py-2">Technologies Used</th>
          <th class="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <!-- Loop through filtered projects -->
        <template v-if="filteredProjects.length > 0">
          <template v-for="(project, index) in filteredProjects" :key="project.id">
            <tr class="bg-gray-100 cursor-pointer" @click="toggleProject(index)">
              <td colspan="5" class="font-bold px-4 py-2 flex justify-between items-center">
                <span>{{ project.project_name }}</span>
                <span>{{ project.expanded ? '▼' : '▶' }}</span>
              </td>
            </tr>
            <!-- Display project details if expanded -->
            <tr v-if="project.expanded">
              <td v-if="project.details.length > 0" colspan="5">
                <table class="w-full">
                  <thead>
                    <tr>
                      <th class="border px-4 py-2">Detail Description</th>
                      <th class="border px-4 py-2">Image</th>
                      <th class="border px-4 py-2">Start Date</th>
                      <th class="border px-4 py-2">Technologies Used</th>
                      <th class="border px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="detail in project.details" :key="detail.id">
                      <td class="border px-4 py-2 pl-8">{{ detail.detail_description }}</td>
                      <td class="border px-4 py-2">
                        <img :src="detail.image_url" alt="Detail Image" class="w-16 h-16" v-if="detail.image_url"/>
                        <span v-else>No Image</span>
                      </td>
                      <td class="border px-4 py-2">{{ detail.start_date }}</td>
                      <td class="border px-4 py-2">{{ detail.technologies_used }}</td>
                      <td class="border px-4 py-2 flex space-x-2">
                        <button class="bg-blue-500 text-white px-2 py-1 rounded" @click.stop="editDetail(detail)">✏️</button>
                        <button class="bg-red-500 text-white px-2 py-1 rounded" @click.stop="deleteDetail(detail.id)">🗑️</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <!-- No details available -->
              <td v-else colspan="5" class="text-center border px-4 py-2">No details available for this project.</td>
            </tr>
          </template>
        </template>
        <template v-else>
          <tr>
            <td colspan="5" class="text-center py-4">No projects available. Adjust the filters and try again.</td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
import ProjectService from '../services/ProjectService';
import ProjectDetailsService from '../services/ProjectDetailsService';

export default {
  data() {
    return {
      selectedProject: "",  // Holds the selected project ID
      projects: [],         // Holds all projects
      filteredProjects: [], // Filtered projects with their details
    };
  },
  methods: {
    // Fetch all projects from the API
    async fetchProjects() {
      try {
        const response = await ProjectService.getProjects();
        console.log('Projects:', response.data); // Log to check projects
        // Ensure that details are initialized as an empty array for each project
        this.projects = response.data.map(project => ({
          ...project,
          details: [], // Initialize details as an empty array
          expanded: false
        }));
        this.applyFilter();  // Apply the filter initially
      } catch (error) {
        console.error('Error fetching projects:', error);
        alert('An error occurred while fetching projects. Please try again later.');
      }
    },

    // Fetch project details by project ID
    async fetchProjectDetailsByProjectId(projectId) {
      try {
        const response = await ProjectDetailsService.getProjectDetailById(projectId);
        console.log('Project Details:', response.data); // Log to check details
        return response.data || [];  // Ensure that it returns an array, even if empty
      } catch (error) {
        console.error('Error fetching project details:', error);
        alert('An error occurred while fetching project details. Please try again later.');
        return []; // Return an empty array in case of an error
      }
    },

    // Apply the filter to show projects based on the selected project
    async applyFilter() {
      if (this.selectedProject) {
        try {
          // Fetch details for the selected project
          const details = await this.fetchProjectDetailsByProjectId(this.selectedProject);
          this.filteredProjects = this.projects.map((project) => {
            if (project.id === this.selectedProject) {
              return { ...project, details, expanded: true };
            }
            return { ...project, details: [], expanded: false };
          });
        } catch (error) {
          console.error('Error applying filter:', error);
        }
      } else {
        // When no project is selected, show all projects without details
        this.filteredProjects = this.projects.map((project) => ({
          ...project,
          details: [],  // Initialize details as an empty array
          expanded: false
        }));
      }
    },

    // Toggle project expansion
    async toggleProject(index) {
      const project = this.filteredProjects[index];

      // Toggle expanded state
      project.expanded = !project.expanded;

      // Only fetch details if the project is expanded and details are not already loaded
      if (project.expanded && project.details.length === 0) {
        try {
          const details = await this.fetchProjectDetailsByProjectId(project.id);
          // Directly update the filteredProjects array in Vue 3
          this.filteredProjects[index] = { ...project, details };
        } catch (error) {
          console.error('Error fetching project details:', error);
        }
      }
    },

    // Delete a project detail by ID
    async deleteDetail(id) {
      try {
        await ProjectDetailsService.deleteProjectDetail(id);
        this.applyFilter();  // Reload the details after deletion
      } catch (error) {
        console.error('Error deleting project detail:', error);
        alert('An error occurred while deleting the project detail. Please try again later.');
      }
    },

    // Edit a project detail (placeholder for edit logic)
    editDetail(detail) {
      alert(`Edit detail: ${detail.id}`); // Placeholder action for editing
    }
  },
  mounted() {
    this.fetchProjects();
  },
};
</script>

<style scoped>
.table-auto {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
}

button {
  cursor: pointer;
}
</style>
