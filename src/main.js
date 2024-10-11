import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import PrimeVue from 'primevue/config';
import Tree from 'primevue/tree';

import 'primevue/resources/themes/saga-blue/theme.css'; // Theme
import 'primevue/resources/primevue.min.css'; // Core CSS
import 'primeicons/primeicons.css'; // Icons CSS

const app = createApp(App);
app.use(PrimeVue);
app.use(router);
app.component('Tree', Tree);

app.mount('#app');
