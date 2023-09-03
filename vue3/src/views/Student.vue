<template>
    <div class="app">
        <Menu />
        <h1 style="margin-top: 50px; margin-left: 40px">
            學<br />
            員<br />
            列<br />
            表
        </h1>
        <div class="app-container" style="width: 70vw; margin: 0 auto">
            <div class="filter-container">
                <el-input
                    v-model="listQuery.name"
                    placeholder="Name"
                    style="width: 180px; height: 65px"
                    class="filter-item"
                />

                <el-button
                    type="primary"
                    round
                    style="margin-left: 12px"
                    @click="fetchStudent"
                    >Search</el-button
                >

                <el-button
                    type="primary"
                    round
                    style="margin-left: 12px"
                    @click="AddStudent"
                >
                    AddStudent
                </el-button>
            </div>

            <div class="list-container">
                <el-table
                    :data="sortedList"
                    border
                    fit
                    highlight-current-row
                    style="width: 100%"
                >
                    <el-table-column
                        label="ID"
                        prop="id"
                        :sortable="
                            listQuery.sort === '+id' || listQuery.sort === '-id'
                        "
                        align="center"
                        width="80"
                    >
                        <template #default="{ row }">
                            <span>{{ row.id }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="Name" prop="name" min-width="40px">
                        <template #default="{ row }">
                            <span class="link-type">{{ row.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="Email"
                        prop="email"
                        min-width="100px"
                    >
                        <template #default="{ row }">
                            <span class="link-type">{{ row.email }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="Support"
                        prop="support"
                        min-width="40px"
                    >
                        <template #default="{ row }">
                            <span class="link-type">{{
                                row.support ? "有補助" : "沒有補助"
                            }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="Enable"
                        prop="enable"
                        min-width="40px"
                    >
                        <template #default="{ row }">
                            <span class="link-type">{{
                                row.enable ? "啟用" : "尚未啟用"
                            }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="Revise"
                        align="center"
                        width="250"
                        class-name="small-padding fixed-width"
                    >
                        <template #default="{ row }">
                            <el-button
                                type="primary"
                                round
                                @click="UpdateStudent(row)"
                                >Revise</el-button
                            >

                            <el-button type="danger" round>Delete</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-dialog title="Chart" width="70%">
                    <div class="chart-container">
                        <div
                            id="pieChart"
                            style="width: 100%; height: 400px"
                        ></div>
                    </div>
                    <span class="dialog-footer">
                        <el-button>Close</el-button>
                    </span>
                </el-dialog>
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

            <el-dialog>
                <el-form
                    ref="dataForm"
                    :rules="rules"
                    :model="listQuery"
                    label-position="left"
                    label-width="70px"
                    style="width: 400px; margin-left: 50px"
                >
                    <el-form-item label="Type" prop="type">
                        <el-select
                            v-model="listQuery.type"
                            class="filter-item"
                            placeholder="Please select"
                        >
                        </el-select>
                    </el-form-item>
                </el-form>
                <div class="dialog-footer">
                    <el-button> Cancel </el-button>
                    <el-button type="primary"> Confirm </el-button>
                </div>
            </el-dialog>
        </div>
    </div>
    <addStudent v-if="studentVisible" @close="handleAddStudentClose" />
    <updateStudent
        v-if="updateStudentVisible"
        :visible="updateStudentVisible.value"
        :obData="form"
        @close="handleUpdateStudentClose"
    />
</template>

<script>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import addStudent from "../components/Student.vue";
import updateStudent from "../components/StudentUpdate.vue";
export default {
    props: {},
    components: {
        addStudent,
        updateStudent,
    },
    setup() {
        const value = ref("");
        const input = ref("");
        const tableData = ref([]);
        const currentPageData = ref([]);
        const studentVisible = ref(false);
        const updateStudentVisible = ref(false);
        const showEditDialog = ref(false);

        const listQuery = ref({
            name: "",
            sort: "+id",
        });

        const pagination = ref({
            total: 0,
            page: 1,
            limit: 5,
        });

        const AddStudent = () => {
            studentVisible.value = true;
        };
        const handleAddStudentClose = () => {
            studentVisible.value = false;
        };
        const UpdateStudent = (row) => {
            updateStudentVisible.value = true;
            form.value = row;
        };

        const handleUpdateStudentClose = () => {
            updateStudentVisible.value = false;
        };

        const handlePageChange = (newPage) => {
            pagination.page = newPage;
            fetchStudent();
        };

        const fetchStudent = async () => {
            const url = "http://localhost:8080/api/getStudent";
            const requestData = {
                name: listQuery.value.name.trim(),
            };

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

        const sortedList = computed(() => {
            const clonedList = [...tableData.value]; // 複製列表

            if (listQuery.value.sort === "+id") {
                return clonedList.sort((a, b) => a.id - b.id); // 升序
            } else if (listQuery.value.sort === "-id") {
                return clonedList.sort((a, b) => b.id - a.id); // 降序
            }

            return clonedList; // 默認
        });

        // 監聽 listQuery.sort
        watch(
            () => listQuery.value.sort,
            (newVal, oldVal) => {
                if (newVal !== oldVal) {
                    // 排序
                    handleSortChange();
                }
            }
        );
        const form = ref({
            name: "",
            password: "",
            email: "",
            birthday: null,
        });

        // 進網頁時自動刷新列表
        onMounted(() => {
            fetchStudent();
        });

        // 處理排序
        const handleSortChange = () => {
            // sortedList.value 拿到排序後的數據
            const sortedData = sortedList.value;
            console.log(sortedData);
        };

        return {
            value,
            input,
            tableData,
            listQuery,
            form,
            pagination,
            currentPageData,
            sortedList,
            showEditDialog,
            studentVisible,
            currentPage,
            updateStudentVisible,
            handleSortChange,
            fetchStudent,
            handlePageChange,
            AddStudent,
            UpdateStudent,
            handleAddStudentClose,
            handleUpdateStudentClose,
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
