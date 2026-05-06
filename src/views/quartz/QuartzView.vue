<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Quartz Job 관리</h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            Job 목록
            <v-spacer />
            <v-btn color="secondary" class="mr-2" @click="loadJobList"
              >새로고침</v-btn
            >
            <v-btn color="primary" @click="createModal = true">Job 등록</v-btn>
          </v-card-title>
          <v-card-text>
            <QuartzJobTable
              :jobs="jobList"
              @edit="openEditDrawer"
              @trigger="triggerJob"
              @delete="deleteJob"
              @log="openLogDrawer"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 등록 모달 -->
    <QuartzJobCreateModal
      ref="createModalRef"
      v-model="createModal"
      @saved="onJobCreated"
    />

    <!-- 수정 드로어 -->
    <QuartzJobEditDrawer
      ref="editDrawerRef"
      v-model="editDrawer"
      :job="selectedJob"
      @saved="onJobUpdated"
    />

    <!-- 배치 로그 드로어 -->
    <QuartzBatchLogDrawer v-model="logDrawer" :jobName="selectedJobName" />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  getJobList,
  createJob,
  updateJob,
  triggerJob as apiTriggerJob,
  deleteJob as apiDeleteJob,
} from "@/api/quartzApi";
import QuartzJobTable from "@/components/quartz/QuartzJobTable.vue";
import QuartzJobCreateModal from "@/components/quartz/QuartzJobCreateModal.vue";
import QuartzJobEditDrawer from "@/components/quartz/QuartzJobEditDrawer.vue";
import QuartzBatchLogDrawer from "@/components/quartz/QuartzBatchLogDrawer.vue";

const jobList = ref([]);
const createModal = ref(false);
const editDrawer = ref(false);
const logDrawer = ref(false);
const selectedJob = ref(null);
const selectedJobName = ref("");
const createModalRef = ref(null);
const editDrawerRef = ref(null);

const loadJobList = async () => {
  const res = await getJobList();
  jobList.value = res.data ?? [];
};

const onJobCreated = async (formData) => {
  try {
    await createJob(formData);
    await loadJobList();
  } catch (e) {
    createModalRef.value?.showError(e.message);
  }
};

const openEditDrawer = (job) => {
  selectedJob.value = job;
  editDrawer.value = true;
};

const onJobUpdated = async (formData) => {
  try {
    await updateJob(formData);
    await loadJobList();
  } catch (e) {
    editDrawerRef.value?.showError(e.message);
  }
};

const openLogDrawer = (job) => {
  selectedJobName.value = job.jobName;
  logDrawer.value = true;
};

const triggerJob = async (job) => {
  await apiTriggerJob(job.jobGroup, job.jobName);
  alert(`${job.jobName} 실행 완료`);
};

const deleteJob = async (job) => {
  if (!confirm(`${job.jobName} 을 삭제하시겠습니까?`)) return;
  await apiDeleteJob(job.jobGroup, job.jobName);
  await loadJobList();
};

onMounted(() => {
  loadJobList();
});
</script>
