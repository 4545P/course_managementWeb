import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import Menu from "./components/Menu.vue";

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.use(ElementPlus);
app.component("Menu", Menu);
app.mount("#app");
