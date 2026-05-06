<template>
  <v-navigation-drawer v-model="isOpen" location="right" width="700" temporary>
    <v-list-item :title="`배치 로그 - ${jobName}`" class="py-4" />
    <v-divider />

    <div class="pa-4">
      <!-- 로그 목록 -->
      <div class="text-subtitle-2 mb-2">실행 이력 (최근 20건)</div>
      <AgGridVue
        style="width: 100%; height: 200px"
        :rowData="logList"
        :columnDefs="logColumnDefs"
        :defaultColDef="defaultColDef"
        :theme="theme"
        @grid-ready="onLogGridReady"
        @row-clicked="onLogRowClick"
      />

      <!-- 로그 상세 -->
      <div class="text-subtitle-2 mt-4 mb-2">
        처리 상세
        <span v-if="selectedLog" class="text-caption text-grey ml-2">
          ({{ selectedLog.semester }} / 총 {{ selectedLog.totalCount }}건)
        </span>
      </div>
      <AgGridVue
        style="width: 100%; height: 300px"
        :rowData="detailList"
        :columnDefs="detailColumnDefs"
        :defaultColDef="defaultColDef"
        :theme="theme"
      />
    </div>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, watch } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";
import { getBatchLogs, getBatchLogDetails } from "@/api/quartzApi";

ModuleRegistry.registerModules([AllCommunityModule]);

const props = defineProps({
  modelValue: Boolean,
  jobName: String,
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);
const logList = ref([]);
const detailList = ref([]);
const selectedLog = ref(null);
const theme = themeQuartz;

watch(
  () => props.modelValue,
  async (val) => {
    isOpen.value = val;
    if (val && props.jobName) {
      await loadLogs();
    }
  },
);

watch(isOpen, (val) => {
  emit("update:modelValue", val);
});

const loadLogs = async () => {
  const res = await getBatchLogs(props.jobName);
  logList.value = res.data ?? [];
  detailList.value = [];
  selectedLog.value = null;
};

const onLogRowClick = async (event) => {
  selectedLog.value = event.data;
  const res = await getBatchLogDetails(props.jobName, event.data.id);
  detailList.value = res.data ?? [];
};

const onLogGridReady = (params) => {
  params.api.sizeColumnsToFit();
};

const logColumnDefs = ref([
  { field: "id", headerName: "ID", flex: 1 },
  { field: "semester", headerName: "학기", flex: 1 },
  { field: "status", headerName: "상태", flex: 1 },
  { field: "totalCount", headerName: "전체", flex: 1 },
  { field: "successCount", headerName: "성공", flex: 1 },
  { field: "failCount", headerName: "실패", flex: 1 },
  { field: "startedAt", headerName: "시작시간", flex: 2 },
  { field: "endedAt", headerName: "종료시간", flex: 2 },
]);

const detailColumnDefs = ref([
  { field: "scholarshipNo", headerName: "장학금번호", flex: 2 },
  { field: "status", headerName: "상태", flex: 1 },
  { field: "errorMessage", headerName: "오류메시지", flex: 3 },
  { field: "createdAt", headerName: "처리시간", flex: 2 },
]);

const defaultColDef = ref({
  sortable: true,
  filter: true,
  resizable: true,
});
</script>
