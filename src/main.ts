import App from './App.vue';
import router from './router';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Tooltip, vTooltip } from 'floating-vue';
import './assets/lib/bulma-timeline.min.css';
import './assets/lib/modal-fx.min.css';
import './assets/style.css';
import 'bulma/css/bulma.css';
import 'floating-vue/dist/style.css';
import 'vue-loading-overlay/dist/css/index.css';

const app = createApp(App);

app.use(createPinia());
app.directive('tooltip', vTooltip);
app.component('VTooltip', Tooltip);
app.use(router);
app.mount('#app');
