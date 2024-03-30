import App from './App.vue';
import FloatingVue from 'floating-vue';
import router from './router';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import 'bulma/css/bulma.css';
import 'floating-vue/dist/style.css';
import 'vue-loading-overlay/dist/css/index.css';
import './assets/lib/bulma-timeline.min.css';
import './assets/lib/modal-fx.min.css';
import './assets/style.css';

const app = createApp(App);

app.use(createPinia());
app.use(FloatingVue);
app.use(router);
app.mount('#app');
