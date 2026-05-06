<template>
  <div class="ag-grid-wrapper">
    <AgGridVue
      style="width: 100%; height: 400px"
      :rowData="jobs"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :rowSelection="rowSelection"
      :theme="theme"
      @grid-ready="onGridReady"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

defineProps({
  jobs: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["log", "edit", "trigger", "delete"]);

const theme = themeQuartz;

const rowSelection = { mode: "singleRow" };

const actionCellRenderer = (params) => {
  const wrapper = document.createElement("div");

  const logBtn = document.createElement("button");
  logBtn.innerText = "로그";
  logBtn.style.cssText =
    "margin-right:4px; padding:2px 8px; background:#1E88E5; color:white; border:none; border-radius:4px; cursor:pointer;";
  logBtn.onclick = () => emit("log", params.data);

  const editBtn = document.createElement("button");
  editBtn.innerText = "수정";
  editBtn.style.cssText =
    "margin-right:4px; padding:2px 8px; background:#FB8C00; color:white; border:none; border-radius:4px; cursor:pointer;";
  editBtn.onclick = () => emit("edit", params.data);

  const triggerBtn = document.createElement("button");
  triggerBtn.innerText = "즉시실행";
  triggerBtn.style.cssText =
    "margin-right:4px; padding:2px 8px; background:#43A047; color:white; border:none; border-radius:4px; cursor:pointer;";
  triggerBtn.onclick = () => emit("trigger", params.data);

  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "삭제";
  deleteBtn.style.cssText =
    "padding:2px 8px; background:#E53935; color:white; border:none; border-radius:4px; cursor:pointer;";
  deleteBtn.onclick = () => emit("delete", params.data);

  wrapper.appendChild(logBtn);
  wrapper.appendChild(editBtn);
  wrapper.appendChild(triggerBtn);
  wrapper.appendChild(deleteBtn);
  return wrapper;
};

const columnDefs = ref([
  { field: "jobName", headerName: "Job명", flex: 2 },
  { field: "jobGroup", headerName: "Job그룹", flex: 1 },
  { field: "cronExpression", headerName: "Cron 표현식", flex: 2 },
  { field: "triggerState", headerName: "상태", flex: 1 },
  { field: "nextFireTime", headerName: "다음 실행시간", flex: 2 },
  { headerName: "관리", flex: 3, cellRenderer: actionCellRenderer },
]);

const defaultColDef = ref({
  sortable: true,
  filter: true,
  resizable: true,
});

const onGridReady = (params) => {
  params.api.sizeColumnsToFit();
};
</script>
