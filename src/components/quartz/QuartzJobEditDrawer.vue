<template>
  <v-navigation-drawer v-model="isOpen" location="right" width="450" temporary>
    <v-list-item title="Job 수정" class="py-4" />
    <v-divider />

    <div class="pa-4">
      <!-- 에러 메시지 -->
      <v-alert v-if="errorMsg" type="error" density="compact" class="mb-3">
        {{ errorMsg }}
      </v-alert>

      <v-text-field
        v-model="form.jobName"
        label="Job명"
        density="compact"
        readonly
        class="mb-2"
      />
      <v-text-field
        v-model="form.jobGroup"
        label="Job그룹"
        density="compact"
        readonly
        class="mb-2"
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
        density="compact"
        class="mb-2"
      />

      <!-- 선택 입력 -->
      <CronSelector v-else v-model="form.cronExpression" class="mb-2" />

      <v-text-field
        v-model="form.semester"
        label="학기"
        density="compact"
        class="mb-2"
      />
      <v-text-field v-model="form.description" label="설명" density="compact" />
    </div>

    <template #append>
      <v-divider />
      <div class="pa-3 d-flex justify-end gap-2">
        <v-btn variant="text" @click="close">취소</v-btn>
        <v-btn color="primary" variant="flat" @click="submit">저장</v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, watch } from "vue";
import CronSelector from "@/components/quartz/CronSelector.vue";

const props = defineProps({
  modelValue: Boolean,
  job: Object,
});

const emit = defineEmits(["update:modelValue", "saved"]);

const isOpen = ref(false);
const errorMsg = ref("");
const cronMode = ref("manual");

const form = ref({
  jobName: "",
  jobGroup: "",
  cronExpression: "",
  semester: "",
  description: "",
});

watch(
  () => props.modelValue,
  (val) => {
    isOpen.value = val;
    if (val && props.job) {
      errorMsg.value = "";
      cronMode.value = "manual";
      form.value = { ...props.job };
    }
  },
);

watch(isOpen, (val) => {
  emit("update:modelValue", val);
});

const close = () => {
  isOpen.value = false;
};

const submit = () => {
  errorMsg.value = "";
  emit("saved", { ...form.value });
};

const showError = (msg) => {
  errorMsg.value = msg;
};

defineExpose({ showError });
</script>
