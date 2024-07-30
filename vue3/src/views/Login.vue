<template>
    <div class="body">
        <form @submit="login" class="login">
            <input type="text" placeholder="name" class="text" v-model="name" />
            <input
                type="password"
                placeholder="password"
                class="password"
                v-model="password"
            />
            <input type="submit" value="submit" class="submit" />
        </form>
    </div>
</template>
<script lang="ts">
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

interface Data {
            name: string;
            email: string;
            role: string;
            enable: boolean;
            id?: string;
            studentId?: string;
        }
export default {
    setup() {
        const name = ref("admin");
        const password = ref("admin");
        const router = useRouter();
        const login = async (event: { preventDefault: () => void; }) => {
            event.preventDefault();
            try {
                const { useUserStore } = await import("@store/index");
                const userStore = useUserStore();
                const response = await axios.post(
                    "http://localhost:8080/login",
                    {
                        name: name.value,
                        password: password.value,
                    }
                );
                if (response.status === 200) {
                    const userInfo = extractUserInfo(response.data);
                    userStore.login(userInfo);
                    navigateUser(userInfo);
                } else {
                    console.error("登入請求失敗");
                }
            } catch (error) {
                console.error("登入請求出錯", error);
            }
        };
        const extractUserInfo = (data: Data) => {
            const userInfo: Data = {
                name: data.name,
                email: data.email,
                role: data.role,
                enable: data.enable,
                id: data.id,
            };
            if (userInfo.role === "admin" || userInfo.role === "user") {
                userInfo.id = data.id;
            } else {
                userInfo.studentId = data.id;
            }
            return userInfo;
        };  
        const navigateUser = (userInfo: Data) => {
            if (userInfo.role === "admin" || userInfo.role === "user") {
                if (userInfo.enable === false) {
                    router.push("/verify");
                } else {
                    router.push("/common-home");
                }
            } else if (userInfo.role === "student") {
                if (userInfo.enable === false) {
                    router.push("/verify");
                } else {
                    router.push("/student-home");
                }
            } else {
                console.error("無效的角色");
                alert("帳密錯誤");
            }
        };
        return {
            name,
            password,
            login,
            router,
        };
    },
};
</script>
<style lang="scss">
*,
*::after,
*::before {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.body {
    display: flex;
    width: 100%;
    height: 100vh;
    align-items: center;
    justify-content: center;
    background-color: #999;
}
.login {
    background-color: #777;
    width: 400px;
    color: wheat;
    padding: 40px;
    box-shadow: 10px 10px 25px #000;
}
input {
    display: block;
    margin: 20px auto;
    text-align: center;
    background: none;
    padding: 12px;
    font-size: 15px;
    border-radius: 20px;
    outline: none;
    color: aliceblue;
}
.text,
.password {
    border: 2px solid #3498db;
    width: 220px;
}
.text:focus,
.password:focus {
    border-color: #2ecc71;
    width: 280px;
    transition: 0.5s;
}
.checkbox {
    margin: 0 0;
}
.submit {
    width: 150px;
    border: 2px solid #2ecc71;
    cursor: pointer;
}
.submit:hover {
    background-color: #2ecc71;
    transition: 0.5s;
}
</style>
