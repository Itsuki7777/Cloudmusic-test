import Vue from "vue";
import VueRouter from "vue-router";
//import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: "/home",
    name: "Home",
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/otherlist",
    name: "Otherlist",
    component: () => import("../views/OtherlistView.vue"),
  },

  {
    path: "/playlist",
    name: "Playlist",
    component: () => import("../views/PlaylistView.vue"),
  },
  {
    path: "/footermusic",
    name: "FooterMusic",
    component: () => import("../components/FooterMusic.vue"),
  },
  {
    path: "/search",
    name: "Search",
    component: () => import("../views/SearchView.vue"),
  },
  {
    path: "/test",
    name: "Test",
    component: () => import("../views/TestView.vue"),
  },
  {
    path: "*",
    //重定向
    redirect: {
      name: "Home",
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
