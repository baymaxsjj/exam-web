import { createApp } from "vue";
import App from "./App.vue";
import "./assets/styles/reset.css";
// import ArcoVueIcon from "@arco-design/web-vue/es/icon";
// 路由
import router from "./router/index";
//路由守卫
import {courseGuard} from './router/guards'
//指令
import {imageDirective} from './utils/directive'
//pinia
import { createPinia } from "pinia";
//持久化保存
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

router.beforeEach(courseGuard);

const app = createApp(App);
// 仅在浏览器内编译时才会工作
// 如果使用了构建工具，请看下面的配置示例

// app.use(ArcoVueIcon);
app.use(router);
app.use(pinia);
app.directive("loadImg", imageDirective);
app.mount("#app");

