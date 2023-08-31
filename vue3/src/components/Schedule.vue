<template lang="">
    <el-dialog v-model="submitStudntForm" title="新增日程" width="70%">
        <el-input
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
        <el-input
            v-model="form.scheduleList[0].courseOutline"
            placeholder="課程大綱"
            prop="courseOutline"
            style="display: flex; margin: 0 auto; padding: 8px; width: 70%"
        />
        <el-input
            v-model="form.scheduleList[0].courseProject"
            placeholder="課程項目"
            prop="courseProject"
            style="display: flex; margin: 0 auto; padding: 8px; width: 70%"
        />
        <el-input
            v-model="form.scheduleList[0].courseContent"
            placeholder="內容概要"
            prop="courseContent"
            style="display: flex; margin: 0 auto; padding: 8px; width: 70%"
        />
        <el-form-item>
            <el-button
                type="primary"
                native-type="submit"
                style="display: flex; margin: 0 80%"
                @click="studentForm"
                >提交</el-button
            >
        </el-form-item>
    </el-dialog>
</template>
<script>
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
                    courseCode: props.obData.courseCode,
                    courseDate: null,
                    courseOutline: "",
                    courseProject: "",
                    courseContent: "",
                },
            ],
        });

        const submitStudntForm = () => {
            emit("update:visible", false);
            emit("submit", form.value);
            emit("close");
        };

        const studentForm = () => {
            // 在这里提交表单数据给后端API
            axios
                .post("http://localhost:8080/course/schedule", form.value)
                .then((response) => {
                    // 处理API响应，可以显示成功或失败的消息
                    console.log("API Response:", response);
                    alert(response.data.message);
                })
                .catch((error) => {
                    // 处理API请求错误
                    console.error("API Error:", error);
                    alert("新增失敗");
                });
        };

        return {
            visibleRef,
            form,
            submitStudntForm,
            studentForm,
        };
    },
};
</script>
<style lang=""></style>
