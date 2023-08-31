<template>
    <div class="app">
        <Menu />
        <h1 style="margin-top: 50px; margin-left: 40px">
            人<br />
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
                    @click="fetchPersonnel"
                    >Search</el-button
                >
                <el-button
                    type="primary"
                    round
                    style="margin-left: 12px"
                    @click="AddPersonnel"
                >
                    AddPersonnel
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
                    <el-table-column label="Role" prop="role" min-width="40px">
                        <template #default="{ row }">
                            <span class="link-type">{{ row.role }}</span>
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
                                @click="UpdatePersonnel(row)"
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
    <addPersonnel v-if="personnelVisible" @close="handleAddPersonnelClose" />
    <updatePersonnel
        v-if="updatePersonnelVisible"
        :visible="updatePersonnelVisible.value"
        :obData="form"
        @close="handleUpdatePersonnelClose"
    />
</template>

<script>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import addPersonnel from "../components/Personnel.vue";
import updatePersonnel from "../components/PersonnelUpdate.vue";
export default {
    props: {},
    components: {
        addPersonnel,
        updatePersonnel,
    },
    setup() {
        const value = ref("");
        const input = ref("");
        const tableData = ref([]);
        const currentPageData = ref([]);
        const personnelVisible = ref(false);
        const updatePersonnelVisible = ref(false);
        const showEditDialog = ref(false);
        const personnelFormRef = ref(null);

        const listQuery = ref({
            name: "",
            sort: "+id",
        });

        const pagination = ref({
            total: 0,
            page: 1,
            limit: 5,
        });

        const AddPersonnel = () => {
            personnelVisible.value = true;
        };
        const handleAddPersonnelClose = () => {
            personnelVisible.value = false;
        };

        const UpdatePersonnel = (row) => {
            updatePersonnelVisible.value = true;
            form.value = row;
            console.log(form);
        };

        const handleUpdatePersonnelClose = () => {
            updatePersonnelVisible.value = false;
        };

        const handlePageChange = (newPage) => {
            pagination.page = newPage;
            fetchPersonnel();
        };

        const fetchPersonnel = async () => {
            const url = "http://localhost:8080/api/getPersonnel";
            const requestData = {
                name: listQuery.value.name.trim(),
            };

            try {
                const response = await axios.post(url, requestData);
                console.log(response.data);
                tableData.value = response.data.list;
                pagination.value.total = response.data.total; // 设置总数据量
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        // 定义计算当前页的数据的ref
        const currentPage = computed(() => {
            const start = (pagination.value.page - 1) * pagination.value.limit;
            const end = start + pagination.value.limit;
            return tableData.value.slice(start, end);
        });

        // 定义计算排序后的列表的ref
        const sortedList = computed(() => {
            const clonedList = [...tableData.value]; // 克隆列表数据以避免直接修改原始数据

            if (listQuery.value.sort === "+id") {
                return clonedList.sort((a, b) => a.id - b.id); // 升序
            } else if (listQuery.value.sort === "-id") {
                return clonedList.sort((a, b) => b.id - a.id); // 降序
            }

            return clonedList; // 默认情况
        });

        // 监听 listQuery.sort 的变化
        watch(
            () => listQuery.value.sort,
            (newVal, oldVal) => {
                if (newVal !== oldVal) {
                    // 触发排序
                    handleSortChange();
                }
            }
        );
        const form = ref({
            id: "",
            name: "",
            password: "",
            email: "",
            role: "",
            birthday: null,
        });

        // 初始化时进行一次数据获取
        onMounted(() => {
            fetchPersonnel();
        });

        // 处理排序变化
        const handleSortChange = () => {
            // 在这里使用 sortedList.value 来获取排序后的数据
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
            personnelVisible,
            showEditDialog,
            personnelFormRef,
            currentPage,
            updatePersonnelVisible,
            handleSortChange,
            fetchPersonnel,
            handlePageChange,
            AddPersonnel,
            UpdatePersonnel,
            handleAddPersonnelClose,
            handleUpdatePersonnelClose,
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
