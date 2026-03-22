import { createRouter, createWebHistory } from "vue-router";
import Room1 from "../views/Room1.vue";
import Room2 from "../views/Room2.vue";
import Room3 from "../views/Room3.vue";

const routes = [
  {
    path: "/",
    redirect: "/room1",
  },
  {
    path: "/room1",
    name: "Room1",
    component: Room1,
  },
  {
    path: "/room2",
    name: "Room2",
    component: Room2,
  },
  {
    path: "/room3",
    name: "Room3",
    component: Room3,
  },
];

const router = createRouter({
  history: createWebHistory(
    window.__POWERED_BY_QIANKUN__ ? "/rooms" : "/"
  ),
  routes,
});

export default router;
