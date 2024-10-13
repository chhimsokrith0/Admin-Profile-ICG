<template>
  <div class="container mx-auto px-4">
    <h1 class="text-xl md:text-2xl font-semibold mb-4">User List</h1>

    <!-- PrimeVue Toast -->
    <Toast />

    <!-- Loading Spinner -->
    <div v-if="isLoading" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div class="spinner"></div>
    </div>

    <!-- Add User Button -->
    <div class="flex justify-end mb-4">
      <button @click="openAddUserModal" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center">
        <i class="fas fa-user-plus mr-2"></i> Add User
      </button>
    </div>

    <!-- Table for User List -->
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th class="py-2 px-4 border-b border-gray-200">ID</th>
            <th class="py-2 px-4 border-b border-gray-200">Username</th>
            <th class="py-2 px-4 border-b border-gray-200">Email</th>
            <th class="py-2 px-4 border-b border-gray-200">Created At</th>
            <th class="py-2 px-4 border-b border-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in paginatedUsers" :key="user.id" class="hover:bg-gray-50 text-center">
            <td class="py-2 px-4 border-b border-gray-200">{{ user.id }}</td>
            <td class="py-2 px-4 border-b border-gray-200">{{ user.username }}</td>
            <td class="py-2 px-4 border-b border-gray-200">{{ user.email }}</td>
            <td class="py-2 px-4 border-b border-gray-200">{{ formatDate(user.created_at) }}</td>
            <td class="py-2 px-4 border-b border-gray-200">
              <button @click="openEditUserModal(user)" class="text-blue-500 hover:text-blue-700 mr-2">
                <i class="fas fa-edit"></i> Edit
              </button>
              <button @click="openDeleteModal(user.id)" class="text-red-500 hover:text-red-700">
                <i class="fas fa-trash"></i> Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-end mt-4">
      <button @click="previousPage" :disabled="currentPage === 1" class="px-3 py-1 border bg-gray-100 hover:bg-gray-200 mr-2">Previous</button>
      <span class="px-3 py-1">Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-1 border bg-gray-100 hover:bg-gray-200 ml-2">Next</button>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="isDeleteModalOpen" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <!-- Icon for the Modal -->
        <div class="flex justify-center mb-4">
          <i class="fas fa-exclamation-triangle text-red-500 text-5xl"></i>
        </div>
        <h2 class="text-xl font-semibold mb-4 text-center">Confirm Deletion</h2>
        <p class="mb-4 text-center">Are you sure you want to delete this user?</p>
        <div class="flex justify-end space-x-4">
          <button @click="closeDeleteModal" class="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded">Cancel</button>
          <button @click="confirmDelete" class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded">Delete</button>
        </div>
      </div>
    </div>

    <!-- Add User Modal -->
    <div v-if="isAddUserModalOpen" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <h2 class="text-xl font-semibold mb-4 text-center">Add New User</h2>
        <div class="mb-4">
          <label class="block text-gray-700">Username</label>
          <input ref="usernameInput" v-model="newUser.username" type="text" class="w-full px-4 py-2 border rounded" placeholder="Enter username" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Email</label>
          <input v-model="newUser.email" type="email" class="w-full px-4 py-2 border rounded" placeholder="Enter email" />
        </div>
        <div class="mb-4 relative">
          <label class="block text-gray-700">Password</label>
          <input :type="showPassword ? 'text' : 'password'" v-model="newUser.password" class="w-full px-4 py-2 border rounded" placeholder="Enter password" />
          <i @click="toggleShowPassword" :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"></i>
        </div>
        <div class="mb-4 relative">
          <label class="block text-gray-700">Confirm Password</label>
          <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword" class="w-full px-4 py-2 border rounded" placeholder="Confirm password" />
          <i @click="toggleShowConfirmPassword" :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"></i>
        </div>
        <div class="flex justify-end space-x-4">
          <button @click="closeAddUserModal" class="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded">Cancel</button>
          <button @click="confirmAddUser" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">Add User</button>
        </div>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div v-if="isEditUserModalOpen" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <h2 class="text-xl font-semibold mb-4 text-center">Edit User</h2>
        <div class="mb-4">
          <label class="block text-gray-700">Username</label>
          <input v-model="editUserData.username" type="text" class="w-full px-4 py-2 border rounded" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Email</label>
          <input v-model="editUserData.email" type="email" class="w-full px-4 py-2 border rounded" />
        </div>
        <div class="mb-4 relative">
          <label class="block text-gray-700">New Password</label>
          <input :type="showEditPassword ? 'text' : 'password'" v-model="editUserData.newPassword" class="w-full px-4 py-2 border rounded" placeholder="Enter new password" />
          <i @click="toggleShowEditPassword" :class="showEditPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"></i>
        </div>
        <div class="mb-4 relative">
          <label class="block text-gray-700">Confirm New Password</label>
          <input :type="showEditConfirmPassword ? 'text' : 'password'" v-model="editUserData.confirmNewPassword" class="w-full px-4 py-2 border rounded" placeholder="Confirm new password" />
          <i @click="toggleShowEditConfirmPassword" :class="showEditConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"></i>
        </div>
        <div class="flex justify-end space-x-4">
          <button @click="closeEditUserModal" class="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded">Cancel</button>
          <button @click="confirmEditUser" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">Update</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick } from 'vue';
