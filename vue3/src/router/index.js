import { createRouter, createWebHistory } from "vue-router";
import Personnel from "../views/Personnel.vue";
import Student from "../views/Student.vue";
import Course from "../views/Course.vue";
import Schedule from "../views/Schedule.vue";
import Login from "../views/Login.vue";
import Verify from "../views/Verify.vue";
import { useUserStore } from "../store/index";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            redirect: "/login",
        },
        {
            path: "/common-home",
            name: "common-home",
            component: Personnel,
            meta: { requiresAuth: true },
        },
        {
            path: "/common-student",
            name: "common-student",
            component: Student,
            meta: { requiresAuth: true },
        },
        {
            path: "/student-home",
            name: "student-home",
            component: Course,
            meta: { requiresAuth: true },
        },
        {
            path: "/course-schedule",
            name: "course-schedule",
            component: Schedule,
            meta: { requiresAuth: true },
        },
        {
            path: "/verify",
            name: "verify",
            component: Verify,
            meta: { requiresAuth: true },
        },
        {
            path: "/login",
            name: "login",
            component: Login,
        },
    ],
});

// router.beforeEach((to, from, next) => {
//     const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
//     const userStore = useUserStore(); // 使用您的 Pinia store 实例

//     // 检查用户是否已登录
//     const role = userStore.userRole;

//     if (requiresAuth && !role) {
//         // 如果需要登录但用户未登录，重定向到登录页面
//         next("/login");
//     } else if (requiresAuth && (role === "admin" || role === "user")) {
//         next();
//     } else if (requiresAuth && role === "student") {
//         next("/student-home");
//     } else {
//         // 不需要登录的页面或登录页面
//         next();
//     }
// });

export default router;
