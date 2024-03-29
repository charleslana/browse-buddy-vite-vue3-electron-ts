import App from './App.vue';
import FloatingVue from 'floating-vue';
import router from './router';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import 'bulma/css/bulma.css';
import 'floating-vue/dist/style.css';

const app = createApp(App);

app.use(createPinia());
app.use(FloatingVue);
app.use(router);
app.mount('#app');
