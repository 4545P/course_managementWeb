<template lang="">
    <El-dialog v-model="submitStudentForm" title="修改學員" width="70%">
        <El-input
            v-model="form.student.name"
            placeholder="帳號"
            prop="name"
            style="display: flex; margin: 0 auto; padding: 8px; width: 70%"
        />
        <El-input
            v-model="form.student.email"
            placeholder="Email"
            prop="email"
            style="display: flex; margin: 0 auto; padding: 8px; width: 70%"
        />
        <el-date-picker
            v-model="form.student.birthday"
            type="date"
            class="filter-item"
            placeholder="學生生日"
            prop="birthday"
            style="display: flex; margin: 0 auto"
        />
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
        obData: Object,
    },
    setup(props, { emit }) {
        const visibleRef = ref(props.visible);
        const form = ref({
            student: {
                studentId: props.obData?.id ?? '',
                name: props.obData?.name ?? '',
                email: props.obData?.email ?? '',
                birthday: props.obData?.birthday ?? '',
            },
        });
        console.log(props.obData?.birthday);
        const submitStudentForm = () => {
            emit("update:visible", false);
            emit("submit", form.value);
            emit("close");
        };
        const studentForm = () => {
            axios
                .post("http://localhost:8080/student/update", form.value)
                .then((response) => {
                    console.log("API Response:", response);
                    alert(response.data.message);
                    console.log(form);
                })
                .catch((error) => {
                    console.error("API Error:", error);
                    alert("修改失敗");
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
