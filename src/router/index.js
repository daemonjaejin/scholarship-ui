import { createRouter, createWebHistory } from "vue-router";
import QuartzView from "@/views/quartz/QuartzView.vue";

const routes = [
  {
    path: "/",
    redirect: "/quartz",
  },
  {
    path: "/quartz",
    name: "quartz",
    component: QuartzView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
