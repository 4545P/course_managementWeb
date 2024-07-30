<template>
    <div class="body">
        <form @submit="login" class="verify">
            <input
                type="text"
                placeholder="驗證碼"
                class="text"
                v-model="verify"
            />
            <button
                type="button"
                @click="submitForm"
                class="again"
                :disabled="countingDown"
            >
                {{ countdownText }}
            </button>
            <input
                type="submit"
                @click="submitForm"
                value="submit"
                class="submit"
            />
        </form>
    </div>
</template>
<script lang="ts">
import axios from "axios";
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@store/index";
export default {
    setup() {
        const verify = ref("");
        const router = useRouter();
        const userStore = useUserStore();
        const role = userStore.role;
        const email = userStore.email;
        const secondsLeft = ref(60);
        const countingDown = ref(false);
        const countdownText = computed(() => {
            return countingDown.value
                ? `重新發送 (${secondsLeft.value}s)`
                : "重新發送";
        });
        onMounted(() => {
            startCountdown();
            countingDown;
        });
        const startCountdown = async () => {
            if (!countingDown.value) {
                countingDown.value = true;
                const endpoint =
                    role === "admin" || role === "user"
                        ? "send-personnel-verification-code?email=" +
                        encodeURIComponent(email)
                        : "send-student-verification-code?email=" +
                        encodeURIComponent(email);
                await axios.post(
                    `http://localhost:8080/${endpoint}`
                );
            }
        };
        const submitForm = async (event: { preventDefault: () => void; }) => {
            event.preventDefault(); // 阻止表单的默认提交行为
            const verifyEndpoint =
                role === "admin" || role === "user"
                    ? "verify-personnel"
                    : "verify-student";
            let dataToSend = {};
            if (role === "admin" || role === "user") {
                dataToSend = {
                    id: userStore.id,
                    code: verify.value.toString(),
                };
            } else if (role === "student") {
                dataToSend = {
                    studentId: userStore.studentId,
                    code: verify.value.toString(),
                };
            }
            try {
                const verifyResponse = await axios.post(
                    `http://localhost:8080/${verifyEndpoint}`,
                    dataToSend
                );
                console.log(verifyResponse);
                if (
                    verifyResponse.status === 200 &&
                    verifyResponse.data.success === true
                ) {
                    router.push(
                        role === "admin" || role === "user"
                            ? "/common-home"
                            : "/student-home"
                    );
                }
            } catch (error) {
                console.error("發生錯誤:", error);
            }
        };
        const timer = setInterval(() => {
            secondsLeft.value--;
            if (secondsLeft.value <= 0) {
                clearInterval(timer);
                countingDown.value = false;
            }
        }, 1000);
        return {
            verify,
            router,
            userStore,
            secondsLeft,
            countingDown,
            countdownText,
            startCountdown,
            submitForm,
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
.verify {
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
.text {
    border: 2px solid #3498db;
    width: 220px;
}
.text:focus {
    border-color: #2ecc71;
    width: 280px;
    transition: 0.5s;
}
.again {
    font-size: 10px;
    width: 80px;
    height: 30px;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 20px;
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
