<template lang="">
    <El-dialog v-model="submitStudentForm" title="新增日程" width="70%">
        <El-input
            v-model="form.scheduleList[0].courseCode"
            disabled
            placeholder="課程代碼"
            prop="courseCode"
            style="display: flex; margin: 0 auto; padding: 8px; width: 70%"
        />
        <el-date-picker
            v-model="form.scheduleList[0].courseDate"
            type="date"
            class="filter-item"
            placeholder="上課日期"
            prop="courseDate"
            style="display: flex; margin: 0 auto"
        />
        <El-input
            v-model="form.scheduleList[0].courseOutline"
            placeholder="課程大綱"
            prop="courseOutline"
            style="display: flex; margin: 0 auto; padding: 8px; width: 70%"
        />
        <El-input
            v-model="form.scheduleList[0].courseProject"
            placeholder="課程項目"
            prop="courseProject"
            style="display: flex; margin: 0 auto; padding: 8px; width: 70%"
        />
        <El-input
            v-model="form.scheduleList[0].courseContent"
            placeholder="內容概要"
            prop="courseContent"
            style="display: flex; margin: 0 auto; padding: 8px; width: 70%"
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
            scheduleList: [
                {
                    courseCode: props.obData?.courseCode ?? "",
                    courseDate: null,
                    courseOutline: "",
                    courseProject: "",
                    courseContent: "",
                },
            ],
        });
        const submitStudentForm = () => {
            emit("update:visible", false);
            emit("submit", form.value);
            emit("close");
        };
        const studentForm = () => {
            axios
                .post("http://localhost:8080/course/schedule", form.value)
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
