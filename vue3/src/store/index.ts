import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
    state: () => ({
        role: "",
        id: "",
        studentId: "",
        name: "",
        password: "",
        email: "",
        enable: false,
    }),
    actions: {
        setUser(userInfo) {
            this.role = userInfo.role;
            this.id = userInfo.id;
            this.studentId = userInfo.studentId;
            this.name = userInfo.name;
            this.password = userInfo.password;
            this.email = userInfo.email;
            this.enable = userInfo.enable;
        },
        login(userInfo) {
            this.setUser(userInfo);
        },
        clearUser() {
            this.role = '';
            this.id = '';
            this.studentId = '';
            this.name = '';
            this.password = '';
            this.email = '';
            this.enable = false;
        },
    },
});
