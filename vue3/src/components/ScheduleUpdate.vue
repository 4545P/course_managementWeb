<template lang="">
    <el-dialog
        v-model="submitPersonnelForm"
        title="回報課程進度更新"
        width="70%"
    >
        <el-input
            v-model="form.managementList[0].courseCode"
            disabled
            placeholder="課程代碼"
            prop="courseCode"
            style="display: flex; margin: 0 auto; padding: 8px; width: 70%"
        />
        <el-input
            v-model="form.managementList[0].courseOutline"
            disabled
            placeholder="課程大綱"
            prop="courseOutline"
            style="display: flex; margin: 0 auto; padding: 8px; width: 70%"
        />
        <el-input
            v-model="form.managementList[0].courseProject"
            disabled
            placeholder="課程項目"
            prop="courseProject"
            style="display: flex; margin: 0 auto; padding: 8px; width: 70%"
        />
        <el-select
            v-model="form.managementList[0].understand"
            class="m-2"
            placeholder="課程是否理解"
            size="large"
            style="
                margin: 0 auto;
                padding: 8px;
                display: block;
                text-align: center;
                width: 70%;
            "
        >
            <el-option label="理解" value="true"></el-option>
            <el-option label="尚未理解" value="false"></el-option>
        </el-select>
        <el-input
            v-model="form.managementList[0].question"
            placeholder="問題回報"
            prop="question"
            style="display: flex; margin: 0 auto; padding: 8px; width: 70%"
        />
        <el-select
            v-model="form.managementList[0].solve"
            class="m-2"
            placeholder="問題是否解決"
            size="large"
            style="
                margin: 0 auto;
                padding: 8px;
                display: block;
                text-align: center;
                width: 70%;
            "
        >
            <el-option label="解決" value="true"></el-option>
            <el-option label="尚未解決" value="false"></el-option>
        </el-select>
        <el-form-item>
            <el-button
                type="primary"
                native-type="submit"
                style="display: flex; margin: 0 80%"
                @click="personnelForm"
                >更新</el-button
            >
        </el-form-item>
    </el-dialog>
</template>
<script lang="ts">
import { ref } from "vue";
import { useUserStore } from "../store/index";
import axios from "axios";

export default {
    props: {
        visible: Boolean,
        obData: Object,
    },
    // props: ["visible", "obData"],
    setup(props, { emit }) {
        const visibleRef = ref(props.visible);
        const userStore = useUserStore();
        const form = ref({
            managementList: [
                {
                    studentId: userStore.studentId,
                    courseCode: props.obData?.courseCode ?? "",
                    courseOutline: props.obData?.courseOutline ?? "",
                    courseProject: props.obData?.courseProject ?? "",
                    understand: "",
                    question: "",
                    solve: "",
                },
            ],
        });
        console.log(props.obData);
        const submitPersonnelForm = () => {
            emit("update:visible", false);
            emit("submit", form.value);
            emit("close");
        };
        const personnelForm = () => {
            axios
                .post("http://localhost:8080/management/update", form.value)
                .then((response) => {
                    console.log("API Response:", response);
                    alert(response.data.message);
                })
                .catch((error) => {
                    console.error("API Error:", error);
                    console.log(form);
                    alert("回報失敗");
                });
        };
        return {
            visibleRef,
            form,
            userStore,
            submitPersonnelForm,
            personnelForm,
        };
    },
};
</script>
