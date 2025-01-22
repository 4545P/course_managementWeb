<template>
    <div class="app">
        <Menu />
        <h1 style="margin-top: 50px; margin-left: 40px">
            課<br />
            程<br />
            日<br />
            程
        </h1>
        <div class="app-container" style="width: 70vw; margin: 0 auto">
            <div style="margin: 30px"></div>
            <div class="list-container">
                <El-table
                    :data="tableData"
                    border
                    fit
                    highlight-current-row
                    style="width: 100%"
                >
                    <El-table-column
                        label="課程代號"
                        prop="courseCode"
                        align="center"
                        min-width="60px"
                    >
                        <template #default="{ row }">
                            <span class="link-type">{{ row.courseCode }}</span>
                        </template>
                    </El-table-column>
                    <El-table-column
                        label="課程大綱"
                        prop="courseOutline"
                        align="center"
                        min-width="60px"
                    >
                        <template #default="{ row }">
                            <span class="link-type">{{
                                row.courseOutline
                            }}</span>
                        </template>
                    </El-table-column>
                    <El-table-column
                        label="課堂"
                        prop="courseProject"
                        align="center"
                        min-width="60px"
                    >
                        <template #default="{ row }">
                            <span class="link-type">{{
                                row.courseProject
                            }}</span>
                        </template>
                    </El-table-column>
                    <El-table-column
                        label="是否理解"
                        prop="understand"
                        align="center"
                        min-width="60px"
                    >
                        <template #default="{ row }">
                            <span class="link-type">{{
                                row.understand ? "理解" : "尚未理解"
                            }}</span>
                        </template>
                    </El-table-column>
                    <El-table-column
                        label="問題"
                        prop="question"
                        align="center"
                        min-width="100px"
                    >
                        <template #default="{ row }">
                            <span class="link-type">{{ row.question }}</span>
                        </template>
                    </El-table-column>
                    <El-table-column
                        label="是否解決"
                        prop="solve"
                        align="center"
                        min-width="40px"
                    >
                        <template #default="{ row }">
                            <span class="link-type">{{
                                row.solve ? "解決" : "尚未解決"
                            }}</span>
                        </template>
                    </El-table-column>
                    <El-table-column
                        label="回覆"
                        align="center"
                        width="150px"
                        class-name="small-padding fixed-width"
                    >
                        <template #default="{ row }">
                            <El-button
                                type="primary"
                                round
                                @click="UpdateSchedule(row)"
                                >Return</El-button
                            >
                        </template>
                    </El-table-column>
                </El-table>
                <El-dialog title="Chart" width="70%">
                    <div class="chart-container">
                        <div
                            id="pieChart"
                            style="width: 100%; height: 400px"
                        ></div>
                    </div>
                    <span class="dialog-footer">
                        <El-button>Close</El-button>
                    </span>
                </El-dialog>
            </div>
            <div class="example-pagination-block">
                <div class="example-demonstration"></div>
                <el-pagination
                    layout="prev, pager, next"
                    :total="pagination.total"
                    v-model="pagination.page"
                    @current-change="handlePageChange"
                />
            </div>
            <El-dialog>
                <El-form
                    ref="dataForm"
                    :rules="rules"
                    :model="listQuery"
                    label-position="left"
                    label-width="70px"
                    style="width: 400px; margin-left: 50px"
                >
                    <El-form-item label="Type" prop="type">
                        <El-select
                            v-model="listQuery.type"
                            class="filter-item"
                            placeholder="Please select"
                        >
                        </El-select>
                    </El-form-item>
                </El-form>
                <div class="dialog-footer">
                    <El-button> Cancel </El-button>
                    <El-button type="primary"> Confirm </El-button>
                </div>
            </El-dialog>
        </div>
    </div>
    <updateSchedule
        v-if="updateScheduleVisible"
        :visible="updateScheduleVisible.value"
        :obData="form"
        @close="handleUpdateScheduleClose"
    />
</template>
<script lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import updateSchedule from "@components/ScheduleUpdate.vue";

export default {
    props: {},
    components: {
        updateSchedule,
    },
    setup() {
        const value = ref("");
        const input = ref("");
        const tableData = ref([]);
        const currentPageData = ref([]);
        const updateScheduleVisible = ref(false);
        const listQuery = ref({
            studentId: "",
            sort: "+id",
        });
        const pagination = ref({
            total: 0,
            page: 1,
            limit: 5,
        });
        const UpdateSchedule = (row: { 
            studentId: string; 
            courseCode: string; 
            courseOutline: string; 
            courseProject: string; 
            understand: boolean; 
            question: string; 
            solve: boolean; }) => {
                updateScheduleVisible.value = true;
                form.value = row;
                console.log(form);
        };
        const handleUpdateScheduleClose = () => {
            updateScheduleVisible.value = false;
        };
        const handlePageChange = (newPage: number) => {
            pagination.value.page = newPage;
            fetchSchedule();
        };
        const fetchSchedule = async () => {
            const url = "http://localhost:8080/api/getSchedule";
            const studentId = localStorage.getItem("studentId");
            const requestData = {
                studentId: studentId ? studentId.trim() : "",
            };
            console.log(requestData);
            try {
                const response = await axios.post(url, requestData);
                console.log(response.data);
                tableData.value = response.data.list;
                pagination.value.total = response.data.total;
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        const currentPage = computed(() => {
            const start = (pagination.value.page - 1) * pagination.value.limit;
            const end = start + pagination.value.limit;
            return tableData.value.slice(start, end);
        });
        const form = ref({
            studentId: "",
            courseCode: "",
            courseOutline: "",
            courseProject: "",
            understand: false,
            question: "",
            solve: false,
        });
        // 進網頁時自動刷新列表
        onMounted(() => {
            fetchSchedule();
        });
        return {
            value,
            input,
            tableData,
            listQuery,
            form,
            pagination,
            currentPageData,
            currentPage,
            updateScheduleVisible,
            fetchSchedule,
            handlePageChange,
            UpdateSchedule,
            handleUpdateScheduleClose,
        };
    },
};
</script>
<style lang="scss" scoped>
.app {
    display: flex;
}
.filter-container {
    display: flex;
    align-items: center;
    padding: 0 42px;
    padding-top: 42px;
}
.list-container {
    display: flex;
    align-items: center;
    padding: 26px;
}
.example-pagination-block + .example-pagination-block {
    margin-top: 10px;
}
</style>