import UserService from '../services/UserService';

export default {
  data() {
    return {
      users: [],
      currentPage: 1,
      itemsPerPage: 5,
      isLoading: false, // Loading state
      isDeleteModalOpen: false,
      isAddUserModalOpen: false,
      isEditUserModalOpen: false,
      userToDelete: null,
      newUser: { username: '', email: '', password: '' },
      editUserData: { id: '', username: '', email: '', newPassword: '', confirmNewPassword: '' },
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      showEditPassword: false,
      showEditConfirmPassword: false,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.users.length / this.itemsPerPage);
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.users.slice(start, start + this.itemsPerPage);
    },
  },
  methods: {
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    openDeleteModal(userId) {
      this.userToDelete = userId;
      this.isDeleteModalOpen = true;
    },
    closeDeleteModal() {
      this.isDeleteModalOpen = false;
      this.userToDelete = null;
    },
    confirmDelete() {
      this.isLoading = true; // Show loader
      UserService.deleteUser(this.userToDelete).then(() => {
        this.users = this.users.filter(user => user.id !== this.userToDelete);
        this.$toast.add({
          severity: 'error',
          summary: 'User Deleted',
          detail: `User with ID ${this.userToDelete} has been deleted.`,
          life: 3000,
        });
        this.closeDeleteModal();
      }).finally(() => {
        this.isLoading = false; // Hide loader
      });
    },
    openAddUserModal() {
      this.isAddUserModalOpen = true;
      nextTick(() => {
        this.$refs.usernameInput.focus();
      });
    },
    closeAddUserModal() {
      this.isAddUserModalOpen = false;
      this.newUser = { username: '', email: '', password: '' };
      this.confirmPassword = '';
    },
    confirmAddUser() {
      if (this.newUser.password !== this.confirmPassword) {
        this.$toast.add({
          severity: 'error',
          summary: 'Password Mismatch',
          detail: 'Passwords do not match.',
          life: 3000,
        });
        return;
      }
      this.isLoading = true; // Show loader
      UserService.createUser(this.newUser).then(response => {
        const newUser = response.data;
        this.users.push(newUser);
        this.$toast.add({
          severity: 'success',
          summary: 'User Added',
          detail: `User ${newUser.username} has been added.`,
          life: 3000,
        });
        this.newUser = { username: '', email: '', password: '' };
        this.confirmPassword = '';
        this.closeAddUserModal();
      }).finally(() => {
        this.isLoading = false; // Hide loader
      });
    },
    openEditUserModal(user) {
      this.editUserData = { ...user }; // Fill form with the user data
      this.isEditUserModalOpen = true; // Open the modal
    },
    closeEditUserModal() {
      this.isEditUserModalOpen = false; // Close the modal
    },
    confirmEditUser() {
      if (this.editUserData.newPassword !== this.editUserData.confirmNewPassword) {
        this.$toast.add({
          severity: 'error',
          summary: 'Password Mismatch',
          detail: 'Passwords do not match.',
          life: 3000,
        });
        return;
      }
      this.isLoading = true; // Show loader
      const updatedUser = {
        id: this.editUserData.id,
        username: this.editUserData.username,
        email: this.editUserData.email,
        ...(this.editUserData.newPassword && { password: this.editUserData.newPassword }), // Include password only if it's being updated
      };

      UserService.updateUser(this.editUserData.id, updatedUser).then(() => {
        this.$toast.add({
          severity: 'success',
          summary: 'User Updated',
          detail: `User ${this.editUserData.username} has been updated.`,
          life: 3000,
        });
        this.isEditUserModalOpen = false;
      }).finally(() => {
        this.isLoading = false; // Hide loader
      });
    },
    fetchUsers() {
      this.isLoading = true; // Show loader
      UserService.getAllUsers().then(response => {
        this.users = response.data;
      }).finally(() => {
        this.isLoading = false; // Hide loader
      });
    },
    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },
    toggleShowConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    toggleShowEditPassword() {
      this.showEditPassword = !this.showEditPassword;
    },
    toggleShowEditConfirmPassword() {
      this.showEditConfirmPassword = !this.showEditConfirmPassword;
    },
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>

<style scoped>
.container {
  margin: 0 auto;
  padding: 1rem;
}
table {
  width: 100%;
}
button {
  cursor: pointer;
}
/* Spinner CSS */
.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #09f;
  animation: spin 1s ease infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
/* Additional responsive styles */
@media (max-width: 768px) {
  table {
    font-size: 0.875rem;
  }
  .text-xl {
    font-size: 1.25rem;
  }
  .px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .w-full {
    width: 100%;
  }
}
</style>
