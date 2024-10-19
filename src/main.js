// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Tree from 'primevue/tree';
import Toast from 'primevue/toast';
import TreeTable from 'primevue/treetable';
import Column from 'primevue/column';
import { TreeList } from 'vue-tree-list';

import 'primevue/resources/themes/saga-blue/theme.css'; // Theme
import 'primevue/resources/primevue.min.css'; // Core CSS
import 'primeicons/primeicons.css'; // Icons CSS
import 'primeflex/primeflex.css'; // PrimeFlex CSS

const app = createApp(App);
app.use(PrimeVue);
app.use(ToastService);
app.use(router);

app.component('Tree', Tree); // Register the Tree component from PrimeVue
app.component('TreeList', TreeList); // Register the TreeList component from vue-tree-list
app.component('TreeTable', TreeTable); // Register the TreeTable component from PrimeVue
app.component('Toast', Toast); // Register the Toast component from PrimeVue
app.component('Column', Column); // Register the Column component from PrimeVue

app.mount('#app');
