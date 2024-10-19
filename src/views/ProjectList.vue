<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <div class="w-64 bg-blue-800 text-white p-4">
      <h2 class="text-lg font-semibold mb-6">Navigation</h2>
      <ul class="space-y-2">
        <li class="font-medium">Category List</li>

        <!-- Dynamically generated category list -->
        <li v-for="category in categories" :key="category.id" class="mb-1">
          <a
            href="#"
            @click.prevent="fetchProjectDetailsByCategory(category.id)"
            class="nav-link transition">
            {{ category.category_name }}
          </a>
        </li>

      </ul>
    </div>

    <!-- Main Content -->
    <div class="flex-1 p-8 bg-gray-100">
      <!-- Top Bar with Filter and Add buttons -->
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center space-x-4">
          <!-- Dropdown to filter by category -->
          <select v-model="selectedCategory" @change="fetchProjectDetailsByCategory" class="border rounded px-4 py-2">
            <option value="all">All categories</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.category_name }}
            </option>
          </select>

          <!-- Search bar to search project details -->
          <input
            v-model="searchQuery"
            @input="searchProjectDetails"
            placeholder="Search for project details..."
            class="border rounded px-4 py-2 w-64"
          />
        </div>

        <!-- Add filter and Add new post buttons -->
        <div class="flex space-x-4">
          <button @click="addFilter" class="bg-gray-200 text-black px-4 py-2 rounded">+ Add filter</button>
          <button @click="addNewCategory" class="bg-blue-500 text-white px-4 py-2 rounded">
            + Add new Category
          </button>
        </div>
      </div>

      <!-- Breadcrumb (example based on CMS UI) -->
      <div class="text-gray-500 mb-4">
        Category > Project Details
      </div>

      <!-- Display project details in jqxGrid -->
      <div id="jqxGrid" class="bg-white shadow-lg"></div>

      <!-- Action buttons for expanding and collapsing groups -->
      <div class="mt-8 flex space-x-4">
        <button @click="expandAll" class="bg-blue-500 text-white px-4 py-2 rounded">Expand All</button>
        <button @click="collapseAll" class="bg-gray-500 text-white px-4 py-2 rounded">Collapse All</button>
      </div>
    </div>
  </div>
</template>

<script>
import CategoryService from '../services/CategoryService';
import ProjectDetailsService from '../services/ProjectDetailsService';
import Swal from 'sweetalert2'; // Import SweetAlert

