import { createRouter, createWebHistory } from "vue-router";
import courses from "./course";
import homes from "./home";
import exams from './exam'
const base = import.meta.env.VITE_BASE;
const Empty = () => import("../components/Empty.vue");
const Login = () => import("../views/login/Index.vue");
const routes = [
  {
    //404页面
    path: "/:pathMatch(.*)*",
    component: Empty,
  },
  {
    path: "/login",
    component: Login,
    name: "Login",
    meta: {
      title: "登录",
      header: false,
    },
  },
  ...homes,
  ...courses,
  ...exams
];
const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHistory(base),
  routes, // `routes: routes` 的缩写
});
export default router;
