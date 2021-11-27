import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import Chat from "../components/Chat.vue";
import UserProfile from "../components/UserProfile.vue";
import EditProfile from "../components/EditProfile.vue";
import User from "../components/user/_id.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/chat",
    name: "Chat",
    component: Chat,
  },
  {
    path: "/user/:username",
    name: "UserProfile",
    component: UserProfile,
    props: true
  },
  {
    path: "/edit-profile",
    name: "EditProfile",
    component: EditProfile,
  },
  {
    path: "/profile/:id",
    name: "User-id",
    component: User,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
