<template lang="">
    <El-dialog v-model="submitPersonnelForm" title="新增課程" width="70%">
        <El-input
            v-model="form.courseList[0].courseCode"
            placeholder="課程代碼"
            prop="courseCode"
            style="display: flex; margin: 0 auto; padding: 8px; width: 70%"
        />
        <El-input
            v-model="form.courseList[0].courseTitle"
            placeholder="課程名稱"
            prop="courseTitle"
            style="display: flex; margin: 0 auto; padding: 8px; width: 70%"
        />
        <El-input
            v-model="form.courseList[0].courseInstructor"
            placeholder="課程講師"
            prop="courseInstructor"
            style="display: flex; margin: 0 auto; padding: 8px; width: 70%"
        />
        <El-input
            v-model="form.courseList[0].courseDescription"
            placeholder="課程大綱"
            prop="courseInstructor"
            style="display: flex; margin: 0 auto; padding: 8px; width: 70%"
        />
        <div style="display: flex; justify-content: center; margin: 6px">
            <el-checkbox
                :checked="form.courseList[0].courseWeek.includes('Monday')"
                @change="handleCheckboxChange('Monday')"
                label="星期一"
                size="large"
                border
            />
            <el-checkbox
                :checked="form.courseList[0].courseWeek.includes('Tuesday')"
                @change="handleCheckboxChange('Tuesday')"
                label="星期二"
                size="large"
                border
            />
            <el-checkbox
                :checked="form.courseList[0].courseWeek.includes('Wednesday')"
                @change="handleCheckboxChange('Wednesday')"
                label="星期三"
                size="large"
                border
            />
            <el-checkbox
                :checked="form.courseList[0].courseWeek.includes('Thursday')"
                @change="handleCheckboxChange('Thursday')"
                label="星期四"
                size="large"
                border
            />
            <el-checkbox
                :checked="form.courseList[0].courseWeek.includes('Friday')"
                @change="handleCheckboxChange('Friday')"
                label="星期五"
                size="large"
                border
            />
        </div>
        <div
            class="demo-date-picker"
            style="display: flex; justify-content: center; margin: 6px"
        >
            <div class="block">
                <el-date-picker
                    v-model="form.courseList[0].courseDate"
                    placeholder="開始日期"
                    :picker-options="datePickerOptions"
                    :size="size"
                />
                <el-date-picker
                    v-model="form.courseList[0].courseEndDate"
                    placeholder="結束日期"
                    :picker-options="datePickerOptions"
                    :size="size"
                />
            </div>
        </div>
        <div
            class="demo-time-range"
            style="display: flex; justify-content: center; margin: 6px"
        >
            <div class="time">
                <el-time-select
                    v-model="form.courseList[0].classTime"
                    :max-time="form.courseList[0].classEndTime"
                    class="mr-4"
                    placeholder="上課時間"
                />
                <el-time-select
                    v-model="form.courseList[0].classEndTime"
                    :min-time="form.courseList[0].classTime"
                    placeholder="下課時間"
                />
            </div>
        </div>
        <El-select
            v-model="form.courseList[0].classCity"
            class="m-2"
            placeholder="上課地點"
            size="large"
            style="
                margin: 0 auto;
                padding: 8px;
                display: block;
                text-align: center;
                width: 70%;
            "
        >
            <el-option label="台北" value="台北"></el-option>
            <el-option label="台中" value="台中"></el-option>
            <el-option label="台南" value="台南"></el-option>
            <el-option label="高雄" value="高雄"></el-option>
        </El-select>
        <El-form-item>
            <El-button
                type="primary"
                native-type="submit"
                style="display: flex; margin: 0 80%"
                @click="personnelForm"
                >提交</El-button
            >
        </El-form-item>
    </El-dialog>
</template>
<script lang="ts">
import { ref } from "vue";
import axios from "axios";
import { useUserStore } from "@store/index";

export default {
    props: {
        visible: Boolean,
    },
    setup(props, { emit }) {
        const visibleRef = ref(props.visible);
        const userStore = useUserStore();
        const form = ref({
            courseList: [
                {
                    courseCode: "",
                    courseTitle: "",
                    courseInstructor: "",
                    courseDescription: "",
                    courseWeek: [],
                    courseDate: null,
                    courseEndDate: null,
                    classTime: null,
                    classEndTime: null,
                    classCity: "",
                    personnel: userStore.name,
                },
            ],
        });
        const handleCheckboxChange = (day: string) => {
            const weekArray: string[] = form.value.courseList[0].courseWeek;
            if (weekArray.includes(day)) {
                // 如果數組中已經包含這個星期名稱就移除它
                const index = weekArray.indexOf(day);
                if (index !== -1) {
                    weekArray.splice(index, 1);
                }
            } else {
                // 不然就添加它
                weekArray.push(day);
            }
        };
        const submitPersonnelForm = () => {
            emit("update:visible", false);
            emit("submit", form.value);
            emit("close");
        };
        const personnelForm = () => {
            axios
                .post("http://localhost:8080/course/add", form.value)
                .then((response) => {
                    console.log("API Response:", response);
                    alert(response.data.message);
                })
                .catch((error) => {
                    console.error("API Error:", error);
                    alert("新增課程失敗");
                    console.log(form);
                });
        };
        return {
            visibleRef,
            form,
            userStore,
            submitPersonnelForm,
            personnelForm,
            handleCheckboxChange,
        };
    },
};
</script>

