import { createApp } from "vue";
import ArcoVue from "@arco-design/web-vue";
// 额外引入图标库
import ArcoVueIcon from "@arco-design/web-vue/es/icon";
import App from "./App.vue";
// FIXME: 按需加载
// import '@arco-design/web-vue/dist/arco.css';
import "@arco-themes/vue-mgo-blog/index.less";
//去除默认样式
import "./assets/styles/reset.css";
// 路由
import router from "./router/index";
//
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import useCourseStore from "./sotre/course-store";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
app.use(ArcoVue);
app.use(ArcoVueIcon);
app.use(router);
app.use(pinia);
app.mount("#app");
const courseStore = useCourseStore();
router.beforeEach(async(to, from) =>  {
  // 获取课程学习
  if (to.path.startsWith("/course/")) {
    const courseId = to.params["courseId"];
    const courseInfo = courseStore.courseInfo;
    //
    if (courseInfo.id != courseId) {
      await courseStore.getCourseInfo(courseId);
    }
  }
});
