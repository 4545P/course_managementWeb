<template lang="">
    <el-dialog v-model="submitPersonnelForm" title="修改教師人員" width="70%">
        <el-input
            v-model="form.personnel.name"
            placeholder="帳號"
            prop="name"
            style="display: flex; margin: 0 auto; padding: 8px; width: 70%"
        />
        <el-input
            v-model="form.personnel.email"
            placeholder="Email"
            prop="email"
            style="display: flex; margin: 0 auto; padding: 8px; width: 70%"
        />
        <el-select
            v-model="form.personnel.role"
            class="m-2"
            placeholder="Select"
            size="large"
            style="
                margin: 0 auto;
                padding: 8px;
                display: block;
                text-align: center;
                width: 70%;
            "
        >
            <el-option label="超級管理員" value="admin"></el-option>
            <el-option label="一般教職員" value="user"></el-option>
        </el-select>
        <el-date-picker
            v-model="form.personnel.birthday"
            type="date"
            class="filter-item"
            placeholder="教師生日"
            prop="birthday"
            style="display: flex; margin: 0 auto"
        />
        <el-form-item>
            <el-button
                type="primary"
                native-type="submit"
                style="display: flex; margin: 0 80%"
                @click="personnelForm"
                >提交</el-button
            >
        </el-form-item>
    </el-dialog>
</template>
<script>
import { ref, watch } from "vue";
import axios from "axios";

export default {
    props: {
        visible: Boolean,
        obData: Object,
    },
    // props: ["visible", "obData"],
    setup(props, { emit }) {
        const visibleRef = ref(props.visible);
        const form = ref({
            personnel: {
                id: props.obData.id,
                name: props.obData.name,
                email: props.obData.email,
                role: props.obData.role,
                birthday: props.obData.birthday,
            },
        });

        const submitPersonnelForm = () => {
            emit("update:visible", false);
            emit("submit", form.value);
            emit("close");
        };

        const personnelForm = () => {
            axios
                .post("http://localhost:8080/personnel/update", form.value)
                .then((response) => {
                    console.log("API Response:", response);
                    alert(response.data.message);
                })
                .catch((error) => {
                    console.error("API Error:", error);
                    console.log(form);
                    alert("更新失敗");
                });
        };

        return {
            visibleRef,
            form,
            submitPersonnelForm,
            personnelForm,
        };
    },
};
</script>
<style lang=""></style>
