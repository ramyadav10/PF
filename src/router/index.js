import MapDrawer from "@/components/maps/MapDrawer.vue";
import PathfindingVisualizer from "@/components/PathfindingVisualizer.vue";
import Vue from "vue";
import VueRouter from "vue-router";
import Login from "@/components/Login.vue";



Vue.use(VueRouter);

const routes = [
  {
    path: "/home",
    component: PathfindingVisualizer,
  },
  { path: '/', name: 'Login', component: Login },
  {
    path: "/map",
    component: MapDrawer,
  },
];

const router = new VueRouter({
  mode: "history", // Enables cleaner URLs
  routes,
});

export default router;
