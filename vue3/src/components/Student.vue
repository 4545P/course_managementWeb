<template lang="">
    <El-dialog v-model="submitStudentForm" title="新增學員" width="70%">
        <El-input
            v-model="form.name"
            placeholder="帳號"
            prop="name"
            style="display: flex; margin: 0 auto; padding: 8px; width: 70%"
        />
        <El-input
            v-model="form.password"
            placeholder="密碼"
            prop="password"
            style="display: flex; margin: 0 auto; padding: 8px; width: 70%"
        />
        <El-input
            v-model="form.email"
            placeholder="Email"
            prop="email"
            style="display: flex; margin: 0 auto; padding: 8px; width: 70%"
        />
        <el-date-picker
            v-model="form.birthday"
            type="date"
            class="filter-item"
            placeholder="學生生日"
            prop="birthday"
            style="display: flex; margin: 0 auto"
        />
        <p>
            <span style="margin: 0 70%; white-space: nowrap"
                >*29歲以下有補助</span
            >
        </p>
        <El-form-item>
            <El-button
                type="primary"
                native-type="submit"
                style="display: flex; margin: 0 80%"
                @click="studentForm"
                >提交</El-button
            >
        </El-form-item>
    </El-dialog>
</template>
<script lang="ts">
import { ref } from "vue";
import axios from "axios";

export default {
    props: {
        visible: Boolean,
    },
    setup(props, { emit }) {
        const visibleRef = ref(props.visible); // 创建 ref
        const form = ref({
            name: "",
            password: "",
            email: "",
            birthday: "",
        });
        const submitStudentForm = () => {
            emit("update:visible", false);
            emit("submit", form.value);
            emit("close");
        };
        const studentForm = () => {
            axios
                .post("http://localhost:8080/student/add", form.value)
                .then((response) => {
                    console.log("API Response:", response);
                    alert(response.data.message);
                })
                .catch((error) => {
                    console.error("API Error:", error);
                    alert("新增失敗");
                });
        };
        return {
            visibleRef,
            form,
            submitStudentForm,
            studentForm,
        };
    },
};
</script>
