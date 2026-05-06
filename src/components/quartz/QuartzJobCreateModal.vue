<template>
  <v-dialog v-model="isOpen" max-width="600" persistent>
    <v-card>
      <v-card-title class="pt-4">Job 등록</v-card-title>
      <v-divider />

      <v-card-text>
        <!-- 에러 메시지 -->
        <v-alert v-if="errorMsg" type="error" density="compact" class="mb-3">
          {{ errorMsg }}
        </v-alert>

        <v-text-field
          v-model="form.jobName"
          label="Job명"
          density="compact"
          class="mb-2"
        />
        <v-text-field
          v-model="form.jobGroup"
          label="Job그룹"
          density="compact"
          class="mb-2"
        />

        <!-- 실행 Job 선택 - API에서 동적으로 로드 -->
        <v-select
          v-model="form.jobBeanName"
          :items="jobBeanNames"
          label="실행 Job"
          density="compact"
          class="mb-2"
          :loading="jobBeansLoading"
          no-data-text="등록된 Job이 없습니다"
        />

        <!-- Cron 입력 방식 선택 -->
        <div class="mb-2">
          <v-label>Cron 입력 방식</v-label>
          <v-radio-group v-model="cronMode" inline density="compact">
            <v-radio label="직접 입력" value="manual" />
            <v-radio label="선택 입력" value="select" />
          </v-radio-group>
        </div>

        <!-- 직접 입력 -->
        <v-text-field
          v-if="cronMode === 'manual'"
          v-model="form.cronExpression"
          label="Cron 표현식"
          placeholder="0 0/1 * * * ?"
          density="compact"
          class="mb-2"
        />

        <!-- 선택 입력 -->
        <CronSelector v-else v-model="form.cronExpression" class="mb-2" />

        <!-- 학기 - snapshot Job일 때만 표시 -->
        <v-text-field
          v-if="isSnapshotJob"
          v-model="form.semester"
          label="학기"
          placeholder="2025-1"
          density="compact"
          class="mb-2"
        />

        <v-text-field
          v-model="form.description"
          label="설명"
          density="compact"
        />
      </v-card-text>

      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="close">취소</v-btn>
        <v-btn color="primary" variant="flat" @click="submit">저장</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import axios from "@/api/axios.js"; // ← 공통 인스턴스로 변경
import CronSelector from "@/components/quartz/CronSelector.vue";

const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(["update:modelValue", "saved"]);

const isOpen = ref(false);
const errorMsg = ref("");
const cronMode = ref("manual");
const jobBeanNames = ref([]);
const jobBeansLoading = ref(false);

const form = ref({
  jobName: "",
  jobGroup: "scholarship",
  cronExpression: "",
  semester: "",
  description: "",
  jobBeanName: "",
});

// snapshot Job일 때만 학기 필드 표시
const isSnapshotJob = computed(() =>
  form.value.jobBeanName?.toLowerCase().includes("snapshot"),
);

// Job Bean 목록 API 호출
const fetchJobBeans = async () => {
  jobBeansLoading.value = true;
  try {
    const res = await axios.get("/api/quartz/job-beans");
    jobBeanNames.value = res.data; // ← 인터셉터가 response.data 반환하므로 .data만
  } catch (e) {
    console.error("Job Bean 목록 조회 실패", e);
  } finally {
    jobBeansLoading.value = false;
  }
};

const resetForm = () => {
  errorMsg.value = "";
  cronMode.value = "manual";
  form.value = {
    jobName: "",
    jobGroup: "scholarship",
    cronExpression: "",
    semester: "",
    description: "",
    jobBeanName: "",
  };
};

watch(
  () => props.modelValue,
  (val) => {
    isOpen.value = val;
    if (val) {
      resetForm();
      fetchJobBeans();
    }
  },
);

watch(isOpen, (val) => {
  emit("update:modelValue", val);
});

// jobBeanName 변경 시 semester 초기화
watch(
  () => form.value.jobBeanName,
  () => {
    form.value.semester = "";
  },
);

const close = () => {
  isOpen.value = false;
};

const submit = () => {
  errorMsg.value = "";

  if (!form.value.jobName) {
    errorMsg.value = "Job명을 입력해주세요.";
    return;
  }
  if (!form.value.jobBeanName) {
    errorMsg.value = "실행 Job을 선택해주세요.";
    return;
  }
  if (!form.value.cronExpression) {
    errorMsg.value = "Cron 표현식을 입력해주세요.";
    return;
  }

  emit("saved", { ...form.value });
  close();  // ← 추가
};

const showError = (msg) => {
  errorMsg.value = msg;
};

defineExpose({ showError });
</script>
