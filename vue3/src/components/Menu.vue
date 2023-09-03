<template>
    <el-row class="tac">
        <el-col>
            <h5 class="mb-2"></h5>
            <div class="vertical-menu">
                <el-menu
                    default-active="2"
                    class="el-menu-vertical-demo"
                    @open="handleOpen"
                    @close="handleClose"
                >
                    <el-sub-menu index="1">
                        <template #title>
                            <el-icon><icon-menu /></el-icon>
                            <span>Menu</span>
                        </template>
                        <router-link to="/common-home" class="menu-link">
                            <el-menu-item index="1-1">人員列表</el-menu-item>
                        </router-link>
                        <router-link to="/common-student" class="menu-link">
                            <el-menu-item index="1-2">學生列表</el-menu-item>
                        </router-link>
                        <router-link to="/student-home" class="menu-link">
                            <el-menu-item index="1-3">課程列表</el-menu-item>
                        </router-link>
                        <router-link to="/course-schedule" class="menu-link">
                            <el-menu-item index="1-4">我的課程</el-menu-item>
                        </router-link>
                        <el-menu-item @click="logout" index="1-5"
                            >登出</el-menu-item
                        >
                    </el-sub-menu>
                </el-menu>
            </div>
        </el-col>
    </el-row>
</template>

<script lang="ts" setup>
import {
    Document,
    Menu as IconMenu,
    Location,
    Setting,
} from "@element-plus/icons-vue";
import { ref } from "vue"; // 引入 ref
import { useUserStore } from "../store/index";
import { useRouter } from "vue-router";

const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath);
};
const router = useRouter();
const logout = () => {
    // 使用 Pinia 清空儲存的用戶資料
    const userStore = useUserStore();
    userStore.clearUser();
    router.push("/login");
};
</script>

<style>
.menu-link {
    text-decoration: none;
}
</style>
