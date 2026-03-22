import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import DetailView from "@/views/DetailView.vue";

export function createAppRouter(base = "/") {
  return createRouter({
    history: createWebHistory(base),
    routes: [
      {
        path: "/",
        name: "home",
        component: HomeView,
      },
      {
        path: "/detail/:id",
        name: "detail",
        component: DetailView,
        props: true,
      },
    ],
  });
}

