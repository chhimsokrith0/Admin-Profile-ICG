import { createRouter, createWebHistory } from 'vue-router';

// Import your components (views)
import Dashboard from '../views/Dashboard.vue';
import AddProfile from '../views/AddProfile.vue';
import ProfileList from '../views/ProfileList.vue';
import AddProject from '../views/AddProject.vue';
import ProjectList from '../views/ProjectList.vue';
import AddUser from '../views/AddUser.vue';
import UserList from '../views/UserList.vue';

const routes = [
  { path: '/', redirect: '/dashboard' }, // Redirect to dashboard as default route
  { path: '/dashboard', component: Dashboard },
  { path: '/manage-profiles/add', component: AddProfile },
  { path: '/manage-profiles/list', component: ProfileList },
  { path: '/edit-profile/:id', name: 'EditProfile', component: AddProfile, props: true },
  { path: '/manage-project/add', component: AddProject },
  { path: '/manage-project/list', component: ProjectList },
  { path: '/manage-user/add', component: AddUser },
  { path: '/manage-user/list', component: UserList },
  // Add other routes as necessary
];

// Create the router instance and pass in the routes
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
