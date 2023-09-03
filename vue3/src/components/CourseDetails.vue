<template lang="">
    <el-dialog v-model="submitPersonnelForm" title="查看課程詳情" width="70%">
        <el-input
            v-model="form.courseList[0].courseCode"
            disabled
            placeholder="課程代碼"
            prop="courseCode"
            style="display: flex; margin: 0 auto; padding: 8px; width: 70%"
        />
        <p>
            <span style="margin: 0 70%; white-space: nowrap">*課程代碼</span>
        </p>
        <el-input
            v-model="form.courseList[0].courseTitle"
            disabled
            placeholder="課程名稱"
            prop="courseTitle"
            style="display: flex; margin: 0 auto; padding: 8px; width: 70%"
        />
        <p>
            <span style="margin: 0 70%; white-space: nowrap">*課程名稱</span>
        </p>
        <el-input
            v-model="form.courseList[0].courseInstructor"
            disabled
            placeholder="課程講師"
            prop="courseInstructor"
            style="display: flex; margin: 0 auto; padding: 8px; width: 70%"
        />
        <p>
            <span style="margin: 0 70%; white-space: nowrap">*課程講師</span>
        </p>
        <el-input
            v-model="form.courseList[0].courseDescription"
            disabled
            placeholder="課程大綱"
            prop="courseInstructor"
            style="display: flex; margin: 0 auto; padding: 8px; width: 70%"
        />
        <p>
            <span style="margin: 0 70%; white-space: nowrap">*課程大綱</span>
        </p>

        <div style="display: flex; justify-content: center; margin: 6px">
            <el-checkbox
                :checked="form.courseList[0].courseWeek.includes('Monday')"
                @change="handleCheckboxChange('Monday')"
                disabled
                label="星期一"
                size="large"
                border
            />
            <el-checkbox
                :checked="form.courseList[0].courseWeek.includes('Tuesday')"
                @change="handleCheckboxChange('Tuesday')"
                disabled
                label="星期二"
                size="large"
                border
            />
            <el-checkbox
                :checked="form.courseList[0].courseWeek.includes('Wednesday')"
                @change="handleCheckboxChange('Wednesday')"
                disabled
                label="星期三"
                size="large"
                border
            />
            <el-checkbox
                :checked="form.courseList[0].courseWeek.includes('Thursday')"
                @change="handleCheckboxChange('Thursday')"
                disabled
                label="星期四"
                size="large"
                border
            />
            <el-checkbox
                :checked="form.courseList[0].courseWeek.includes('Friday')"
                @change="handleCheckboxChange('Friday')"
                disabled
                label="星期五"
                size="large"
                border
            />
        </div>
        <p>
            <span style="margin: 0 70%; white-space: nowrap">*上課星期</span>
        </p>

        <div
            class="demo-date-picker"
            style="display: flex; justify-content: center; margin: 6px"
        >
            <div class="block">
                <el-date-picker
                    v-model="form.courseList[0].courseDate"
                    disabled
                    placeholder="開始日期"
                    :picker-options="datePickerOptions"
                    :size="size"
                />
                <el-date-picker
                    v-model="form.courseList[0].courseEndDate"
                    disabled
                    placeholder="結束日期"
                    :picker-options="datePickerOptions"
                    :size="size"
                />
            </div>
        </div>
        <p>
            <span style="margin: 0 70%; white-space: nowrap">*上課期間</span>
        </p>

        <div
            class="demo-time-range"
            style="display: flex; justify-content: center; margin: 6px"
        >
            <div class="time">
                <el-time-select
                    disabled
                    v-model="form.courseList[0].classTime"
                    :max-time="form.courseList[0].classEndTime"
                    class="mr-4"
                    placeholder="上課時間"
                />
                <el-time-select
                    disabled
                    v-model="form.courseList[0].classEndTime"
                    :min-time="form.courseList[0].classTime"
                    placeholder="下課時間"
                />
            </div>
        </div>
        <p>
            <span style="margin: 0 70%; white-space: nowrap">*上課時間</span>
        </p>
        <el-select
            disabled
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
        </el-select>
        <p>
            <span style="margin: 0 70%; white-space: nowrap">*上課地點</span>
        </p>
        <el-form-item>
            <el-button
                type="primary"
                native-type="submit"
                style="display: flex; margin: 0 80%"
                @click="personnelForm"
                >選課</el-button
            >
        </el-form-item>
    </el-dialog>
</template>
<script>
import { ref } from "vue";
import axios from "axios";
import { useUserStore } from "../store/index";

export default {
    props: {
        visible: Boolean,
        obData: Object,
    },
    setup(props, { emit }) {
        const visibleRef = ref(props.visible);
        const userStore = useUserStore();
        const form = ref({
            courseList: [
                {
                    courseCode: props.obData.courseCode,
                    courseTitle: props.obData.courseTitle,
                    courseInstructor: props.obData.courseInstructor,
                    courseDescription: props.obData.courseDescription,
                    courseWeek: props.obData.courseWeek,
                    courseDate: props.obData.courseDate,
                    courseEndDate: props.obData.courseEndDate,
                    classTime: props.obData.classTime,
                    classEndTime: props.obData.classEndTime,
                    classCity: props.obData.classCity,
                    personnel: userStore.name,
                },
            ],
        });

        const code = ref({
            studentId: userStore.studentId,
            courseCode: props.obData.courseCode,
        });

        const submitPersonnelForm = () => {
            emit("update:visible", false);
            emit("submit", form.value);
            emit("close");
        };

        const personnelForm = () => {
            axios
                .post("http://localhost:8080/course/selection", code.value)
                .then((response) => {
                    console.log("API Response:", response);
                    alert(response.data.message);
                    console.log(code);
                })
                .catch((error) => {
                    console.error("API Error:", error);
                    alert("修改課程失敗");
                    console.log(form);
                });
        };

        return {
            visibleRef,
            form,
            userStore,
            code,
            submitPersonnelForm,
            personnelForm,
        };
    },
};
</script>
<style lang="scss" scoped></style>
