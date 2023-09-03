<template>
    <div class="app">
        <Menu />
        <h1 style="margin-top: 50px; margin-left: 40px">
            課<br />
            程<br />
            列<br />
            表
        </h1>
        <div class="app-container" style="width: 70vw; margin: 0 auto">
            <div class="filter-container">
                <el-input
                    v-model="listQuery.courseTitle"
                    placeholder="title"
                    style="width: 180px; height: 65px"
                    class="filter-item"
                />

                <el-button
                    type="primary"
                    round
                    style="margin-left: 12px"
                    @click="fetchCourse"
                    >Search</el-button
                >
                <el-button
                    type="primary"
                    round
                    style="margin-left: 12px"
                    @click="AddCourse"
                >
                    AddCourse
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
                        label="Code"
                        prop="courseCode"
                        :sortable="
                            listQuery.sort === '+id' || listQuery.sort === '-id'
                        "
                        align="center"
                        width="80"
                    >
                        <template #default="{ row }">
                            <span>{{ row.courseCode }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="Title"
                        prop="courseTitle"
                        min-width="60px"
                    >
                        <template #default="{ row }">
                            <span class="link-type">{{ row.courseTitle }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="Instructor"
                        prop="courseInstructor"
                        min-width="80px"
                    >
                        <template #default="{ row }">
                            <span class="link-type">{{
                                row.courseInstructor
                            }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="Description"
                        prop="courseDescription"
                        min-width="100px"
                    >
                        <template #default="{ row }">
                            <span class="link-type">{{
                                row.courseDescription
                            }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="City"
                        prop="classCity"
                        min-width="60px"
                    >
                        <template #default="{ row }">
                            <span class="link-type">{{ row.classCity }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="Enable"
                        prop="classEnable"
                        min-width="60px"
                    >
                        <template #default="{ row }">
                            <span class="link-type">{{
                                row.enable ? "開課中" : "未開課"
                            }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="Operate"
                        align="center"
                        width="450"
                        class-name="small-padding fixed-width"
                    >
                        <template #default="{ row }">
                            <el-button
                                type="primary"
                                round
                                @click="UpdateCourse(row)"
                                >Revise</el-button
                            >

                            <el-button
                                type="info"
                                round
                                @click="DetailsCourse(row)"
                                >Details</el-button
                            >
                            <el-button
                                type="success"
                                round
                                @click="AddSchedule(row)"
                                >AddSchedule</el-button
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
    <addCourse v-if="courseVisible" @close="handleAddCourseClose" />
    <updateCourse
        v-if="updateCourseVisible"
        :visible="updateCourseVisible.value"
        :obData="form"
        @close="handleUpdateCourseClose"
    />
    <detailsCourse
        v-if="detailsCourseVusuble"
        :visible="detailsCourseVusuble.value"
        :obData="form"
        @close="handleDetailsCourseClose"
    />
    <addSchedule
        v-if="addScheduleVusble"
        :visible="addScheduleVusble.value"
        :obData="form"
        @close="handleAddScheduleClose"
    />
</template>

<script>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import addCourse from "../components/Course.vue";
import updateCourse from "../components/CourseUpdate.vue";
import detailsCourse from "../components/CourseDetails.vue";
import addSchedule from "../components/Schedule.vue";
export default {
    props: {},
    components: {
        addCourse,
        updateCourse,
        detailsCourse,
        addSchedule,
    },
    setup() {
        const value = ref("");
        const input = ref("");
        const tableData = ref([]);
        const currentPageData = ref([]);
        const courseVisible = ref(false);
        const updateCourseVisible = ref(false);
        const detailsCourseVusuble = ref(false);
        const addScheduleVusble = ref(false);
        const showEditDialog = ref(false);

        const listQuery = ref({
            courseTitle: "",
            sort: "+id",
        });

        const pagination = ref({
            total: 0,
            page: 1,
            limit: 5,
        });

        const AddCourse = () => {
            courseVisible.value = true;
        };
        const handleAddCourseClose = () => {
            courseVisible.value = false;
        };

        const UpdateCourse = (row) => {
            updateCourseVisible.value = true;
            form.value = row;
        };

        const handleUpdateCourseClose = () => {
            updateCourseVisible.value = false;
        };

        const DetailsCourse = (row) => {
            detailsCourseVusuble.value = true;
            form.value = row;
        };

        const handleDetailsCourseClose = () => {
            detailsCourseVusuble.value = false;
        };

        const AddSchedule = (row) => {
            addScheduleVusble.value = true;
            form.value = row;
        };

        const handleAddScheduleClose = () => {
            addScheduleVusble.value = false;
        };

        const handlePageChange = (newPage) => {
            pagination.page = newPage;
            fetchCourse();
        };

        const fetchCourse = async () => {
            const url = "http://localhost:8080/api/getCourse";
            const requestData = {
                courseTitle: listQuery.value.courseTitle.trim(),
            };
            try {
                const response = await axios.post(url, requestData);
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
                    classEnable: "",
                    classCity: "",
                    personnel: "",
                },
            ],
        });

        // 進網頁時自動刷新列表
        onMounted(() => {
            fetchCourse();
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
            currentPage,
            courseVisible,
            updateCourseVisible,
            detailsCourseVusuble,
            addScheduleVusble,
            handleSortChange,
            fetchCourse,
            handlePageChange,
            AddCourse,
            UpdateCourse,
            DetailsCourse,
            AddSchedule,
            handleAddCourseClose,
            handleUpdateCourseClose,
            handleDetailsCourseClose,
            handleAddScheduleClose,
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