export default {
  data() {
    return {
      categories: [],          // Holds the category data fetched from the API
      projectDetails: [],      // Holds the project details data for display
      filteredProjectDetails: [], // Holds the filtered project details for search
      selectedCategory: 'all', // Holds the selected category for filtering
      searchQuery: ''          // Holds the search input for filtering project details
    };
  },
  mounted() {
    // Fetch categories and project details when the component is mounted
    this.fetchCategories();
    this.fetchProjectDetails();
  },
  methods: {
    // Fetch all categories and update the sidebar
    async fetchCategories() {
      try {
        const categories = await CategoryService.getAllCategories();
        this.categories = categories.map(category => ({
          ...category,
          item_count: category.item_count || 0 // Assuming item_count is returned by the API
        }));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },

    // Fetch all project details
    async fetchProjectDetails() {
      try {
        const projectDetails = await ProjectDetailsService.getAllProjectDetails();
        this.projectDetails = projectDetails.data;
        this.filteredProjectDetails = this.projectDetails;
        this.initializeGrid(this.filteredProjectDetails);
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    },

    // Fetch project details based on selected category
    async fetchProjectDetailsByCategory(categoryId) {
      this.selectedCategory = categoryId;
      if (this.selectedCategory === 'all') {
        this.filteredProjectDetails = this.projectDetails;
      } else {
        this.filteredProjectDetails = this.projectDetails.filter(detail => detail.category_id === this.selectedCategory);
      }
      this.initializeGrid(this.filteredProjectDetails);
    },

    // Initialize the jqxGrid with project detail data
    initializeGrid(data) {
      const source = {
        localdata: data,
        datatype: 'array',
        datafields: [
          { name: 'id', type: 'number' },
          { name: 'detail_description', type: 'string' },
          { name: 'technologies_used', type: 'string' },
          { name: 'image_url', type: 'string' },
          { name: 'documentation_url', type: 'string' },
          { name: 'created_at', type: 'date' },
          { name: 'updated_at', type: 'date' }
        ]
      };

      const dataAdapter = new $.jqx.dataAdapter(source);

      // Initialize the jqxGrid
      $("#jqxGrid").jqxGrid({
        width: '100%', // Make the grid take the full width of the container
        height: 500,   // Set the height for better display
        source: dataAdapter,
        columnsresize: true, // Enable column resizing
        sortable: true,      // Enable column sorting
        pageable: true,      // Enable pagination
        pagesize: 10,        // Number of rows per page
        columns: [
          { text: 'Description', datafield: 'detail_description', width: 300 },
          { text: 'Technologies Used', datafield: 'technologies_used', width: 150 },
          {
            text: 'Image URL',
            datafield: 'image_url',
            width: 150,
            cellsrenderer: (row, column, value) => {
              if (value) {
                return '<span style="color: green;">✔️ Have Image</span>';
              } else {
                return '<span style="color: red;">✘ No Image</span>';
              }
            }
          },
          {
            text: 'Documentation URL',
            datafield: 'documentation_url',
            width: 150,
            cellsrenderer: (row, column, value) => {
              if (value) {
                return '<span style="color: green;">✔️ Have Documentation</span>';
              } else {
                return '<span style="color: red;">✘ No Documentation</span>';
              }
            }
          },
          { text: 'Created At', datafield: 'created_at', cellsformat: 'yyyy-MM-dd', width: 150 },
          { text: 'Updated At', datafield: 'updated_at', cellsformat: 'yyyy-MM-dd', width: 150 },
          {
            text: 'Actions',
            datafield: 'actions',
            width: 150,
            cellsrenderer: (row) => {
              return `
                <i class="fa fa-edit text-green-500 mr-4 cursor-pointer" onclick="window.vueInstance.editProjectDetail(${row})" title="Edit"></i>
                <i class="fa fa-trash text-red-500 mr-4 cursor-pointer" onclick="window.vueInstance.confirmDelete(${row})" title="Delete"></i>
                <i class="fa fa-eye text-blue-500 cursor-pointer" onclick="window.vueInstance.viewProjectDetail(${row})" title="View"></i>
              `;
            }
          }
        ]
      });
    },

    // Method to search and filter project details based on the input
    searchProjectDetails() {
      const query = this.searchQuery.toLowerCase();
      this.filteredProjectDetails = this.projectDetails.filter(detail => {
        return (
          detail.detail_description.toLowerCase().includes(query) ||
          detail.technologies_used.toLowerCase().includes(query)
        );
      });
      // Re-initialize the grid with the filtered data
      this.initializeGrid(this.filteredProjectDetails);
    },

    // Method to confirm delete using SweetAlert
    confirmDelete(row) {
      const selectedDetail = this.projectDetails[row];

      Swal.fire({
        title: 'Are you sure?',
        text: `You won't be able to revert this action!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await ProjectDetailsService.deleteProjectDetail(selectedDetail.id);
            Swal.fire('Deleted!', `Project detail ${selectedDetail.detail_description} has been deleted.`, 'success');
            this.fetchProjectDetails(); // Refresh the data after deletion
          } catch (error) {
            Swal.fire('Error!', 'There was an issue deleting the project detail.', 'error');
          }
        }
      });
    },

    // Method to add a new category (redirect to add category page)
    addNewCategory() {
      alert('Redirect to add new category page!');
    },

    // Method to edit a project detail
    editProjectDetail(row) {
      const detail = this.projectDetails[row];
      alert(`Edit Project Detail: ${detail.detail_description}`);
    },

    // Method to view a project detail
    viewProjectDetail(row) {
      const detail = this.projectDetails[row];
      alert(`View Project Detail: ${detail.detail_description}`);
    },

    // Method to expand all groups
    expandAll() {
      $('#jqxGrid').jqxGrid('expandallgroups');
    },

    // Method to collapse all groups
    collapseAll() {
      $('#jqxGrid').jqxGrid('collapseallgroups');
    },

    // Add filter method (placeholder for functionality)
    addFilter() {
      alert('Add filter functionality goes here.');
    }
  }
};
</script>

<style scoped>

/* Main layout styling */
.container {
  margin-top: 50px;
}

/* Button styling */
button {
  cursor: pointer;
}

/* Input and Select styling */
input, select {
  border: 1px solid #ddd;
  padding: 8px;
  width: 250px;
}

/* Sidebar navigation styling */
.sidebar a {
  color: #63b3ed;
  font-size: 1rem;
  font-weight: 500;
}

/* Sidebar link styling */
.nav-link {
  color: #cbd5e0; /* Gray color */
  padding: 10px 15px;
  display: block;
  border-radius: 8px;
  text-decoration: none;
}

.nav-link:hover {
  background-color: #2b6cb0; /* Blue background */
  color: #ffffff; /* White text on hover */
}

/* Font Awesome icons */
.fa {
  font-size: 20px;
  cursor: pointer;
}

/* Optional CSS for additional table or button styling */
.jqx-grid-filter-row {
  border-top: 2px solid red;
  border-bottom: 2px solid red;
}
</style>
