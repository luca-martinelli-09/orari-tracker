import { createRouter, createWebHistory } from "vue-router";
import WorkHours from "../views/WorkHours.vue";
import Expenses from "../views/Expenses.vue";
import Settings from "../views/Settings.vue";

const routes = [
  {
    path: "/",
    name: "WorkHours",
    component: WorkHours,
  },
  {
    path: "/expenses",
    name: "Expenses",
    component: Expenses,
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
