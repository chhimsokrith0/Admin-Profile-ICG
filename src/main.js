import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Tree from 'primevue/tree';
import Toast from 'primevue/toast';
import { TreeList } from 'vue-tree-list'; // Import TreeList

import 'primevue/resources/themes/saga-blue/theme.css'; // Theme
import 'primevue/resources/primevue.min.css'; // Core CSS
import 'primeicons/primeicons.css'; // Icons CSS

const app = createApp(App);
app.use(PrimeVue);
app.use(ToastService); // Register the ToastService
app.use(router);

app.component('Tree', Tree); // Register the Tree component from PrimeVue
app.component('TreeList', TreeList); // Register the TreeList component from vue-tree-list
app.component('Toast', Toast); // Register the Toast component from PrimeVue

app.mount('#app');
