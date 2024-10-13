<template>
  <!-- Mobile Sidebar (overlay) -->
  <div
    v-if="isSidebarOpen"
    class="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
    @click="isSidebarOpen = false"
  ></div>

  <div
    :class="['bg-gray-900 text-white w-64 min-h-screen p-4 flex flex-col overflow-hidden transform transition-transform', isSidebarOpen ? 'translate-x-0' : '-translate-x-full', 'lg:translate-x-0 lg:relative fixed top-0 left-0 z-50']"
    @click.stop
  >
    <!-- Sidebar Header -->
    <div class="flex items-center mb-8 flex-shrink-0">
      <div class="bg-blue-600 p-2 rounded-full">
        <i class="fas fa-chart-bar text-white"></i>
      </div>
      <span class="ml-2 text-xl font-bold">Admin</span>
    </div>

    <!-- Navigation -->
    <nav class="flex-grow overflow-y-auto">
      <ul>
        <!-- Loop through the navigation items -->
        <li v-for="item in menuItems" :key="item.name" class="mb-4">
          <!-- Check if the item has a submenu -->
          <div v-if="item.submenu" class="cursor-pointer">
            <div
              class="flex items-center justify-between text-gray-300 hover:text-white"
              :class="{ 'bg-blue-600 text-white': activeMenus.includes(item.name), 'text-gray-400': !activeMenus.includes(item.name) }"
              @click="toggleMenu(item.name)"
            >
              <div class="flex items-center">
                <i :class="item.icon + ' mr-2 text-lg'"></i>
                <span class="text-base">{{ item.name }}</span>
              </div>
              <i :class="activeMenus.includes(item.name) ? 'fas fa-chevron-down' : 'fas fa-chevron-right'"></i>
            </div>
            <ul v-if="activeMenus.includes(item.name)" class="ml-4 mt-2">
              <li v-for="subItem in item.submenu" :key="subItem.name" class="mb-2">
                <router-link
                  :to="subItem.route"
                  class="text-gray-300 hover:text-white text-sm"
                  :class="{ 'bg-blue-600 text-white': isActiveRoute(subItem.route), 'text-gray-400': !isActiveRoute(subItem.route) }"
                >
                  {{ subItem.name }}
                </router-link>
              </li>
            </ul>
          </div>

          <!-- Render items without submenu -->
          <div v-else>
            <router-link
              :to="item.route"
              class="flex items-center text-gray-300 hover:text-white"
              :class="{ 'bg-blue-600 text-white': isActiveRoute(item.route), 'text-gray-400': !isActiveRoute(item.route) }"
            >
              <i :class="item.icon + ' mr-2 text-lg'"></i>
              <span class="text-base">{{ item.name }}</span>
            </router-link>
          </div>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    isSidebarOpen: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      activeMenus: [], // Tracks which menus are open
      // Menu structure defined in JavaScript
      menuItems: [
        { name: 'Dashboard', icon: 'fas fa-tachometer-alt', route: '/dashboard' },
        {
          name: 'Manage Profiles',
          icon: 'fas fa-user',
          submenu: [
            { name: 'Add Profile', route: '/manage-profiles/add' },
            { name: 'Profile List', route: '/manage-profiles/list' },
          ],
        },
        {
          name: 'Manage Project',
          icon: 'fas fa-project-diagram',
          submenu: [
            { name: 'Add Project', route: '/manage-project/add' },
            { name: 'Project List', route: '/manage-project/list' },
            { name: 'Add Project Detail', route: '/manage-project/add-detail' },
            { name: 'Project Detail List', route: '/manage-project/detail-list' },
            { name: 'Add Category', route: '/manage-project/add-category' },
            { name: 'Category List', route: '/manage-project/category-list' },
          ],
        },
        {
          name: 'Manage User',
          icon: 'fas fa-users-cog',
          submenu: [
            { name: 'Add User', route: '/manage-user/add' },
            { name: 'User List', route: '/manage-user/list' },
          ],
        },
      ],
    };
  },
  methods: {
    // Toggles the visibility of submenus
    toggleMenu(menuName) {
      if (this.activeMenus.includes(menuName)) {
        this.activeMenus = this.activeMenus.filter((name) => name !== menuName);
      } else {
        this.activeMenus.push(menuName);
      }
    },

    // Check if a route is currently active
    isActiveRoute(route) {
      return this.$route.path === route;
    },
  },
};
</script>

<style scoped>
/* Custom styles for the sidebar */
.bg-blue-600 {
  padding: 10px;
  background-color: #2563eb;
}
.text-white {
  color: #ffffff;
}

/* To hide scrollbar */
::-webkit-scrollbar {
  display: none;
}
</style>
